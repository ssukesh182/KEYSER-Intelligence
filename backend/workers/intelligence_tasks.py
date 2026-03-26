"""
workers/intelligence_tasks.py
Celery tasks for the LLM/intelligence pipeline (Phase 3 ready).
Currently runs external signal collection (Tavily, Reddit).
"""
import sys
import os
import logging
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from extensions import celery, db
from app import create_app
from services.pipelines.insight_pipeline import process_snapshot_for_insights
from services.pipelines.fusion_pipeline import FusionPipeline

logger = logging.getLogger(__name__)

@celery.task(name='intelligence.run_fusion_intelligence')
def run_fusion_intelligence_task(competitor_id: int):
    """
    Celery task to run the multi-source OSINT fusion pipeline.
    """
    app = create_app()
    with app.app_context():
        logger.info(f"Starting Celery task: OSINT Fusion for competitor {competitor_id}")
        pipeline = FusionPipeline()
        return pipeline.run_triangulation(competitor_id)

@celery.task(name='intelligence.generate_insights_for_snapshot')
def generate_insights_for_snapshot_task(snapshot_id: int):
    """
    Celery task to kick off the insight pipeline for a given snapshot.
    """
    from app import create_app
    app = create_app()
    with app.app_context():
        logger.info(f"Starting Celery task to process snapshot {snapshot_id}")
        return process_snapshot_for_insights(snapshot_id)

@celery.task(name='intelligence.triangulate_signals')
def triangulate_signals_task(competitor_id: int, window_hours: int = 48):
    """
    Periodic Celery task to group diffs and generate higher-confidence insights.
    """
    from services.intelligence.triangulation_engine import triangulate_signals_for_competitor
    app = create_app()
    with app.app_context():
        logger.info(f"Triangulating signals for competitor {competitor_id}")
        return triangulate_signals_for_competitor(competitor_id, window_hours)

@celery.task(bind=True, name="tasks.collect_tavily_signals", max_retries=2)
def collect_tavily_signals_task(self, user_id: int, competitor_name: str, query: str = None):
    """
    Celery task: Fetch Tavily (Search) signals for a competitor and store them.
    """
    print(f"[TAVILY_TASK] collect_tavily_signals started for {competitor_name} (User: {user_id})")
    try:
        db.engine.dispose()
        from integrations.tavily import fetch_tavily_signals
        from models.review import RawReview
        
        results = fetch_tavily_signals(competitor_name, query=query)
        
        inserted = 0
        for r in results:
            exists = RawReview.query.filter_by(
                user_id=user_id,
                competitor_name=competitor_name,
                source="serp_google",
                review_text=r.get("content", "")[:2000]
            ).first()
            if not exists:
                review = RawReview(
                    user_id=user_id,
                    competitor_name=competitor_name,
                    source="serp_google",
                    reviewer="Google Search",
                    rating=3,
                    review_text=r.get("content", "")[:2000],
                    review_time=datetime.now(timezone.utc).isoformat()
                )
                db.session.add(review)
                inserted += 1
        
        db.session.commit()
        print(f"[TAVILY_TASK] Done — {inserted} new signals for {competitor_name}")
        return {"status": "ok", "signals_collected": len(results), "inserted": inserted}
    except Exception as e:
        print(f"[TAVILY_TASK] ERROR: {e}")
        try: raise self.retry(exc=e)
        except self.MaxRetriesExceededError: return {"status": "failed", "error": str(e)}


@celery.task(bind=True, name="tasks.collect_reddit_signals", max_retries=2)
def collect_reddit_signals_task(self, user_id: int, competitor_name: str):
    """
    Celery task: Scrape Reddit for mentions of a competitor and store them.
    """
    print(f"[REDDIT_TASK] collect_reddit_signals started for {competitor_name} (User: {user_id})")
    try:
        db.engine.dispose()
        from integrations.reddit import fetch_reddit_mentions
        from models.review import RawReview

        results = fetch_reddit_mentions(competitor_name)
        
        inserted = 0
        for r in results:
            exists = RawReview.query.filter_by(
                user_id=user_id,
                competitor_name=competitor_name,
                source="reddit",
                reviewer=r.get("author", "anonymous"),
                review_text=r.get("text", "")[:2000]
            ).first()
            if not exists:
                review = RawReview(
                    user_id=user_id,
                    competitor_name=competitor_name,
                    source="reddit",
                    reviewer=r.get("author", "anonymous"),
                    rating=3,
                    review_text=r.get("text", "")[:2000],
                    review_time=str(r.get("created_utc"))
                )
                db.session.add(review)
                inserted += 1
        
        db.session.commit()
        print(f"[REDDIT_TASK] Done — {inserted} new signals for {competitor_name}")
        return {"status": "ok", "mentions": len(results), "inserted": inserted}
    except Exception as e:
        print(f"[REDDIT_TASK] ERROR: {e}")
        try: raise self.retry(exc=e)
        except self.MaxRetriesExceededError: return {"status": "failed", "error": str(e)}


@celery.task(bind=True, name="tasks.collect_hiring_signals", max_retries=2)
def collect_hiring_signals_task(self, user_id: int, competitor_name: str):
    """
    Celery task: Fetch hiring signals for a given competitor → store as User signals.
    """
    print(f"[HIRING_TASK] collect_hiring_signals started for {competitor_name} (User: {user_id})")
    try:
        db.engine.dispose()
        from models.hiring_signal import HiringSignal
        from integrations.jobs    import (
            fetch_apollo_signals,
            fetch_linkedin_signals,
            fetch_arbeitnow_signals,
        )

        all_signals = []
        for fetcher in [fetch_apollo_signals, fetch_linkedin_signals, fetch_arbeitnow_signals]:
            try:
                all_signals.extend(fetcher(competitor_name))
            except Exception as fetch_err:
                print(f"[HIRING_TASK] Fetcher {fetcher.__name__} failed: {fetch_err}")

        inserted = 0
        for sig in all_signals:
            try:
                # Upsert: skip if same (user_id, competitor, source, role_title, posted_at) exists
                exists = HiringSignal.query.filter_by(
                    user_id=user_id,
                    competitor_name=competitor_name,
                    source=sig["source"],
                    role_title=sig["role_title"],
                    posted_at=sig.get("posted_at"),
                ).first()
                if not exists:
                    row = HiringSignal(
                        user_id=user_id,
                        competitor_name=competitor_name,
                        source=sig["source"],
                        role_title=sig["role_title"],
                        department=sig.get("department"),
                        location=sig.get("location"),
                        job_url=sig.get("job_url"),
                        posted_at=sig.get("posted_at"),
                    )
                    db.session.add(row)
                    inserted += 1
            except Exception as row_err:
                print(f"[HIRING_TASK] Row insert error: {row_err}")

        db.session.commit()
        print(f"[HIRING_TASK] Done — {inserted} new signals for {competitor_name}")
        return {"status": "ok", "inserted": inserted, "total_fetched": len(all_signals)}

    except Exception as e:
        print(f"[HIRING_TASK] ERROR: {e}")
        db.session.rollback()
        try:
            raise self.retry(exc=e)
        except self.MaxRetriesExceededError:
            return {"status": "failed", "error": str(e)}

