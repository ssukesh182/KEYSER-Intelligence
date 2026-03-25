"""
workers/intelligence_tasks.py
Celery tasks for the LLM/intelligence pipeline (Phase 3 ready).
Currently runs external signal collection (Tavily, Reddit).
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from extensions import celery, db


@celery.task(bind=True, name="tasks.collect_tavily_signals", max_retries=2)
def collect_tavily_signals_task(self, competitor_id: int, query: str = ""):
    """
    Celery task: Hit Tavily API for a competitor → store result as a Snapshot signal.
    """
    print(f"[INTELLIGENCE_TASK] collect_tavily_signals started for competitor_id={competitor_id}")
    try:
        from integrations.tavily import fetch_tavily_signals
        from models import Competitor

        competitor = db.session.query(Competitor).get(competitor_id)
        if not competitor:
            print(f"[INTELLIGENCE_TASK] Competitor {competitor_id} not found")
            return {"status": "error"}

        results = fetch_tavily_signals(competitor.name, query=query)
        print(f"[INTELLIGENCE_TASK] Tavily returned {len(results)} signals for {competitor.name}")
        return {"status": "ok", "signals_collected": len(results)}
    except Exception as e:
        print(f"[INTELLIGENCE_TASK] ERROR collect_tavily_signals: {e}")
        try:
            raise self.retry(exc=e)
        except self.MaxRetriesExceededError:
            return {"status": "failed", "error": str(e)}


@celery.task(bind=True, name="tasks.collect_reddit_signals", max_retries=2)
def collect_reddit_signals_task(self, competitor_id: int):
    """
    Celery task: Scrape Reddit for mentions of a competitor → store as signals.
    """
    print(f"[INTELLIGENCE_TASK] collect_reddit_signals started for competitor_id={competitor_id}")
    try:
        from integrations.reddit import fetch_reddit_mentions
        from models import Competitor

        competitor = db.session.query(Competitor).get(competitor_id)
        if not competitor:
            return {"status": "error"}

        results = fetch_reddit_mentions(competitor.name)
        print(f"[INTELLIGENCE_TASK] Reddit returned {len(results)} mentions for {competitor.name}")
        return {"status": "ok", "mentions": len(results)}
    except Exception as e:
        print(f"[INTELLIGENCE_TASK] ERROR collect_reddit_signals: {e}")
        try:
            raise self.retry(exc=e)
        except self.MaxRetriesExceededError:
            return {"status": "failed", "error": str(e)}
