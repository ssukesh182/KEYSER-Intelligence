"""
services/validation/extraction_validator.py — Layer 2: LLM Output Validation.

Validates:
    1. JSON structure via Pydantic schema.
    2. Required field presence.
    3. Hallucination detection (claim must exist in supporting_text).

Reduces confidence by 50% if hallucination is detected.
"""
import logging
from typing import Optional

from pydantic import ValidationError

from services.hallucination_guard import is_hallucination
from services.schemas.insight_schema import InsightSchema

logger = logging.getLogger(__name__)

HALLUCINATION_PENALTY = 0.50  # multiply confidence by this on detection


# ─── Main Entry Point ─────────────────────────────────────────────────────────

def validate_extraction(
    raw_data: dict,
    base_confidence: float = 0.75,
    insight_id: Optional[int] = None,
    db_session=None,
    extra_context: str = "",  # snapshot new_text for cross-referencing
) -> dict:
    """
    Run Layer-2 validation on LLM-extracted data.

    Args:
        raw_data:        Dict output from the LLM (claim, category, …).
        base_confidence: Confidence entering this layer (from Layer 1).
        insight_id:      DB id of the Insight (for logging).
        db_session:      SQLAlchemy session. If None, skips DB writes.

    Returns:
        {
            "passed":         bool,
            "confidence":     float,
            "errors":         list[str],
            "hallucination":  bool,
            "parsed":         InsightSchema | None,
        }
    """
    errors: list[str] = []
    hallucination = False
    parsed: Optional[InsightSchema] = None
    confidence = base_confidence

    # ── 1. Structural validation ──────────────────────────────────────────────
    try:
        parsed = InsightSchema(**raw_data)
        # Override confidence with schema value if higher-fidelity
        confidence = parsed.confidence if parsed.confidence > 0 else base_confidence
        logger.info("[Layer2/Extraction] Schema valid for claim=%s…",
                    parsed.claim[:60])
    except ValidationError as exc:
        for err in exc.errors():
            errors.append(f"{err['loc'][0]}: {err['msg']}")
        logger.warning("[Layer2/Extraction] Schema invalid: %s", errors)
        return {
            "passed":        False,
            "confidence":    confidence,
            "errors":        errors,
            "hallucination": False,
            "parsed":        None,
        }

    # ── 2. Hallucination check ────────────────────────────────────────────────
    hallucination = is_hallucination(parsed.claim, parsed.supporting_text, extra_context)
    if hallucination:
        original = confidence
        confidence = round(confidence * HALLUCINATION_PENALTY, 4)
        logger.warning(
            "[Layer2/Extraction] Hallucination! confidence %.2f → %.2f",
            original, confidence,
        )
        errors.append("Claim not grounded in supporting_text (possible hallucination)")

    passed = not errors or (not hallucination and len(errors) == 0)

    if db_session and insight_id:
        _persist(db_session, insight_id, base_confidence, confidence,
                 passed, errors)

    return {
        "passed":        passed,
        "confidence":    confidence,
        "errors":        errors,
        "hallucination": hallucination,
        "parsed":        parsed.model_dump() if parsed else None,
    }


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _persist(db_session, insight_id: int, conf_before: float,
             conf_after: float, passed: bool, errors: list) -> None:
    """Write a ValidationLog entry for Layer 2."""
    try:
        from models.validation_log import ValidationLog
        log = ValidationLog(
            insight_id=insight_id,
            validation_stage="extraction",
            status="passed" if passed else "failed",
            confidence_before=conf_before,
            confidence_after=conf_after,
            notes="; ".join(errors) if errors else "OK",
        )
        db_session.add(log)
        db_session.commit()
    except Exception as exc:
        db_session.rollback()
        logger.error("[Layer2/Extraction] DB persist failed: %s", exc)
