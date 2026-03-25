from flask import Blueprint, jsonify, request
import traceback

bp = Blueprint("copilot", __name__, url_prefix="/api/copilot")


@bp.route("/chat", methods=["POST"])
def chat():
    """
    POST /api/copilot/chat
    Body: { "message": "What is Zepto doing with pricing?" }
    Returns structured JSON from the AI Copilot.
    """
    try:
        data = request.json or {}
        message = data.get("message", "").strip()

        if not message:
            return jsonify({"success": False, "error": "Message is required."}), 400

        from services.pipelines.copilot_pipeline import process_copilot_chat
        answer = process_copilot_chat(message)

        return jsonify({
            "success": True,
            "data": answer
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
