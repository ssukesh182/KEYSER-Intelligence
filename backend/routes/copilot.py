from flask import Blueprint, jsonify, request
from services.pipelines.copilot_pipeline import process_copilot_chat
import traceback

bp = Blueprint("copilot", __name__, url_prefix="/api/copilot")

@bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json or {}
        message = data.get("message", "")
        
        if not message:
            return jsonify({"success": False, "error": "Message is required."}), 400
            
        answer = process_copilot_chat(message)
        
        return jsonify({
            "success": True,
            "data": {
                "answer": answer
            }
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
