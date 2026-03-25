"""
workers/tasks.py
Core scraping + diff Celery tasks.
These are the tasks the APScheduler drops into the Redis queue.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from extensions import celery, db
from models import Source, Snapshot

# ─────────────────────────────────────────────────────────────────
# Task 1: Scrape a single source → store snapshot → run diff
# ─────────────────────────────────────────────────────────────────
@celery.task(bind=True, name="tasks.scrape_source", max_retries=3, default_retry_delay=60)
def scrape_source_task(self, source_id: int):
    """
    Celery task: Playwright-scrape one Source, store snapshot, run diff + insight.
    Called by APScheduler every 30 min per active source.
    """
    print(f"[TASK] scrape_source_task started for source_id={source_id}")
    try:
        from services.scraper import scrape_and_store

        source = db.session.query(Source).get(source_id)
        if not source:
            print(f"[TASK] ERROR: Source {source_id} not found")
            return {"status": "error", "message": f"Source {source_id} not found"}

        if not source.is_active:
            print(f"[TASK] Source {source_id} is inactive — skipping")
            return {"status": "skipped", "reason": "inactive"}

        print(f"[TASK] Scraping source_id={source_id}, url={source.url}")
        snapshot = scrape_and_store(source, db.session)

        if snapshot:
            print(f"[TASK] scrape_source_task DONE — snapshot_id={snapshot.id}")
            
            # ── Trigger Intelligence Pipeline ──────────────────────────
            try:
                from workers.intelligence_tasks import generate_insights_for_snapshot_task
                generate_insights_for_snapshot_task.delay(snapshot.id)
                print(f"[TASK] Triggered intelligence pipeline for snapshot {snapshot.id}")
            except Exception as ai_err:
                print(f"[TASK] WARNING: Failed to trigger AI pipeline: {ai_err}")

            return {"status": "ok", "snapshot_id": snapshot.id}
        else:
            print(f"[TASK] scrape_source_task FAILED for source_id={source_id}")
            return {"status": "error", "message": "Scrape returned None"}

    except Exception as e:
        print(f"[TASK] ERROR in scrape_source_task source_id={source_id}: {e}")
        try:
            raise self.retry(exc=e)
        except self.MaxRetriesExceededError:
            print(f"[TASK] Max retries exceeded for source_id={source_id}")
            return {"status": "failed", "error": str(e)}


# ─────────────────────────────────────────────────────────────────
# Task 2: Scrape ALL active sources (called by scheduler loop)
# ─────────────────────────────────────────────────────────────────
@celery.task(bind=True, name="tasks.scrape_all_sources")
def scrape_all_sources_task(self):
    """
    Celery task: Queues individual scrape tasks for every active source.
    APScheduler calls this once instead of queuing each source individually.
    """
    print("[TASK] scrape_all_sources_task started")
    try:
        sources = db.session.query(Source).filter(Source.is_active == True).all()
        print(f"[TASK] Found {len(sources)} active sources to scrape")
        for source in sources:
            scrape_source_task.delay(source.id)
            print(f"[TASK] Queued scrape for source_id={source.id} ({source.url})")
        return {"status": "ok", "queued": len(sources)}
    except Exception as e:
        print(f"[TASK] ERROR in scrape_all_sources_task: {e}")
        return {"status": "error", "error": str(e)}
