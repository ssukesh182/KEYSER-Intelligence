from flask import Blueprint, jsonify, request, g
from extensions import db
from models     import Insight, InsightSource, Competitor
from utils.auth import require_auth

bp = Blueprint("insights", __name__, url_prefix="/api/insights")


@bp.route("", methods=["GET"])
@require_auth
def list_insights():
    """
    GET /api/insights
    Query params: competitor_id, category, min_confidence, limit
    """
    from models.user import UserCompetitor
    user = g.user
    
    try:
        competitor_id  = request.args.get("competitor_id", type=int)
        category       = request.args.get("category")
        min_confidence = request.args.get("min_confidence", 0.0, type=float)
        limit          = request.args.get("limit", 50, type=int)

        # Base query joining with Competitor to allow filtering by name or user preference
        q = db.session.query(Insight).join(Competitor).order_by(
            Insight.confidence.desc(), Insight.created_at.desc()
        )

        # If user is onboarded, filter by their tracked competitors by default
        if user.is_onboarded:
            user_comps = UserCompetitor.query.filter_by(user_id=user.id).all()
            comp_names = [c.competitor_name for c in user_comps]
            if comp_names:
                q = q.filter(Competitor.name.in_(comp_names))

        if competitor_id:
            q = q.filter(Insight.competitor_id == competitor_id)
        if category:
            q = q.filter(Insight.category == category)
        if min_confidence:
            q = q.filter(Insight.confidence >= min_confidence)

        insights = q.limit(limit).all()
        data = []
        for ins in insights:
            d = ins.to_dict()
            # Include source traceability
            d["sources"] = [s.to_dict() for s in ins.sources]
            d["competitor_name"] = ins.competitor.name if ins.competitor else None
            data.append(d)

        print(f"[ROUTE] Returning {len(data)} insights")
        return jsonify({"success": True, "data": data, "count": len(data)})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/insights: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/<int:insight_id>", methods=["GET"])
def get_insight(insight_id):
    """GET /api/insights/<id> — returns full insight with traceability."""
    print(f"[ROUTE] GET /api/insights/{insight_id}")
    try:
        ins = db.session.query(Insight).get(insight_id)
        if not ins:
            return jsonify({"success": False, "error": "Insight not found"}), 404
        d = ins.to_dict()
        d["sources"]         = [s.to_dict() for s in ins.sources]
        d["competitor_name"] = ins.competitor.name if ins.competitor else None
        return jsonify({"success": True, "data": d})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/insights/{insight_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
