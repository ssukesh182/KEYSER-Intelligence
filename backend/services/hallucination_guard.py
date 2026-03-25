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


def check_hallucination(claim: str, supporting_text: str, extra_context: str = "") -> bool:
    """
    Return True if the claim is detectably present in supporting_text or extra_context.

    Strategy:
        1. Direct substring check (fastest).
        2. Word-overlap check (handles paraphrasing) — threshold 40%.
        3. SequenceMatcher ratio as fuzzy fallback.

    Args:
        claim:          The LLM-generated claim string.
        supporting_text: Raw text the claim was sourced from.
        extra_context:  Additional context (e.g., snapshot new_text) to check against.

    Returns:
        True  → claim is supported (not a hallucination).
        False → claim cannot be grounded in supporting_text or extra_context.
    """
    if not claim or not supporting_text:
        logger.warning("[HallucinationGuard] Empty claim or supporting_text → False")
        return False

    norm_claim = _normalize(claim)
    norm_text  = _normalize(supporting_text)
    norm_extra = _normalize(extra_context) if extra_context else ""
    # Combine both sources into one search space
    combined = norm_text + " " + norm_extra

    # 1. Direct substring
    if norm_claim in combined:
        logger.debug("[HallucinationGuard] Substring match — supported")
        return True

    # 2. Word-overlap: check if >40% of claim words appear in combined text
    claim_words = set(norm_claim.split())
    text_words  = set(combined.split())
    if claim_words:
        overlap = len(claim_words & text_words) / len(claim_words)
        if overlap >= 0.40:  # lowered from 0.60 to handle LLM paraphrasing
            logger.debug("[HallucinationGuard] Word-overlap %.0f%% — supported", overlap * 100)
            return True

    # 3. SequenceMatcher fuzzy ratio
    ratio = SequenceMatcher(None, norm_claim, combined[:2000]).ratio()
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
