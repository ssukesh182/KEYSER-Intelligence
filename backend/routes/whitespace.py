from flask import Blueprint, jsonify, g
from services.pipelines.whitespace_pipeline import run_whitespace_radar
from utils.auth import require_auth
from models.user import UserCompetitor
import traceback

bp = Blueprint("whitespace", __name__, url_prefix="/api/whitespace")

@bp.route("/", methods=["GET"])
@require_auth
def get_whitespace():
    try:
        user = g.user
        user_comps = UserCompetitor.query.filter_by(user_id=user.id).all()
        comp_names = [c.competitor_name for c in user_comps]
        
        result = run_whitespace_radar(
            user_id=user.id, 
            competitors=comp_names, 
            user_usp=user.usp
        )
        return jsonify({"success": True, "data": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
