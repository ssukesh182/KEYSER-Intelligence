from flask import Blueprint, jsonify
from services.pipelines.whitespace_pipeline import run_whitespace_radar
import traceback

bp = Blueprint("whitespace", __name__, url_prefix="/api/whitespace")

@bp.route("/", methods=["GET"])
def get_whitespace():
    try:
        angles = run_whitespace_radar()
        return jsonify({"success": True, "data": angles})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
