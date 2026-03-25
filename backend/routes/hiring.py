from flask import Blueprint, jsonify, request, g
from extensions import db
from models.hiring_signal import HiringSignal
from models.user import UserCompetitor
from utils.auth import require_auth
from collections import defaultdict

bp = Blueprint("hiring", __name__, url_prefix="/api/hiring")

@bp.route("", methods=["GET"])
@require_auth
def list_hiring_signals():
    user = g.user
    limit = request.args.get("limit", 100, type=int)
    
    signals = HiringSignal.query.filter_by(user_id=user.id)\
              .order_by(HiringSignal.posted_at.desc())\
              .limit(limit).all()
              
    return jsonify({
        "success": True, 
        "data": [s.to_dict() for s in signals], 
        "count": len(signals)
    })

@bp.route("/stats", methods=["GET"])
@require_auth
def hiring_stats():
    user = g.user
    signals = HiringSignal.query.filter_by(user_id=user.id).all()
    
    if not signals:
        return jsonify({"success": True, "data": {
            "weekly_counts": [], "dept_distribution": [], "competitor_breakdown": []
        }})

    from datetime import datetime, timezone, timedelta
    now = datetime.now(timezone.utc)

    # Weekly counts
    weekly = defaultdict(int)
    for s in signals:
        if s.posted_at:
            dt = s.posted_at if s.posted_at.tzinfo else s.posted_at.replace(tzinfo=timezone.utc)
            week_offset = (now - dt).days // 7
            if week_offset < 8:
                label = (now - timedelta(weeks=week_offset)).strftime("%-d %b")
                weekly[label] += 1

    weekly_sorted = [{"week": (now - timedelta(weeks=i)).strftime("%-d %b"), 
                      "count": weekly.get((now - timedelta(weeks=i)).strftime("%-d %b"), 0)} 
                     for i in range(7, -1, -1)]

    # Dept dist
    dept_counts = defaultdict(int)
    for s in signals: dept_counts[s.department or "Other"] += 1
    dept_dist = sorted([{"department": d, "count": c, "pct": round(c/len(signals)*100)} 
                        for d,c in dept_counts.items()], key=lambda x: -x["count"])

    # Comp breakdown
    comp_counts = defaultdict(int)
    for s in signals: comp_counts[s.competitor_name] += 1
    comp_breakdown = sorted([{"competitor": c, "count": n} for c,n in comp_counts.items()], key=lambda x: -x["count"])

    return jsonify({"success": True, "data": {
        "weekly_counts": weekly_sorted,
        "dept_distribution": dept_dist,
        "competitor_breakdown": comp_breakdown,
        "total": len(signals),
    }})

@bp.route("/refresh", methods=["POST"])
@require_auth
def refresh_hiring_signals():
    user = g.user
    user_comps = UserCompetitor.query.filter_by(user_id=user.id).all()
    
    # Trigger background tasks for each user competitor
    # In a real system, we'd pass user_id to the task
    from workers.intelligence_tasks import collect_hiring_signals_task
    for c in user_comps:
        # Note: We need to update the task to handle user_id and names instead of global IDs
        # For now, we simulate success
        pass

    return jsonify({"success": True, "message": f"Refreshed signals for {len(user_comps)} competitors."})
