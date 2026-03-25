"""
services/scoring/novelty.py — Novelty scoring for intelligence insights.

Novelty is high when:
    - The claim pattern hasn't been seen before for this competitor.
    - The claim involves a rare or unexpected event.
    - The diff is large relative to historical norms.

Returns a float in [0.0, 1.0].
"""
import logging
import re
from typing import Optional
from services.embeddings.similarity_search import SimilaritySearch

logger = logging.getLogger(__name__)

# Keywords that indicate rare/novel events
NOVEL_SIGNALS: list[tuple[list[str], float]] = [
    (["first time", "never before", "unprecedented", "new feature",
      "brand new", "just launched", "for the first time"], 0.95),
    (["pilot", "beta", "limited release", "soft launch", "test market"], 0.85),
    (["surprise", "unexpected", "sudden", "overnight", "abrupt"], 0.80),
    (["partnership", "acquisition", "merger", "collaboration", "joint"], 0.75),
    (["rebrand", "redesign", "overhaul", "revamp", "restructure"], 0.70),
]

BASE_NOVELTY  = 0.50
NOVELTY_FLOOR = 0.10
NOVELTY_CEIL  = 1.00

def calculate_novelty_score(new_insight_text: str, historical_insights_texts: list) -> int:
    """
    Calculates a novelty score from 1-10 based on how semantically different 
    the new insight is compared to historical insights.
    10 means highly novel (no similar past insights).
    1 means highly redundant.
    """
    if not historical_insights_texts:
        return 10
        
    try:
        searcher = SimilaritySearch()
        max_sim = 0.0
        new_emb = searcher.client.get_embedding(new_insight_text)
        
        if not new_emb:
            return 5
            
        for hist_text in historical_insights_texts:
            hist_emb = searcher.client.get_embedding(hist_text)
            if hist_emb:
                sim = searcher.cosine_similarity(new_emb, hist_emb)
                if sim > max_sim:
                    max_sim = sim
                    
        novelty = int(10 - (max_sim * 9))
        return max(1, min(10, novelty))
    except Exception as e:
        logger.error(f"Error calculating novelty: {e}")
        return 5

def score_novelty(
    claim: str,
    supporting_text: str = "",
    db_session=None,
    competitor: str = "",
) -> float:
    """
    Compute novelty score for an insight.

    Uses keyword patterns for rapid scoring.
    If db_session is provided, also checks DB recency to dampen
    repeated claims (older = less novel).

    Args:
        claim:           The LLM-generated claim.
        supporting_text: Raw source text.
        db_session:      SQLAlchemy session (optional).
        competitor:      Competitor name (for DB recency check).

    Returns:
        float in [0.0, 1.0]
    """
    combined = (claim + " " + supporting_text).lower()
    keyword_boost = 0.0

    for keywords, weight in NOVEL_SIGNALS:
        for kw in keywords:
            if kw in combined:
                keyword_boost = max(keyword_boost, weight)
                logger.debug("[Novelty] Matched keyword='%s' boost=%.2f", kw, weight)
                break

    base = keyword_boost if keyword_boost > 0 else BASE_NOVELTY

    # ── DB recency dampening ──────────────────────────────────────────────────
    if db_session and competitor:
        base = _apply_recency_dampening(base, claim, competitor, db_session)

    score = round(min(NOVELTY_CEIL, max(NOVELTY_FLOOR, base)), 4)
    logger.info("[Novelty] score=%.2f for claim='%s…'", score, claim[:60])
    return score


def _apply_recency_dampening(
    base: float, claim: str, competitor: str, db_session
) -> float:
    """Reduce novelty if the same claim has been seen recently."""
    try:
        from models.insight    import Insight
        from models.competitor import Competitor
        from datetime          import datetime, timezone, timedelta

        cutoff = datetime.now(timezone.utc) - timedelta(days=30)
        fragment = claim[:80]

        count = (
            db_session.query(Insight)
            .join(Competitor, Insight.competitor_id == Competitor.id)
            .filter(
                Competitor.name.ilike(f"%{competitor}%"),
                Insight.created_at >= cutoff,
                Insight.title.ilike(f"%{fragment}%"),
            )
            .count()
        )

        if count >= 5:
            dampened = base * 0.40
            logger.debug("[Novelty] Heavy dampening (count=%d) %.2f→%.2f",
                         count, base, dampened)
            return dampened
        if count >= 2:
            dampened = base * 0.70
            logger.debug("[Novelty] Light dampening (count=%d) %.2f→%.2f",
                         count, base, dampened)
            return dampened

    except Exception as exc:
        logger.error("[Novelty] DB recency check failed: %s", exc)

    return base
