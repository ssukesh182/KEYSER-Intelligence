"""
services/schemas/insight_schema.py — Pydantic schema for LLM-extracted insights.
"""
from pydantic import BaseModel, field_validator


class InsightSchema(BaseModel):
    """Schema for a single LLM-extracted insight claim."""

    claim:           str
    category:        str
    subcategory:     str
    competitor:      str
    confidence:      float
    supporting_text: str
    source_url:      str = ""  # optional — LLMs often return 'unknown'

    @field_validator("confidence")
    @classmethod
    def confidence_range(cls, v: float) -> float:
        if not (0.0 <= v <= 1.0):
            raise ValueError(f"confidence must be in [0, 1], got {v}")
        return v

    @field_validator("claim", "category", "subcategory", "competitor", "supporting_text")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field must not be empty")
        return v.strip()
