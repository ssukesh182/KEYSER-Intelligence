"""
services/scoring/urgency.py — Urgency scoring for intelligence insights.

Detects high-urgency signals in the claim or supporting text:
    - Price drops
    - Delivery time reductions
    - New city launches
    - Hiring spikes

Returns a float in [0.0, 1.0].
"""
import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)

# Keyword patterns → urgency weight
URGENCY_SIGNALS: list[tuple[list[str], float]] = [
    # Price signals
    (["price drop", "price cut", "price reduction", "cheaper", "discount",
      "slash", "lower price", "reduced price", "sale", "cashback"], 0.85),
    # Delivery speed
    (["10 minute", "10-minute", "instant delivery", "faster delivery",
      "delivery time", "minutes delivery", "speed up"], 0.80),
    # Expansion signals
    (["new city", "launch", "expanding", "expansion", "new market",
      "entering", "new region", "nationwide"], 0.75),
    # Hiring spikes
    (["hiring", "recruitment", "100+ jobs", "mass hiring", "job postings spike",
      "rapid hiring", "talent acquisition"], 0.70),
    # Generic high-urgency
    (["breaking", "urgent", "immediately", "critical", "spike", "surge"], 0.65),
]

BASE_URGENCY   = 0.30
URGENCY_FLOOR  = 0.10
URGENCY_CEIL   = 1.00

def calculate_urgency(insight_type: str) -> int:
    """
    Returns an urgency score (1-5) based on the type of change.
    pricing change = 5
    messaging change = 4
    feature change = 3
    social/trend mention = 2
    default = 1
    """
    mapping = {
        "pricing": 5,
        "messaging": 4,
        "feature": 3,
        "offer": 3,
        "trend": 2,
        "social": 2
    }
    
    return mapping.get(insight_type.lower(), 1)

def score_urgency(claim: str, supporting_text: str = "") -> float:
    """
    Compute urgency score for an insight.

    Args:
        claim:           The LLM-generated claim.
        supporting_text: Raw source text the claim came from.

    Returns:
        float in [0.0, 1.0]
    """
    combined = (claim + " " + supporting_text).lower()
    max_urgency = BASE_URGENCY

    for keywords, weight in URGENCY_SIGNALS:
        for kw in keywords:
            if kw in combined:
                if weight > max_urgency:
                    max_urgency = weight
                    logger.debug("[Urgency] Matched keyword='%s' weight=%.2f", kw, weight)
                break  # one keyword match per group is enough

    score = round(min(URGENCY_CEIL, max(URGENCY_FLOOR, max_urgency)), 4)
    logger.info("[Urgency] score=%.2f for claim='%s…'", score, claim[:60])
    return score
