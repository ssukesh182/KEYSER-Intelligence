from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from celery import Celery
import os
from config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

# ─── Core extensions (initialized via init_app in app.py) ─────
db   = SQLAlchemy()
cors = CORS()

# ─── Celery (attached to Flask config later if needed) ────────
celery = Celery(
    __name__,
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
)

print(f"[EXTENSIONS] db, cors, and celery instances created (Broker: {CELERY_BROKER_URL})")
