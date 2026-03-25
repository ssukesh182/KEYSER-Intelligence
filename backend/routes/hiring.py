"""
routes/hiring.py — Hiring Signal Tracker API endpoints.

GET  /api/hiring              list signals (filters: competitor_id, source, department, limit)
POST /api/hiring/refresh      manually trigger re-fetch for all competitors
GET  /api/hiring/stats        aggregated weekly counts + department distribution (for charts)
"""
from flask import Blueprint, jsonify, request
from extensions import db
from models.hiring_signal import HiringSignal
from models.competitor    import Competitor
from collections import defaultdict

bp = Blueprint("hiring", __name__, url_prefix="/api/hiring")


# ── GET /api/hiring ────────────────────────────────────────────────────────────
@bp.route("", methods=["GET"])
def list_hiring_signals():
    """List hiring signals. Supports filters: competitor_id, source, department, limit."""
    try:
        competitor_id = request.args.get("competitor_id", type=int)
        source        = request.args.get("source")
        department    = request.args.get("department")
        limit         = request.args.get("limit", 100, type=int)

        q = db.session.query(HiringSignal).order_by(HiringSignal.posted_at.desc())

        if competitor_id:
            q = q.filter(HiringSignal.competitor_id == competitor_id)
        if source:
            q = q.filter(HiringSignal.source == source)
        if department:
            q = q.filter(HiringSignal.department.ilike(f"%{department}%"))

        signals = q.limit(limit).all()
        data    = [s.to_dict() for s in signals]

        return jsonify({"success": True, "data": data, "count": len(data)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ── GET /api/hiring/stats ──────────────────────────────────────────────────────
@bp.route("/stats", methods=["GET"])
def hiring_stats():
    """
    Returns aggregated data for charts:
    - weekly_counts: list of {week_label, count} (last 8 weeks)
    - dept_distribution: list of {department, count, pct}
    - competitor_breakdown: list of {competitor, count}
    """
    try:
        from datetime import datetime, timezone, timedelta

        signals = db.session.query(HiringSignal).all()
        if not signals:
            return jsonify({"success": True, "data": {
                "weekly_counts": [], "dept_distribution": [], "competitor_breakdown": []
            }})

        now = datetime.now(timezone.utc)

        # Weekly counts (8 buckets)
        weekly = defaultdict(int)
        for s in signals:
            if s.posted_at:
                dt = s.posted_at
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                week_offset = (now - dt).days // 7
                if week_offset < 8:
                    label = (now - timedelta(weeks=week_offset)).strftime("%-d %b")
                    weekly[label] += 1

        # Sort by recency (use days offset as key)
        weekly_sorted = []
        for i in range(7, -1, -1):
            label = (now - timedelta(weeks=i)).strftime("%-d %b")
            weekly_sorted.append({"week": label, "count": weekly.get(label, 0)})

        # Department distribution
        dept_counts = defaultdict(int)
        for s in signals:
            dept_counts[s.department or "Other"] += 1
        total = len(signals) or 1
        dept_dist = sorted(
            [{"department": d, "count": c, "pct": round(c / total * 100)}
             for d, c in dept_counts.items()],
            key=lambda x: -x["count"]
        )

        # Competitor breakdown
        comp_counts = defaultdict(int)
        for s in signals:
            comp_counts[s.competitor.name if s.competitor else "Unknown"] += 1
        comp_breakdown = sorted(
            [{"competitor": c, "count": n} for c, n in comp_counts.items()],
            key=lambda x: -x["count"]
        )

        return jsonify({"success": True, "data": {
            "weekly_counts":       weekly_sorted,
            "dept_distribution":   dept_dist,
            "competitor_breakdown": comp_breakdown,
            "total":               len(signals),
        }})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ── POST /api/hiring/refresh ───────────────────────────────────────────────────
@bp.route("/refresh", methods=["POST"])
def refresh_hiring_signals():
    """Manually trigger hiring signal collection for all competitors."""
    try:
        competitors = db.session.query(Competitor).all()
        queued = []
        for c in competitors:
            try:
                from workers.intelligence_tasks import collect_hiring_signals_task
                collect_hiring_signals_task.delay(c.id)
                queued.append(c.name)
            except Exception as task_err:
                print(f"[HIRING] Could not queue task for {c.name}: {task_err}")

        return jsonify({"success": True, "queued": queued, "count": len(queued)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
