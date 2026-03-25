from flask import Blueprint, jsonify, request
from extensions import db
from models     import Snapshot, Source
from services.scraper import scrape_and_store

bp = Blueprint("snapshots", __name__, url_prefix="/api/snapshots")


@bp.route("", methods=["GET"])
def list_snapshots():
    """GET /api/snapshots?source_id=X&limit=10"""
    print("[ROUTE] GET /api/snapshots")
    try:
        source_id = request.args.get("source_id", type=int)
        limit     = request.args.get("limit", 10, type=int)
        q = db.session.query(Snapshot).order_by(Snapshot.scraped_at.desc())
        if source_id:
            q = q.filter(Snapshot.source_id == source_id)
        snapshots = q.limit(limit).all()
        print(f"[ROUTE] Returning {len(snapshots)} snapshots")
        return jsonify({"success": True, "data": [s.to_dict() for s in snapshots]})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/snapshots: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/<int:snapshot_id>", methods=["GET"])
def get_snapshot(snapshot_id):
    """GET /api/snapshots/<id>?include_text=true"""
    print(f"[ROUTE] GET /api/snapshots/{snapshot_id}")
    try:
        include_text = request.args.get("include_text", "false").lower() == "true"
        s = db.session.query(Snapshot).get(snapshot_id)
        if not s:
            return jsonify({"success": False, "error": "Snapshot not found"}), 404
        return jsonify({"success": True, "data": s.to_dict(include_text=include_text)})
    except Exception as e:
        print(f"[ROUTE] ERROR GET /api/snapshots/{snapshot_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/trigger", methods=["POST"])
def trigger_scrape():
    """POST /api/snapshots/trigger — manually trigger scrape for a source or global scrape in background."""
    print("[ROUTE] POST /api/snapshots/trigger")
    try:
        body      = request.get_json(silent=True) or {}
        source_id = body.get("source_id")

        if source_id:
            # Specific source scrape manually
            source = db.session.query(Source).get(source_id)
            if not source:
                return jsonify({"success": False, "error": "Source not found"}), 404

            print(f"[ROUTE] Triggering scrape for source_id={source_id}, url={source.url}")
            snapshot = scrape_and_store(source, db.session)

            if not snapshot:
                return jsonify({"success": False, "error": "Scrape failed — check logs"}), 500

            return jsonify({"success": True, "data": snapshot.to_dict()}), 201
        
        else:
            # Background global scrape if no specific source_id is passed
            from workers.tasks import scrape_all_sources_task
            task = scrape_all_sources_task.delay()
            print(f"[ROUTE] Queued global scrape task_id={task.id}")
            return jsonify({
                "success": True, 
                "message": "Background scrape triggered", 
                "task_id": task.id
            }), 202

    except Exception as e:
        print(f"[ROUTE] ERROR POST /api/snapshots/trigger: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
