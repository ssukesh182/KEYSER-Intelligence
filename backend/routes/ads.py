import os
import requests
from flask import Blueprint, jsonify, g
from utils.auth import require_auth
from models.user import UserCompetitor
from models.review import RawAd
from extensions import db

bp = Blueprint("ads", __name__, url_prefix="/api/ads")

@bp.route("", methods=["GET"])
@require_auth
def get_ads():
    user = g.user
    existing = RawAd.query.filter_by(user_id=user.id).all()
    
    if not existing:
        # Initial fetch
        user_comps = UserCompetitor.query.filter_by(user_id=user.id).all()
        api_key = os.environ.get("SERPAPI_KEY", os.environ.get("VITE_SERP_API_KEY", ""))
        
        for c in user_comps:
            cat = user.category or ""
            query = f"{c.competitor_name} {cat} ads".strip()
            params = {
                "engine": "google",
                "q": query,
                "api_key": api_key,
                "num": 3
            }
            try:
                resp = requests.get("https://serpapi.com/search.json", params=params)
                data = resp.json()
                items = data.get("ads", []) or data.get("organic_results", [])[:3]
                
                for item in items:
                    ad = RawAd(
                        user_id=user.id,
                        competitor_name=c.competitor_name,
                        headline=item.get("title"),
                        summary=item.get("description", item.get("snippet", "")),
                        keyword=query,
                        channel="Google Search",
                        thumbnail="https://placehold.co/400x200/2a2a2a/ffffff?text=Ad+Creative",
                        source_link=item.get("link")
                    )
                    db.session.add(ad)
            except:
                pass
        db.session.commit()
        existing = RawAd.query.filter_by(user_id=user.id).all()

    return jsonify([a.to_dict() for a in existing])

@bp.route("/refresh", methods=["POST"])
@require_auth
def refresh_ads():
    user = g.user
    RawAd.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    return get_ads()
