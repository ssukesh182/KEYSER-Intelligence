from flask import Blueprint, jsonify
from extensions import db
from models import Competitor, Source, Snapshot, Diff, Insight, InsightSource

bp = Blueprint("demo", __name__, url_prefix="/api/demo")


@bp.route("/reset", methods=["POST"])
def reset_demo():
    """
    POST /api/demo/reset
    Wipes all runtime data and re-runs the seed.
    Call this before every demo to guarantee a clean state.
    """
    print("[DEMO] /api/demo/reset called — wiping and re-seeding DB")
    try:
        # Delete in reverse dependency order
        db.session.query(InsightSource).delete()
        db.session.query(Insight).delete()
        db.session.query(Diff).delete()
        db.session.query(Snapshot).delete()
        db.session.query(Source).delete()
        db.session.query(Competitor).delete()
        db.session.commit()
        print("[DEMO] All tables wiped")

        # Re-run seed
        from seed.seed import run_seed
        run_seed(db.session)

        print("[DEMO] Re-seed complete")
        return jsonify({"success": True, "message": "Demo reset complete — DB seeded fresh"})
    except Exception as e:
        db.session.rollback()
        print(f"[DEMO] ERROR during reset: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
