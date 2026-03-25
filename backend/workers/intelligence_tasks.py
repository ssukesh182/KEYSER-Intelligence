import logging
from workers.celery_worker import celery
from services.pipelines.insight_pipeline import process_snapshot_for_insights
from services.intelligence.triangulation_engine import triangulate_signals_for_competitor
from extensions import db
from app import create_app

logger = logging.getLogger(__name__)

# Required to give celery access to Flask app context
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
