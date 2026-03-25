from flask import Blueprint, jsonify
from extensions import db
from models import Competitor, Source, Snapshot, Diff, Insight, InsightSource, ConfidenceScore, ValidationLog

bp = Blueprint("demo", __name__, url_prefix="/api/demo")


@bp.route("/reset", methods=["POST"])
def reset_demo():
    """
    POST /api/demo/reset
    Wipes all runtime data and re-runs the seed.
    Call this before every demo to guarantee a clean state.
    """
    print("[DEMO] /api/demo/reset called — performing HARD RESET (drop/create tables)")
    try:
        # Drop and recreate all tables to sync schema
        db.drop_all()
        db.create_all()
        print("[DEMO] All tables dropped and recreated")

        # Re-run seed
        from seed.seed import run_seed
        run_seed(db.session)

        print("[DEMO] Re-seed complete")
        return jsonify({"success": True, "message": "Demo reset complete — DB seeded fresh"})
    except Exception as e:
        db.session.rollback()
        print(f"[DEMO] ERROR during reset: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/trigger_osint", methods=["POST"])
def trigger_osint():
    """
    POST /api/demo/trigger_osint
    Manually triggers Tavily and Reddit signal collection tasks for all competitors.
    Useful for Phase 2 verification.
    """
    print("[DEMO] /api/demo/trigger_osint called")
    try:
        from workers.intelligence_tasks import collect_tavily_signals_task, collect_reddit_signals_task
        competitors = db.session.query(Competitor).all()
        
        task_ids = []
        for c in competitors:
            t1 = collect_tavily_signals_task.delay(c.id)
            t2 = collect_reddit_signals_task.delay(c.id)
            task_ids.extend([t1.id, t2.id])
            print(f"[DEMO] Queued OSINT for: {c.name}")

        return jsonify({
            "success": True, 
            "message": f"Queued {len(task_ids)} OSINT tasks for {len(competitors)} competitors",
            "task_ids": task_ids
        }), 202
    except Exception as e:
        print(f"[DEMO] ERROR triggering OSINT: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
