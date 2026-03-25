from flask import Blueprint, jsonify, send_file
from services.pipelines.brief_pipeline import create_monday_morning_brief
import traceback
import os

bp = Blueprint("brief", __name__, url_prefix="/api/brief")

@bp.route("/", methods=["POST"])
def generate_brief():
    try:
        result = create_monday_morning_brief()
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]}), 400
            
        return jsonify({
            "success": True,
            "data": {
                "markdown": result["markdown"],
                "pdf_path": result["pdf_path"],
                "insights_used": result["insights_used"]
            }
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route("/download", methods=["GET"])
def download_brief_pdf():
    # Helper to download the generated PDF
    try:
        pdf_path = "/tmp/monday_brief.pdf"
        if os.path.exists(pdf_path):
            return send_file(pdf_path, as_attachment=True, download_name="Monday_CEO_Brief.pdf")
        return jsonify({"success": False, "error": "PDF not generated yet."}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 404
