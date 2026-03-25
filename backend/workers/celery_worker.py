import os
from celery import Celery

def make_celery(app_name=__name__):
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    celery_app = Celery(app_name, broker=redis_url, backend=redis_url)
    celery_app.conf.update(
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
    )
    return celery_app

celery = make_celery()
