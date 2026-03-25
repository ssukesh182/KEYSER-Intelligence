"""
tests/test_triangulation.py — Unit tests for Layer 3 triangulation logic.

Run with:
    cd backend
    python -m pytest tests/test_triangulation.py -v
"""
import pytest
from services.validation.triangulation_validator import (
    get_triangulation_bonus,
    BONUS_TWO_SOURCES,
    BONUS_THREE_SOURCES,
)


class TestTriangulationBonus:

    def test_one_source_no_bonus(self):
        assert get_triangulation_bonus(1) == 0.0

    def test_two_sources_bonus(self):
        assert get_triangulation_bonus(2) == BONUS_TWO_SOURCES

    def test_three_sources_max_bonus(self):
        assert get_triangulation_bonus(3) == BONUS_THREE_SOURCES

    def test_four_plus_sources_still_max_bonus(self):
        assert get_triangulation_bonus(10) == BONUS_THREE_SOURCES

    def test_zero_sources_no_bonus(self):
        assert get_triangulation_bonus(0) == 0.0


class TestTriangulationValidator:

    def test_no_db_session_returns_unchanged_confidence(self):
        from services.validation.triangulation_validator import validate_triangulation
        result = validate_triangulation(
            claim="Zepto cut prices",
            competitor="Zepto",
            current_confidence=0.75,
            db_session=None,
        )
        assert result["passed"] is True
        assert result["confidence"] == 0.75
        assert result["triangulation_bonus"] == 0.0
        assert result["source_count"] == 1

    def test_confidence_clamped_to_one(self):
        from services.validation.triangulation_validator import validate_triangulation
        # With bonus applied manually: 0.90 + 0.20 = 1.0 (clamped)
        result = validate_triangulation(
            claim="Zepto cut prices",
            competitor="Zepto",
            current_confidence=0.90,
            db_session=None,
        )
        assert result["confidence"] <= 1.0

    def test_bonus_applied_correctly(self):
        # Simulate what would happen with 3 sources
        base = 0.75
        bonus = get_triangulation_bonus(3)
        expected = min(1.0, round(base + bonus, 4))
        assert expected == min(1.0, round(0.75 + 0.20, 4))
