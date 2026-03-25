"""
services/hallucination_guard.py — Detects unsupported claims in LLM output.

Uses substring matching as primary check, with difflib SequenceMatcher as a
lightweight semantic fallback — no heavy GPU models required.
"""
import logging
import re
from difflib import SequenceMatcher
from typing import Optional

logger = logging.getLogger(__name__)

# Minimum ratio for SequenceMatcher to consider a claim "present" in text
SIMILARITY_THRESHOLD = 0.55


def _normalize(text: str) -> str:
    """Lowercase + collapse whitespace."""
    return re.sub(r"\s+", " ", text.lower()).strip()


def check_hallucination(claim: str, supporting_text: str) -> bool:
    """
    Return True if the claim is detectably present in supporting_text.

    Strategy:
        1. Direct substring check (fastest).
        2. Word-overlap check (handles paraphrasing).
        3. SequenceMatcher ratio as fuzzy fallback.

    Args:
        claim:          The LLM-generated claim string.
        supporting_text: Raw text the claim was sourced from.

    Returns:
        True  → claim is supported (not a hallucination).
        False → claim cannot be grounded in supporting_text.
    """
    if not claim or not supporting_text:
        logger.warning("[HallucinationGuard] Empty claim or supporting_text → False")
        return False

    norm_claim = _normalize(claim)
    norm_text  = _normalize(supporting_text)

    # 1. Direct substring
    if norm_claim in norm_text:
        logger.debug("[HallucinationGuard] Substring match — supported")
        return True

    # 2. Word-overlap: check if >60% of claim words appear in text
    claim_words = set(norm_claim.split())
    text_words  = set(norm_text.split())
    if claim_words:
        overlap = len(claim_words & text_words) / len(claim_words)
        if overlap >= 0.60:
            logger.debug("[HallucinationGuard] Word-overlap %.0f%% — supported", overlap * 100)
            return True

    # 3. SequenceMatcher fuzzy ratio
    ratio = SequenceMatcher(None, norm_claim, norm_text[:2000]).ratio()
    if ratio >= SIMILARITY_THRESHOLD:
        logger.debug("[HallucinationGuard] SequenceMatcher ratio=%.2f — supported", ratio)
        return True

    logger.warning(
        "[HallucinationGuard] Claim NOT grounded. claim_len=%d ratio=%.2f",
        len(claim), ratio,
    )
    return False


def is_hallucination(claim: str, supporting_text: str) -> bool:
    """Inverse of check_hallucination — returns True when claim IS a hallucination."""
    return not check_hallucination(claim, supporting_text)
