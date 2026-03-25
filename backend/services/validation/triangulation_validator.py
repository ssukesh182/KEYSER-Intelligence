"""
services/validation/triangulation_validator.py — Layer 3: Cross-Source Triangulation.

Checks whether a claim appears across multiple independent sources.
Confidence bonus:
    1 source  → no bonus
    2 sources → +0.10
    3+ sources → +0.20
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

BONUS_TWO_SOURCES   = 0.10
BONUS_THREE_SOURCES = 0.20


def count_corroborating_sources(
    claim: str,
    competitor: str,
    db_session,
) -> int:
    """
    Query the DB for existing insights with a similar claim for the same competitor.

    Args:
        claim:       The claim string to search for.
        competitor:  Competitor name string.
        db_session:  SQLAlchemy session.

    Returns:
        Number of distinct sources that contain this claim.
    """
    try:
        from models.insight        import Insight
        from models.insight_source import InsightSource
        from models.competitor     import Competitor

        # Find matching insights (substring match on title or description)
        claim_fragment = claim[:80] if len(claim) > 80 else claim

        matches = (
            db_session.query(Insight)
            .join(Competitor, Insight.competitor_id == Competitor.id)
            .filter(
                Competitor.name.ilike(f"%{competitor}%"),
                db.or_(
                    Insight.title.ilike(f"%{claim_fragment}%"),
                    Insight.description.ilike(f"%{claim_fragment}%"),
                )
            )
            .all()
        )

        # Count distinct source URLs via InsightSource → diff → snapshot → source
        source_ids: set = set()
        for insight in matches:
            for src in insight.sources:
                if src.diff and src.diff.old_snapshot:
                    source_ids.add(src.diff.old_snapshot.source_id)

        return max(1, len(source_ids))

    except Exception as exc:
        logger.error("[Layer3/Triangulation] DB query failed: %s", exc)
        return 1  # conservative — assume single source


def get_triangulation_bonus(source_count: int) -> float:
    """Return confidence bonus based on number of corroborating sources."""
    if source_count >= 3:
        return BONUS_THREE_SOURCES
    if source_count == 2:
        return BONUS_TWO_SOURCES
    return 0.0


def validate_triangulation(
    claim: str,
    competitor: str,
    current_confidence: float,
    insight_id: Optional[int] = None,
    db_session=None,
) -> dict:
    """
    Run Layer-3 triangulation validation.

    Args:
        claim:               The insight claim string.
        competitor:          Competitor name.
        current_confidence:  Confidence entering this layer.
        insight_id:          DB id of the Insight (for logging).
        db_session:          SQLAlchemy session.

    Returns:
        {
            "passed":               bool,
            "source_count":         int,
            "triangulation_bonus":  float,
            "confidence":           float,
        }
    """
    if db_session is None:
        # Without DB, no triangulation possible — return unchanged
        return {
            "passed":              True,
            "source_count":        1,
            "triangulation_bonus": 0.0,
            "confidence":          current_confidence,
        }

    source_count = count_corroborating_sources(claim, competitor, db_session)
    bonus        = get_triangulation_bonus(source_count)
    new_confidence = min(1.0, round(current_confidence + bonus, 4))

    logger.info(
        "[Layer3/Triangulation] sources=%d bonus=%.2f conf %.2f → %.2f",
        source_count, bonus, current_confidence, new_confidence,
    )

    if insight_id:
        _persist(db_session, insight_id, current_confidence, new_confidence,
                 bonus, source_count)

    return {
        "passed":              True,
        "source_count":        source_count,
        "triangulation_bonus": bonus,
        "confidence":          new_confidence,
    }


# ─── Internal helpers ─────────────────────────────────────────────────────────

def _persist(db_session, insight_id: int, conf_before: float,
             conf_after: float, bonus: float, sources: int) -> None:
    try:
        from models.validation_log   import ValidationLog
        from models.confidence_score import ConfidenceScore

        log = ValidationLog(
            insight_id=insight_id,
            validation_stage="triangulation",
            status="passed",
            confidence_before=conf_before,
            confidence_after=conf_after,
            notes=f"{sources} corroborating source(s), bonus={bonus:.2f}",
        )
        db_session.add(log)

        score = (db_session.query(ConfidenceScore)
                 .filter_by(insight_id=insight_id).first())
        if score:
            score.triangulation_bonus = bonus
            score.final_confidence    = conf_after
        db_session.commit()
    except Exception as exc:
        db_session.rollback()
        logger.error("[Layer3/Triangulation] DB persist failed: %s", exc)


# Local import guard (avoid circular imports at module level)
try:
    from extensions import db
except ImportError:
    pass
