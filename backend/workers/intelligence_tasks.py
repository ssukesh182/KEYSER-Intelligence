"""
workers/intelligence_tasks.py
Celery tasks for the LLM/intelligence pipeline (Phase 3 ready).
Currently runs external signal collection (Tavily, Reddit).
"""
import sys
import os
import logging

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from extensions import celery, db
from app import create_app
from services.pipelines.insight_pipeline import process_snapshot_for_insights
from services.intelligence.triangulation_engine import triangulate_signals_for_competitor

logger = logging.getLogger(__name__)

# Fallback flask app creation if not bound to context
flask_app = create_app()

@celery.task(name='intelligence.generate_insights_for_snapshot')
def generate_insights_for_snapshot_task(snapshot_id: int):
    """
    Celery task to kick off the insight pipeline for a given snapshot.
    """
    with flask_app.app_context():
        logger.info(f"Starting Celery task to process snapshot {snapshot_id}")
        return process_snapshot_for_insights(snapshot_id)

@celery.task(name='intelligence.triangulate_signals')
def triangulate_signals_task(competitor_id: int, window_hours: int = 48):
    """
    Periodic Celery task to group diffs and generate higher-confidence insights.
    """
    with flask_app.app_context():
        logger.info(f"Triangulating signals for competitor {competitor_id}")
        return triangulate_signals_for_competitor(competitor_id, window_hours)

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
