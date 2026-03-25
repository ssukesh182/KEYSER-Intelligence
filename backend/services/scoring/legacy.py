"""
scoring.py — Significance scoring for diffs + insight scoring
"""


def score_diff_significance(old_text: str, new_text: str,
                             added: int, removed: int) -> float:
    """
    Returns a 0.0–1.0 significance score for a diff.
    Based on:
    - % of text changed relative to old text length
    - Absolute change volume
    """
    print(f"[SCORING] Scoring diff: +{added} lines, -{removed} lines")

    if not old_text:
        score = 1.0  # new content from scratch = max significance
        print(f"[SCORING] No old text — significance: {score}")
        return score

    old_words  = len(old_text.split())
    changed    = added + removed
    # % of old content that changed (capped at 1.0)
    ratio      = min(changed / max(old_words, 1), 1.0)

    # Boost for large absolute changes (10+ lines changed = more important)
    boost = 0.1 if changed >= 10 else 0.0

    score = round(min(ratio + boost, 1.0), 4)
    print(f"[SCORING] old_words={old_words}, changed={changed}, ratio={ratio:.4f}, score={score}")
    return score


def score_insight(category: str, frequency: int, significance: float) -> dict:
    """
    Returns novelty, relevance, confidence scores for an insight.
    All scores are 0.0–1.0.
    """
    print(f"[SCORING] Scoring insight: category={category}, freq={frequency}, sig={significance}")

    # Novelty — inverse frequency (rare = novel)
    novelty = round(max(0.0, 1.0 - (frequency - 1) * 0.15), 4)

    # Relevance — pricing + offer changes are most relevant in q-commerce
    relevance_base = {
        "pricing":   0.9,
        "offer":     0.85,
        "messaging": 0.75,
        "cta":       0.6,
        "general":   0.4,
    }
    relevance = relevance_base.get(category, 0.5)

    # Confidence = weighted combo of significance + relevance
    confidence = round((significance * 0.5 + relevance * 0.3 + novelty * 0.2), 4)

    scores = {"novelty": novelty, "relevance": relevance, "confidence": confidence}
    print(f"[SCORING] Scores: {scores}")
    return scores
