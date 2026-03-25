"""
services/validation/source_validator.py — Layer 1: Source-based confidence.

Assigns a base confidence score based on the reliability of the source type.
Stores the result in the confidence_score table.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Source type → base confidence mapping
SOURCE_CONFIDENCE_MAP: dict[str, float] = {
    "google_ads":    0.95,
    "reviews":       0.85,
    "landing_page":  0.80,
    "jobs":          0.75,
    "app_store":     0.70,
    "social":        0.55,
}
DEFAULT_CONFIDENCE = 0.50


def get_source_confidence(source_type: str) -> float:
    """
    Return base confidence score for a given source type.

    Args:
        source_type: One of 'google_ads', 'reviews', 'landing_page',
                     'app_store', 'social', 'jobs'.

    Returns:
        float in [0.0, 1.0]
    """
    confidence = SOURCE_CONFIDENCE_MAP.get(source_type.lower().strip(),
                                           DEFAULT_CONFIDENCE)
    logger.info("[Layer1/Source] source_type=%s → confidence=%.2f",
                source_type, confidence)
    return confidence


def validate_source(
    source_type: str,
    insight_id: Optional[int] = None,
    db_session=None,
) -> dict:
    """
    Run Layer-1 validation: assign base confidence from source type.

    Optionally persists a ValidationLog and creates/updates
    a ConfidenceScore record.

    Args:
        source_type: Source type string from scraper metadata.
        insight_id:  DB id of the Insight being validated (may be None).
        db_session:  SQLAlchemy session. If None, skips DB writes.

    Returns:
        {
            "passed": bool,
            "source_type": str,
            "base_confidence": float,
        }
    """
    base_confidence = get_source_confidence(source_type)
    passed = base_confidence >= 0.50

    if db_session and insight_id:
        _persist(
            db_session=db_session,
            insight_id=insight_id,
            base_confidence=base_confidence,
            passed=passed,
        )

    return {
        "passed":          passed,
        "source_type":     source_type,
        "base_confidence": base_confidence,
    }


# ─── Internal helpers ────────────────────────────────────────────────────────

def _persist(db_session, insight_id: int, base_confidence: float,
             passed: bool) -> None:
    """Write ValidationLog + upsert ConfidenceScore row."""
    try:
        from models.validation_log   import ValidationLog
        from models.confidence_score import ConfidenceScore

        log = ValidationLog(
            insight_id=insight_id,
            validation_stage="source",
            status="passed" if passed else "failed",
            confidence_before=None,
            confidence_after=base_confidence,
            notes=f"Base confidence from source type = {base_confidence:.2f}",
        )
        db_session.add(log)

        # Upsert ConfidenceScore
        score = (db_session.query(ConfidenceScore)
                 .filter_by(insight_id=insight_id).first())
        if score:
            score.base_confidence  = base_confidence
            score.final_confidence = base_confidence
        else:
            score = ConfidenceScore(
                insight_id=insight_id,
                base_confidence=base_confidence,
                final_confidence=base_confidence,
            )
            db_session.add(score)

        db_session.commit()
        logger.debug("[Layer1/Source] DB persisted for insight_id=%s", insight_id)

    except Exception as exc:
        db_session.rollback()
        logger.error("[Layer1/Source] DB persist failed: %s", exc)
