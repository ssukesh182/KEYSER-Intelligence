"""
scheduler/intelligence_scheduler.py
Registers all background cron jobs:
  - Scrape all active sources every 30 min
  - Collect Tavily signals every 2 hours
  - Collect Reddit mentions every 2 hours
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def register_jobs(scheduler, app):
    """
    Register all repeating jobs on the BackgroundScheduler.
    Called once from app.py at startup.
    """
    from config import SCRAPE_INTERVAL_MINUTES

    # ── Job 1: Scrape all active sources ──────────────────────
    # Uses Celery task so Playwright runs in a worker process, not Flask thread
    @scheduler.scheduled_job("interval", minutes=SCRAPE_INTERVAL_MINUTES, id="scrape_all")
    def scrape_all_job():
        print(f"[SCHEDULER] Triggering global scrape (every {SCRAPE_INTERVAL_MINUTES} min)")
        try:
            from workers.tasks import scrape_all_sources_task
            result = scrape_all_sources_task.delay()
            print(f"[SCHEDULER] scrape_all queued — task_id={result.id}")
        except Exception as e:
            print(f"[SCHEDULER] ERROR queuing scrape_all: {e}")
            # Graceful fallback: run synchronously if Celery/Redis is down
            try:
                print("[SCHEDULER] Falling back to synchronous scrape")
                with app.app_context():
                    from extensions import db
                    from models import Source
                    from services.scraper import scrape_and_store
                    sources = db.session.query(Source).filter(Source.is_active == True).all()
                    for source in sources:
                        print(f"[SCHEDULER] Sync scraping source_id={source.id}")
                        scrape_and_store(source, db.session)
            except Exception as fallback_err:
                print(f"[SCHEDULER] Fallback scrape ERROR: {fallback_err}")

    # ── Job 2: Collect Tavily signals every 2 hours ───────────
    @scheduler.scheduled_job("interval", hours=2, id="tavily_signals")
    def tavily_job():
        print("[SCHEDULER] Triggering Tavily signal collection")
        try:
            from workers.intelligence_tasks import collect_tavily_signals_task
            with app.app_context():
                from extensions import db
                from models import Competitor
                competitors = db.session.query(Competitor).all()
                for c in competitors:
                    collect_tavily_signals_task.delay(c.id)
                    print(f"[SCHEDULER] Tavily task queued for: {c.name}")
        except Exception as e:
            print(f"[SCHEDULER] ERROR in tavily_job: {e}")

    # ── Job 3: Collect Reddit mentions every 2 hours ──────────
    @scheduler.scheduled_job("interval", hours=2, id="reddit_signals", jitter=300)
    def reddit_job():
        print("[SCHEDULER] Triggering Reddit mention collection")
        try:
            from workers.intelligence_tasks import collect_reddit_signals_task
            with app.app_context():
                from extensions import db
                from models import Competitor
                competitors = db.session.query(Competitor).all()
                for c in competitors:
                    collect_reddit_signals_task.delay(c.id)
                    print(f"[SCHEDULER] Reddit task queued for: {c.name}")
        except Exception as e:
            print(f"[SCHEDULER] ERROR in reddit_job: {e}")

    print("[SCHEDULER] All jobs registered ✅")
    print(f"[SCHEDULER] Scrape interval: {SCRAPE_INTERVAL_MINUTES} min | Tavily: 2h | Reddit: 2h")
