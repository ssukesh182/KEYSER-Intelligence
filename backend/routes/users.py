import logging
from flask import Blueprint, request, jsonify, g
from extensions import db
from models.user import User, UserCompetitor
from utils.auth import require_auth
from services.llm.ollama_client import OllamaClient
import json

bp = Blueprint("users", __name__, url_prefix="/api/users")
logger = logging.getLogger(__name__)

@bp.route("/sync", methods=["POST"])
@require_auth
def sync_user():
    """
    Called on login to sync Firebase user with local profile.
    Returns onboarding status.
    """
    user = g.user
    return jsonify({
        "profile_complete": user.is_onboarded,
        "email": user.email,
        "company_name": user.company_name
    })

@bp.route("/profile", methods=["POST"])
@require_auth
def update_profile():
    """
    Saves onboarding data and finalizes profile.
    """
    user = g.user
    data = request.json
    
    user.company_name = data.get("company_name")
    user.website_url = data.get("website_url")
    user.category = data.get("category")
    user.tagline = data.get("tagline")
    user.target_audience = data.get("target_audience")
    user.usp = data.get("usp")
    user.is_onboarded = True
    
    # Update competitors
    tracked = data.get("tracked_competitors", [])
    # Clean old ones
    UserCompetitor.query.filter_by(user_id=user.id).delete()
    
    for comp in tracked:
        new_comp = UserCompetitor(
            user_id=user.id,
            competitor_name=comp.get("name"),
            competitor_url=comp.get("url")
        )
        db.session.add(new_comp)
        
    db.session.commit()
    return jsonify({"success": True})

@bp.route("/onboarding/suggest", methods=["POST"])
@require_auth
def suggest_competitors():
    """
    AI Suggester: Uses SerpAPI Web Search + Gemma to find competitors.
    """
    user = g.user
    data = request.json
    company_name = data.get("company_name")
    category = data.get("category")
    website_url = data.get("website_url")
    initial_competitors = data.get("initial_competitors", [])
    
    # 1. Perform Web Search using SerpAPI
    import requests
    from config import SERPAPI_KEY
    
    search_query = f"top competitors and alternatives for {company_name} {website_url} {category}"
    search_params = {
        "engine": "google",
        "q": search_query,
        "api_key": SERPAPI_KEY,
        "num": 5
    }
    
    search_context = ""
    try:
        resp = requests.get("https://serpapi.com/search", params=search_params)
        results = resp.json().get("organic_results", [])
        search_context = "\n".join([f"- {r.get('title')}: {r.get('snippet')} ({r.get('link')})" for r in results])
    except Exception as e:
        logger.error(f"SerpAPI search failed: {e}")
        search_context = "Web search failed, relying on internal 2024 knowledge."

    # 2. Gemma Analysis
    client = OllamaClient(model="gemma3:4b")
    
    prompt = f"""
    The user runs a company '{company_name}' in the '{category}' space.
    Website: {website_url}
    
    WEB SEARCH RESULTS:
    {search_context}
    
    Based on the above search results and your knowledge, suggest 4 direct or emerging competitors.
    Respond in STRICT JSON FORMAT.
    
    OUTPUT SCHEMA:
    {{
        "suggestions": [
            {{"name": "Competitor Name", "url": "website url", "reason": "why they compete with {company_name}"}}
        ],
        "market_gap": "A short 1-sentence whitespace identified based on their USP: {data.get('usp')}"
    }}
    """
    
    try:
        response = client.generate(prompt)
        # Extract JSON
        if "{" in response:
            json_str = response[response.find("{"):response.rfind("}")+1]
            return jsonify(json.loads(json_str))
        return jsonify({"error": "Failed to generate suggestions"}), 500
    except Exception as e:
        logger.error(f"Onboarding suggestion failed: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route("/competitors", methods=["GET"])
@require_auth
def get_user_competitors():
    user = g.user
    competitors = UserCompetitor.query.filter_by(user_id=user.id).all()
    return jsonify([
        {"name": c.competitor_name, "url": c.competitor_url} for c in competitors
    ])
