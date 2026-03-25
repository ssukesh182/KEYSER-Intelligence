"""
workers/validation_tasks.py — Async Celery tasks for the validation pipeline.

Tasks:
    validate_insight_task(insight_id, raw_llm_output, source_type, old_text, new_text)
        Runs full 5-layer validation pipeline asynchronously.

    score_insight_task(insight_id, claim, supporting_text, source_type, ...)
        Runs confidence scoring pipeline asynchronously.
"""
import logging

logger = logging.getLogger(__name__)


def _get_celery_app():
    """Lazy import to avoid circular dependencies at module level."""
    from workers.celery_worker import celery_app
    return celery_app


# ─── Task: Full Validation Pipeline ──────────────────────────────────────────

def validate_insight_task(
    insight_id: int,
    raw_llm_output: dict,
    source_type: str,
    old_text: str = "",
    new_text: str = "",
) -> dict:
    """
    Celery task: Run the full 5-layer validation pipeline for an insight.

    Args:
        insight_id:     DB id of the Insight record.
        raw_llm_output: Dict from LLM: {claim, category, subcategory,
                        competitor, confidence, supporting_text, source_url}.
        source_type:    Source type string (e.g. 'google_ads').
        old_text:       Previous snapshot text (for Layer 4 change validation).
        new_text:       Current snapshot text (for Layer 4 change validation).

    Returns:
        Validation result dict with keys: accepted, confidence, layers.
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

    Returns the scores dict with keys:
        base_confidence, triangulation_bonus, novelty_score,
        urgency_score, final_confidence.
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


# ─── Register as Celery tasks (optional — if Celery is configured) ────────────

def register_celery_tasks():
    """
    Attempt to register tasks with Celery if the broker is reachable.
    Safe to call even when Celery/Redis is not available.
    """
    try:
        celery = _get_celery_app()

        global validate_insight_task, score_insight_task
        validate_insight_task = celery.task(
            name="validation.validate_insight",
            bind=False,
            max_retries=3,
            default_retry_delay=30,
        )(validate_insight_task)

        score_insight_task = celery.task(
            name="validation.score_insight",
            bind=False,
        )(score_insight_task)

        logger.info("[Tasks] Celery tasks registered successfully")
    except Exception as exc:
        logger.warning("[Tasks] Celery not available — tasks run synchronously: %s", exc)


# Register on import (safe to fail)
try:
    register_celery_tasks()
except Exception:
    pass
