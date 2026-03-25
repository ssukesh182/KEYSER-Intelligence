"""
workers/celery_worker.py
Entry point for starting the Celery worker process.

Run with:
    cd backend
    source venv/bin/activate
    celery -A workers.celery_worker.celery worker --loglevel=info
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app
from extensions import celery
from config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

# ── Create Flask app and push context so Celery tasks can use DB ──
flask_app = create_app()

# ── Configure Celery ──────────────────────────────────────────────
celery.conf.update(
    broker_url          = CELERY_BROKER_URL,
    result_backend      = CELERY_RESULT_BACKEND,
    task_serializer     = "json",
    result_serializer   = "json",
    accept_content      = ["json"],
    timezone            = "Asia/Kolkata",
    enable_utc          = True,
    task_track_started  = True,
    # Retry failed tasks up to 3 times
    task_acks_late      = True,
    task_reject_on_worker_lost = True,
)

# ── Make tasks run inside Flask app context ───────────────────────
class FlaskTask(celery.Task):
    def __call__(self, *args, **kwargs):
        with flask_app.app_context():
            return self.run(*args, **kwargs)

celery.Task = FlaskTask

print("[CELERY_WORKER] Celery configured and ready")
print(f"[CELERY_WORKER] Broker: {CELERY_BROKER_URL}")

# ── Import tasks so they are registered ──────────────────────────
import workers.tasks  # noqa
import workers.intelligence_tasks  # noqa
import workers.validation_tasks  # noqa
