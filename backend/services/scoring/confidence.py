"""
services/scoring/confidence.py — Final confidence aggregation.

Combines:
    - Base confidence (from source type, Layer 1)
    - Triangulation bonus (from Layer 3)
    - Novelty score (weighted contribution)
    - Urgency score (weighted contribution)

Result is clamped to [0.0, 1.0].
"""
import logging
from typing import Optional

import numpy as np

from services.scoring.urgency import score_urgency
from services.scoring.novelty  import score_novelty

logger = logging.getLogger(__name__)

# Weights for the blended final confidence
W_BASE          = 0.50   # source + extraction confidence carries most weight
W_NOVELTY       = 0.25
W_URGENCY       = 0.25

def calculate_confidence(corroborating_sources: int, total_sources: int) -> float:
    """
    Calculates confidence based on the number of corroborating sources 
    compared to the total available sources.
    Returns a float between 0.0 and 1.0.
    """
    if total_sources <= 0:
        return 0.5  # default baseline if no triangulation data is available
    
    # Simple weight: corroborating / total
    # If 2 out of 3 sources confirm a pricing change, confidence = 0.66
    confidence = corroborating_sources / total_sources
    
    # Clamp between 0.0 and 1.0
    return max(0.0, min(1.0, confidence))

def compute_final_confidence(
    base_confidence: float,
    triangulation_bonus: float,
    novelty_score: float,
    urgency_score: float,
) -> float:
    """
    Compute final clamped confidence score.

    Formula:
        blended = (base + triangulation_bonus) * W_BASE
                + novelty * W_NOVELTY
                + urgency * W_URGENCY
        final   = clamp(blended, 0.0, 1.0)

    Args:
        base_confidence:     Score from source + extraction layers.
        triangulation_bonus: Bonus added by triangulation layer.
        novelty_score:       Novelty score in [0, 1].
        urgency_score:       Urgency score in [0, 1].

    Returns:
        float in [0.0, 1.0]
    """
    adjusted_base = min(1.0, base_confidence + triangulation_bonus)
    blended = (
        adjusted_base    * W_BASE
        + novelty_score  * W_NOVELTY
        + urgency_score  * W_URGENCY
    )
    final = float(np.clip(blended, 0.0, 1.0))
    logger.info(
        "[Confidence] base=%.2f +bonus=%.2f nov=%.2f urg=%.2f → final=%.2f",
        base_confidence, triangulation_bonus,
        novelty_score, urgency_score, final,
    )
    return round(final, 4)


def score_insight_confidence(
    claim: str,
    supporting_text: str,
    source_type: str,
    triangulation_bonus: float = 0.0,
    insight_id: Optional[int] = None,
    competitor: str = "",
    db_session=None,
) -> dict:
    """
    Full convenience function: compute all sub-scores and return the final
    confidence breakdown for an insight.

    Args:
        claim:               The insight claim.
        supporting_text:     Raw source text.
        source_type:         Source type (e.g. 'google_ads').
        triangulation_bonus: Pre-computed bonus from triangulation layer.
        insight_id:          DB id of the Insight (for DB persistence).
        competitor:          Competitor name (used for novelty DB check).
        db_session:          SQLAlchemy session.

    Returns:
        {
            "base_confidence":     float,
            "triangulation_bonus": float,
            "novelty_score":       float,
            "urgency_score":       float,
            "final_confidence":    float,
        }
    """
    from services.validation.source_validator import get_source_confidence

    base      = get_source_confidence(source_type)
    urgency   = score_urgency(claim, supporting_text)
    novelty   = score_novelty(claim, supporting_text, db_session, competitor)
    final     = compute_final_confidence(base, triangulation_bonus,
                                         novelty, urgency)

    result = {
        "base_confidence":     base,
        "triangulation_bonus": triangulation_bonus,
        "novelty_score":       novelty,
        "urgency_score":       urgency,
        "final_confidence":    final,
    }

    if db_session and insight_id:
        _persist_scores(db_session, insight_id, result)

    return result


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _persist_scores(db_session, insight_id: int, scores: dict) -> None:
    """Upsert ConfidenceScore record with full breakdown."""
    try:
        from models.confidence_score import ConfidenceScore

        row = (db_session.query(ConfidenceScore)
               .filter_by(insight_id=insight_id).first())
        if row:
            row.base_confidence     = scores["base_confidence"]
            row.triangulation_bonus = scores["triangulation_bonus"]
            row.novelty_score       = scores["novelty_score"]
            row.urgency_score       = scores["urgency_score"]
            row.final_confidence    = scores["final_confidence"]
        else:
            row = ConfidenceScore(
                insight_id=insight_id,
                **scores,
            )
            db_session.add(row)

        db_session.commit()
        logger.debug("[Confidence] DB upserted for insight_id=%s", insight_id)
    except Exception as exc:
        db_session.rollback()
        logger.error("[Confidence] DB persist failed: %s", exc)
