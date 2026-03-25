"""
services/brief_engine.py
Responsible for generating "Signal Fusion" intelligence briefs.
Combines internal scrapes (diffs) with external OSINT (Tavily/Reddit).
"""
from models import Competitor, Snapshot, Insight
from extensions import db
from services.ai_engine import fuse_signals


def generate_competitor_brief(competitor_id: int) -> dict:
    """
    Fetches the latest signals for a competitor and fuses them into a strategic brief.
    """
    print(f"[BRIEF_ENGINE] Generating brief for Competitor {competitor_id}")
    competitor = db.session.query(Competitor).get(competitor_id)
    if not competitor:
        return {"error": "Competitor not found"}

    # 1. Get recent website insights (last 5)
    recent_insights = db.session.query(Insight).join(Insight.sources)\
        .filter(Insight.competitor_id == competitor_id)\
        .order_by(Insight.scraped_at.desc()).limit(5).all()
        
    web_changes = [i.summary for i in recent_insights]

    # 2. Get recent OSINT signals (Tavily & Reddit) from Snapshots
    tavily_snaps = db.session.query(Snapshot)\
        .filter(Snapshot.source_id == None)\
        .filter(Snapshot.meta.op("->>")("type") == "tavily")\
        .filter(Snapshot.meta.op("->>")("competitor_id") == str(competitor_id))\
        .order_by(Snapshot.scraped_at.desc()).limit(5).all()

    reddit_snaps = db.session.query(Snapshot)\
        .filter(Snapshot.source_id == None)\
        .filter(Snapshot.meta.op("->>")("type") == "reddit")\
        .filter(Snapshot.meta.op("->>")("competitor_id") == str(competitor_id))\
        .order_by(Snapshot.scraped_at.desc()).limit(5).all()
        
    # Extract titles/snippets for the LLM
    news = []
    for t in tavily_snaps:
        data = t.meta.get("data", [])
        news.extend([d.get("title") for d in data if d.get("title")])
        
    social = []
    for r in reddit_snaps:
        data = r.meta.get("data", [])
        social.extend([d.get("title") for d in data if d.get("title")])

    print(f"[BRIEF_ENGINE] Data collected: {len(web_changes)} insights, {len(news)} news, {len(social)} reddit threads")

    # 3. Fuse Signals via Gemini (or fallback if no API key)
    formatted_brief = fuse_signals(competitor.name, web_changes, news[:5], social[:5])

    return {
        "competitor": competitor.name,
        "brief": formatted_brief,
        "data_points_used": {
            "web_changes": len(web_changes),
            "news_articles": len(news),
            "reddit_threads": len(social)
        }
    }
