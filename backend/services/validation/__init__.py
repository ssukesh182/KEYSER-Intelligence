"""
services/validation/__init__.py — Validation pipeline orchestrator.

Chains all 5 layers in sequence and returns a unified result.
"""
from __future__ import annotations

import logging
from typing import Optional

logger = logging.getLogger(__name__)


def run_validation_pipeline(
    raw_llm_output: dict,
    source_type: str,
    old_text: str = "",
    new_text: str = "",
    insight_id: Optional[int] = None,
    db_session=None,
) -> dict:
    """
    Execute all 5 validation layers sequentially.

    Args:
        raw_llm_output:  Dict from LLM with keys: claim, category,
                         subcategory, competitor, confidence,
                         supporting_text, source_url.
        source_type:     Source type string (e.g. 'google_ads').
        old_text:        Previous snapshot text (for Layer 4).
        new_text:        Current snapshot text (for Layer 4).
        insight_id:      Insight DB id (for logging).
        db_session:      SQLAlchemy session.

    Returns:
        {
            "accepted":    bool,
            "confidence":  float,
            "layers":      dict,   # per-layer results
        }
    """
    from services.validation.source_validator       import validate_source
    from services.validation.extraction_validator   import validate_extraction
    from services.validation.triangulation_validator import validate_triangulation
    from services.validation.change_validator       import validate_change
    from services.validation.output_validator       import validate_output

    layers: dict = {}

    # ── Layer 1: Source ───────────────────────────────────────────────────────
    l1 = validate_source(source_type, insight_id, db_session)
    layers["source"] = l1
    confidence = l1["base_confidence"]
    if not l1["passed"]:
        logger.warning("[Pipeline] Layer 1 failed — aborting")
        return {"accepted": False, "confidence": confidence, "layers": layers}

    # ── Layer 2: Extraction ───────────────────────────────────────────────────
    l2 = validate_extraction(raw_llm_output, confidence, insight_id, db_session, extra_context=new_text)
    layers["extraction"] = l2
    confidence = l2["confidence"]
    if not l2["passed"]:
        logger.warning("[Pipeline] Layer 2 failed — aborting")
        return {"accepted": False, "confidence": confidence, "layers": layers}

    # ── Layer 3: Triangulation ────────────────────────────────────────────────
    competitor = raw_llm_output.get("competitor", "")
    claim      = raw_llm_output.get("claim", "")
    l3 = validate_triangulation(claim, competitor, confidence, insight_id, db_session)
    layers["triangulation"] = l3
    confidence = l3["confidence"]

    # ── Layer 4: Change ───────────────────────────────────────────────────────
    l4 = validate_change(old_text, new_text, None, insight_id, db_session)
    layers["change"] = l4
    if not l4["accepted"]:
        logger.info("[Pipeline] Layer 4 rejected diff as duplicate")
        return {"accepted": False, "confidence": confidence, "layers": layers}

    # ── Layer 5: Output ───────────────────────────────────────────────────────
    supporting_text = raw_llm_output.get("supporting_text", "")
    source_url      = raw_llm_output.get("source_url", "")
    l5 = validate_output(confidence, supporting_text, source_url,
                         insight_id, db_session)
    layers["output"] = l5

    return {
        "accepted":   l5["accepted"],
        "confidence": confidence,
        "layers":     layers,
    }
