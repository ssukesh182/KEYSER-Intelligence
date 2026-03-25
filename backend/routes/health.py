from flask import Blueprint, jsonify
from extensions import db

bp = Blueprint("health", __name__, url_prefix="/api/health")


@bp.route("", methods=["GET"])
def health_check():
    """GET /api/health — returns DB and system status."""
    print("[ROUTE] GET /api/health")
    status = {"db": "unknown", "overall": "unknown"}

    try:
        db.session.execute(db.text("SELECT 1"))
        status["db"] = "ok"
        print("[HEALTH] DB connection: OK")
    except Exception as e:
        status["db"] = f"error: {str(e)}"
        print(f"[HEALTH] DB connection ERROR: {e}")

    status["overall"] = "ok" if status["db"] == "ok" else "degraded"

    code = 200 if status["overall"] == "ok" else 503
    return jsonify({"success": status["overall"] == "ok", "status": status}), code
