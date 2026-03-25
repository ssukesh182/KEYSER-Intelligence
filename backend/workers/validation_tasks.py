"""
workers/validation_tasks.py — Async Celery tasks for the validation pipeline.

Tasks:
    validate_insight_task(insight_id, raw_llm_output, source_type, old_text, new_text)
        Runs full 5-layer validation pipeline asynchronously.

    score_insight_task(insight_id, claim, supporting_text, source_type, ...)
        Runs confidence scoring pipeline asynchronously.
"""
import logging
from extensions import celery

logger = logging.getLogger(__name__)

# ─── Task: Full Validation Pipeline ──────────────────────────────────────────

@celery.task(name="validation.validate_insight", max_retries=3, default_retry_delay=30)
def validate_insight_task(
    insight_id: int,
    raw_llm_output: dict,
    source_type: str,
    old_text: str = "",
    new_text: str = "",
) -> dict:
    """
    Celery task: Run the full 5-layer validation pipeline for an insight.
    """
    logger.info("[Task/Validation] Starting for insight_id=%s", insight_id)
    try:
        from app import create_app
        from extensions import db
        from services.validation import run_validation_pipeline

        app = create_app()
        with app.app_context():
            result = run_validation_pipeline(
                raw_llm_output=raw_llm_output,
                source_type=source_type,
                old_text=old_text,
                new_text=new_text,
                insight_id=insight_id,
                db_session=db.session,
            )

            # Update insight.confidence in DB if accepted
            if result["accepted"]:
                from models.insight import Insight
                insight = db.session.get(Insight, insight_id)
                if insight:
                    insight.confidence = result["confidence"]
                    db.session.commit()
                    logger.info("[Task/Validation] insight_id=%s confidence updated to %.2f",
                                insight_id, result["confidence"])

            logger.info("[Task/Validation] Done insight_id=%s accepted=%s",
                        insight_id, result["accepted"])
            return result

    except Exception as exc:
        logger.exception("[Task/Validation] FAILED for insight_id=%s: %s",
                         insight_id, exc)
        return {"accepted": False, "confidence": 0.0, "error": str(exc)}


# ─── Task: Scoring Only ───────────────────────────────────────────────────────

@celery.task(name="validation.score_insight")
def score_insight_task(
    insight_id: int,
    claim: str,
    supporting_text: str,
    source_type: str,
    competitor: str = "",
    triangulation_bonus: float = 0.0,
) -> dict:
    """
    Celery task: Compute and persist confidence scores for an insight.
    """
    logger.info("[Task/Score] Starting for insight_id=%s", insight_id)
    try:
        from app import create_app
        from extensions import db
        from services.scoring.confidence import score_insight_confidence

        app = create_app()
        with app.app_context():
            scores = score_insight_confidence(
                claim=claim,
                supporting_text=supporting_text,
                source_type=source_type,
                triangulation_bonus=triangulation_bonus,
                insight_id=insight_id,
                competitor=competitor,
                db_session=db.session,
            )
            logger.info("[Task/Score] Done insight_id=%s final=%.2f",
                        insight_id, scores["final_confidence"])
            return scores

    except Exception as exc:
        logger.exception("[Task/Score] FAILED for insight_id=%s: %s",
                         insight_id, exc)
        return {"error": str(exc)}
