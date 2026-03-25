"""
services/validation/change_validator.py — Layer 4: Diff Quality Validation.

Filters out meaningless diffs by computing cosine similarity between
old_text and new_text. Diffs with similarity > 0.95 are discarded.
"""
import logging
from typing import Optional

from services.similarity_engine import compute_similarity, texts_are_duplicates

logger = logging.getLogger(__name__)

SIMILARITY_DISCARD_THRESHOLD = 0.95


def validate_change(
    old_text: str,
    new_text: str,
    diff_id: Optional[int] = None,
    insight_id: Optional[int] = None,
    db_session=None,
) -> dict:
    """
    Run Layer-4 change validation.

    Computes similarity between old and new text.
    If similarity > threshold → discard (meaningless change).

    Args:
        old_text:    Previous snapshot text.
        new_text:    Current snapshot text.
        diff_id:     DB id of the Diff record (informational).
        insight_id:  DB id of the Insight being validated.
        db_session:  SQLAlchemy session.

    Returns:
        {
            "accepted":    bool,   # True = meaningful change, False = discard
            "similarity":  float,
            "reason":      str,
        }
    """
    if not old_text and not new_text:
        return {"accepted": False, "similarity": 1.0, "reason": "Both texts empty"}

    if not old_text:
        return {"accepted": True, "similarity": 0.0, "reason": "No previous text — first snapshot"}

    similarity = compute_similarity(old_text, new_text)
    accepted   = similarity <= SIMILARITY_DISCARD_THRESHOLD

    reason = (
        f"Similarity={similarity:.3f} > {SIMILARITY_DISCARD_THRESHOLD} → discarded"
        if not accepted
        else f"Similarity={similarity:.3f} ≤ {SIMILARITY_DISCARD_THRESHOLD} → accepted"
    )

    logger.info(
        "[Layer4/Change] diff_id=%s similarity=%.3f accepted=%s",
        diff_id, similarity, accepted,
    )

    if db_session and insight_id:
        _persist(db_session, insight_id, accepted, similarity, reason)

    return {
        "accepted":   accepted,
        "similarity": similarity,
        "reason":     reason,
    }


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _persist(db_session, insight_id: int, accepted: bool,
             similarity: float, reason: str) -> None:
    try:
        from models.validation_log import ValidationLog
        log = ValidationLog(
            insight_id=insight_id,
            validation_stage="change",
            status="passed" if accepted else "failed",
            notes=reason,
        )
        db_session.add(log)
        db_session.commit()
    except Exception as exc:
        db_session.rollback()
        logger.error("[Layer4/Change] DB persist failed: %s", exc)
