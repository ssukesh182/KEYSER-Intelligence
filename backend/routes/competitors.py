from flask import Blueprint, jsonify, request
from extensions import db
from models     import Competitor, Source

bp = Blueprint("competitors", __name__, url_prefix="/api/competitors")


@bp.route("", methods=["GET"])
def list_competitors():
    """GET /api/competitors — return all competitors with their sources."""
    print("[ROUTE] GET /api/competitors")
    try:
        competitors = db.session.query(Competitor).all()
        data = []
        for c in competitors:
            d = c.to_dict()
            d["sources"] = [s.to_dict() for s in c.sources]
            data.append(d)
        print(f"[ROUTE] Returning {len(data)} competitors")
        return jsonify({"success": True, "data": data, "count": len(data)})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/competitors: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/<int:competitor_id>", methods=["GET"])
def get_competitor(competitor_id):
    """GET /api/competitors/<id>"""
    print(f"[ROUTE] GET /api/competitors/{competitor_id}")
    try:
        c = db.session.query(Competitor).get(competitor_id)
        if not c:
            return jsonify({"success": False, "error": "Competitor not found"}), 404
        d = c.to_dict()
        d["sources"]  = [s.to_dict() for s in c.sources]
        d["insights"] = [i.to_dict() for i in c.insights]
        return jsonify({"success": True, "data": d})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/competitors/{competitor_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("", methods=["POST"])
def create_competitor():
    """POST /api/competitors — add a new competitor."""
    print("[ROUTE] POST /api/competitors")
    try:
        body = request.get_json()
        if not body or not body.get("name"):
            return jsonify({"success": False, "error": "name is required"}), 400

        competitor = Competitor(
            name        = body["name"],
            description = body.get("description", ""),
            industry    = body.get("industry", "q-commerce"),
            logo_url    = body.get("logo_url", ""),
        )
        db.session.add(competitor)
        db.session.commit()
        db.session.refresh(competitor)

        # Add sources if provided
        sources_added = []
        for src in body.get("sources", []):
            source = Source(
                competitor_id = competitor.id,
                url           = src["url"],
                source_type   = src.get("source_type", "website"),
                label         = src.get("label", ""),
            )
            db.session.add(source)
            sources_added.append(source)
        db.session.commit()

        print(f"[ROUTE] Created competitor: id={competitor.id}, name={competitor.name}")
        d = competitor.to_dict()
        d["sources"] = [s.to_dict() for s in sources_added]
        return jsonify({"success": True, "data": d}), 201
    except Exception as e:
        db.session.rollback()
        print(f"[ROUTE] ERROR POST /api/competitors: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
