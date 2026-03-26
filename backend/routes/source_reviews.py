import os
import time
import requests
import praw
import logging
from bs4 import BeautifulSoup
from flask import Blueprint, jsonify, g
from utils.auth import require_auth
from models.user import UserCompetitor
from models.review import RawReview
from extensions import db

bp = Blueprint("source_reviews", __name__, url_prefix="/api/source")
logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# 1. SERP API Google Search Reviews
# ──────────────────────────────────────────────────────────────────────────────
def fetch_serp_reviews(user_id, competitors):
    api_key = os.environ.get("SERP_API_KEY", os.environ.get("VITE_SERP_API_KEY", ""))
    if not api_key:
        logger.warning("[SERP] No API key found.")
        return []

    normalized = []
    for comp_name in competitors:
        query = f"{comp_name} app review OR service feedback"
        params = {
            "engine": "google",
            "q": query,
            "location": "India",
            "api_key": api_key,
            "num": 5
        }
        try:
            response = requests.get("https://serpapi.com/search.json", params=params, timeout=10)
            data = response.json()
            results = data.get("organic_results", [])
            for item in results[:5]:
                review = RawReview(
                    user_id=user_id,
                    competitor_name=comp_name,
                    source="serp_google",
                    reviewer=item.get("source", "Google"),
                    rating=3,
                    review_text=item.get("snippet", item.get("title", "")),
                    review_time=item.get("date", "")
                )
                db.session.add(review)
                normalized.append(review)
        except Exception as e:
            logger.error(f"[SERP] Error for '{comp_name}': {e}")
    
    db.session.commit()
    return normalized

# ──────────────────────────────────────────────────────────────────────────────
# 2. Reddit API Reviews
# ──────────────────────────────────────────────────────────────────────────────
def fetch_reddit_reviews(user_id=None, competitors=None):
    if competitors is None:
        # Global fallback or empty
        competitors = []
    
    if not competitors: return []
    query = " OR ".join(competitors)
    url = "https://www.reddit.com/r/india+bangalore+chennai+grocerydelivery/search.json"
    params = {
        "q": query,
        "restrict_sr": "on",
        "sort": "new",
        "limit": 30
    }
    headers = {"User-Agent": "KEYSER_Bot/1.0"}
    
    normalized = []
    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        posts = data.get("data", {}).get("children", [])
        
        for post in posts:
            p = post.get("data", {})
            text = f"{p.get('title')}\n{p.get('selftext')}"
            
            # Detect which competitor this refers to
            comp_name = "General"
            for c in competitors:
                if c.lower() in text.lower():
                    comp_name = c
                    break
            
            if user_id:
                review = RawReview(
                    user_id=user_id,
                    competitor_name=comp_name,
                    source="reddit",
                    reviewer=p.get("author"),
                    rating=3,
                    review_text=text[:2000],
                    review_time=str(p.get("created_utc"))
                )
                db.session.add(review)
            
            normalized.append({
                "source": "reddit",
                "competitor": comp_name,
                "reviewer": p.get("author"),
                "rating": 3,
                "review_text": text[:2000],
                "review_time": str(p.get("created_utc"))
            })
        if user_id:
            db.session.commit()
    except Exception as e:
        logger.error(f"[Reddit] Error: {e}")
    return normalized

def fetch_trustpilot_reviews(user_id=None, competitors=None):
    """Stub for Trustpilot reviews (to be implemented)."""
    logger.info("[Trustpilot] Stub called. No implementation yet.")
    return []

# ──────────────────────────────────────────────────────────────────────────────
# 3. Master Aggregation API with Persistence 
# ──────────────────────────────────────────────────────────────────────────────
@bp.route("/all-reviews", methods=["GET"])
@require_auth
def get_all_reviews():
    user = g.user
    
    # Get user's tracked competitors
    user_comps = UserCompetitor.query.filter_by(user_id=user.id).all()
    comp_names = [c.competitor_name for c in user_comps]
    
    # 1. Check if we have recent cached results (within last 1 hour)
    existing = RawReview.query.filter_by(user_id=user.id).all()
    
    # If no data, perform a first-time fetch
    if not existing and comp_names:
        logger.info(f"[Ingestion] First-time fetch for user {user.id}")
        # Fetch sequentially (could be async in future)
        fetch_serp_reviews(user.id, comp_names)
        fetch_reddit_reviews(user.id, comp_names)
        # Re-query
        existing = RawReview.query.filter_by(user_id=user.id).all()
    
    return jsonify({
        "total_reviews": len(existing),
        "reviews": [r.to_dict() for r in existing],
        "cached": True if existing else False
    })

@bp.route("/refresh", methods=["POST"])
@require_auth
def refresh_reviews():
    """Forces a new fetch and clears cache."""
    user = g.user
    RawReview.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    return get_all_reviews()
