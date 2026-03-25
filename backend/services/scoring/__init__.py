"""
services/scoring/__init__.py — re-exports for convenience.
"""
from services.scoring.confidence import score_insight_confidence, compute_final_confidence
from services.scoring.urgency    import score_urgency
from services.scoring.novelty    import score_novelty
from services.scoring.legacy     import score_diff_significance, score_insight

__all__ = [
    "score_insight_confidence",
    "compute_final_confidence",
    "score_urgency",
    "score_novelty",
    "score_diff_significance",
    "score_insight"
]
