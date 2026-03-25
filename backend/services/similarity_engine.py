"""
services/similarity_engine.py — Text similarity utilities.

Supports:
    - Cosine similarity via TF-IDF vectorisation (scikit-learn).
    - Character-level SequenceMatcher fallback for very short texts.
    - A single unified interface: compute_similarity(a, b) → float [0..1]
"""
import logging
import re
from difflib import SequenceMatcher
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

# Minimum character count to prefer TF-IDF over SequenceMatcher
TFIDF_MIN_CHARS = 80


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def _sequence_similarity(a: str, b: str) -> float:
    """Fast character-level similarity via difflib."""
    return SequenceMatcher(None, a, b).ratio()


def _tfidf_cosine(a: str, b: str) -> float:
    """
    Cosine similarity using sklearn TF-IDF vectors.
    Falls back to SequenceMatcher if sklearn is unavailable.
    """
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity as sk_cosine

        vec = TfidfVectorizer().fit_transform([a, b])
        score: float = sk_cosine(vec[0], vec[1])[0][0]
        return float(score)
    except ImportError:
        logger.warning("[SimilarityEngine] sklearn not available — using SequenceMatcher")
        return _sequence_similarity(a, b)
    except Exception as exc:
        logger.error("[SimilarityEngine] TF-IDF failed: %s", exc)
        return _sequence_similarity(a, b)


def compute_similarity(text_a: str, text_b: str) -> float:
    """
    Compute similarity between two texts.

    Returns a float in [0.0, 1.0]:
        0.0 = completely different
        1.0 = identical

    Uses TF-IDF cosine for long texts, SequenceMatcher for short texts.
    """
    if not text_a or not text_b:
        return 0.0

    a = _normalize(text_a)
    b = _normalize(text_b)

    if a == b:
        return 1.0

    if len(a) < TFIDF_MIN_CHARS or len(b) < TFIDF_MIN_CHARS:
        score = _sequence_similarity(a, b)
        logger.debug("[SimilarityEngine] SequenceMatcher score=%.3f", score)
    else:
        score = _tfidf_cosine(a, b)
        logger.debug("[SimilarityEngine] TF-IDF cosine score=%.3f", score)

    return round(float(np.clip(score, 0.0, 1.0)), 4)


def texts_are_duplicates(text_a: str, text_b: str, threshold: float = 0.95) -> bool:
    """Return True if two texts are near-identical (similarity > threshold)."""
    return compute_similarity(text_a, text_b) > threshold
