"""
services/validation/output_validator.py — Layer 5: Final Gate Before DB Save.

Rules:
    - Reject if confidence < 0.50
    - Reject if supporting_text is missing or empty
    - Reject if source_url is missing or empty
    - Accept otherwise
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

MIN_CONFIDENCE = 0.50


def validate_output(
    confidence: float,
    supporting_text: str,
    source_url: str,
    insight_id: Optional[int] = None,
    db_session=None,
) -> dict:
    """
    Run Layer-5 final output validation.

    Args:
        confidence:      Final confidence score entering this layer.
        supporting_text: The raw text the insight was derived from.
        source_url:      URL of the source.
        insight_id:      DB id of the Insight (for logging).
        db_session:      SQLAlchemy session.

    Returns:
        {
            "accepted": bool,
            "reasons":  list[str],   # why it was rejected (empty if accepted)
        }
    """
    reasons: list[str] = []

    if confidence < MIN_CONFIDENCE:
        reasons.append(
            f"Confidence {confidence:.2f} < minimum {MIN_CONFIDENCE}"
        )

    if not supporting_text or not supporting_text.strip():
        reasons.append("Missing supporting_text")

    if not source_url or not source_url.strip():
        reasons.append("Missing source_url")

    accepted = len(reasons) == 0

    logger.info(
        "[Layer5/Output] accepted=%s confidence=%.2f reasons=%s",
        accepted, confidence, reasons,
    )

    if db_session and insight_id:
        _persist(db_session, insight_id, confidence, accepted, reasons)

    return {"accepted": accepted, "reasons": reasons}


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _persist(db_session, insight_id: int, confidence: float,
             accepted: bool, reasons: list[str]) -> None:
    try:
        from models.validation_log import ValidationLog
        log = ValidationLog(
            insight_id=insight_id,
            validation_stage="output",
            status="passed" if accepted else "failed",
            confidence_before=confidence,
            confidence_after=confidence,
            notes="; ".join(reasons) if reasons else "All checks passed",
        )
        db_session.add(log)
        db_session.commit()
    except Exception as exc:
        db_session.rollback()
        logger.error("[Layer5/Output] DB persist failed: %s", exc)
