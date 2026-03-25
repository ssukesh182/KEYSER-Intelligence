from flask import Blueprint, jsonify, request
from extensions import db
from models     import Diff, Source, Competitor

bp = Blueprint("diffs", __name__, url_prefix="/api/diffs")


@bp.route("", methods=["GET"])
def list_diffs():
    """
    GET /api/diffs
    Query params: competitor_id, source_id, change_type, min_significance, limit
    """
    print("[ROUTE] GET /api/diffs")
    try:
        competitor_id    = request.args.get("competitor_id", type=int)
        source_id        = request.args.get("source_id", type=int)
        change_type      = request.args.get("change_type")
        min_significance = request.args.get("min_significance", 0.0, type=float)
        limit            = request.args.get("limit", 50, type=int)

        q = (
            db.session.query(Diff)
            .join(Source, Diff.source_id == Source.id)
            .order_by(Diff.created_at.desc())
        )

        if competitor_id:
            q = q.filter(Source.competitor_id == competitor_id)
        if source_id:
            q = q.filter(Diff.source_id == source_id)
        if change_type:
            q = q.filter(Diff.change_type == change_type)
        if min_significance:
            q = q.filter(Diff.significance >= min_significance)

        diffs = q.limit(limit).all()
        print(f"[ROUTE] Returning {len(diffs)} diffs")
        return jsonify({"success": True, "data": [d.to_dict() for d in diffs], "count": len(diffs)})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/diffs: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/<int:diff_id>", methods=["GET"])
def get_diff(diff_id):
    """GET /api/diffs/<id> — returns full diff text."""
    print(f"[ROUTE] GET /api/diffs/{diff_id}")
    try:
        diff = db.session.query(Diff).get(diff_id)
        if not diff:
            return jsonify({"success": False, "error": "Diff not found"}), 404
        return jsonify({"success": True, "data": diff.to_dict()})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/diffs/{diff_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
