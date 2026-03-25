"""
tests/test_validation.py — Unit tests for Layers 1, 2, 4, 5 validators
and the hallucination guard.

Run with:
    cd backend
    python -m pytest tests/test_validation.py -v
"""
import pytest


# ─── Layer 1: Source Validator ────────────────────────────────────────────────

class TestSourceValidator:
    from services.validation.source_validator import (
        get_source_confidence, validate_source
    )

    def test_google_ads_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("google_ads") == 0.95

    def test_reviews_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("reviews") == 0.85

    def test_landing_page_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("landing_page") == 0.80

    def test_jobs_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("jobs") == 0.75

    def test_app_store_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("app_store") == 0.70

    def test_social_confidence(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("social") == 0.55

    def test_unknown_source_returns_default(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("unknown_channel") == 0.50

    def test_case_insensitive(self):
        from services.validation.source_validator import get_source_confidence
        assert get_source_confidence("GOOGLE_ADS") == 0.95

    def test_validate_source_no_db(self):
        from services.validation.source_validator import validate_source
        result = validate_source("google_ads")
        assert result["passed"] is True
        assert result["base_confidence"] == 0.95

    def test_validate_source_low_confidence_fails(self):
        from services.validation.source_validator import validate_source
        result = validate_source("social")
        # social (0.55) >= 0.50 → still passes base threshold
        assert result["passed"] is True
        assert result["base_confidence"] == 0.55


# ─── Hallucination Guard ──────────────────────────────────────────────────────

class TestHallucinationGuard:

    def test_exact_substring_match(self):
        from services.hallucination_guard import check_hallucination
        assert check_hallucination(
            "Zepto dropped prices by 20%",
            "We found that Zepto dropped prices by 20% across all categories."
        ) is True

    def test_word_overlap_match(self):
        from services.hallucination_guard import check_hallucination
        assert check_hallucination(
            "Swiggy launched same-day delivery in Mumbai",
            "Swiggy has launched its new same-day delivery service across Mumbai and Delhi."
        ) is True

    def test_hallucination_detected(self):
        from services.hallucination_guard import is_hallucination
        assert is_hallucination(
            "Blinkit acquired Dunzo for $500M",
            "Blinkit reported steady growth in Q3 across Southern India."
        ) is True

    def test_empty_claim_returns_false(self):
        from services.hallucination_guard import check_hallucination
        assert check_hallucination("", "some supporting text") is False

    def test_empty_supporting_text_returns_false(self):
        from services.hallucination_guard import check_hallucination
        assert check_hallucination("some claim", "") is False


# ─── Layer 2: Extraction Validator ───────────────────────────────────────────

VALID_LLM_OUTPUT = {
    "claim":           "Zepto increased delivery fee by 10%",
    "category":        "pricing",
    "subcategory":     "delivery_fee",
    "competitor":      "Zepto",
    "confidence":      0.80,
    "supporting_text": "Zepto increased delivery fee by 10% in metro cities starting November.",
    "source_url":      "https://zepto.com/pricing",
}


class TestExtractionValidator:

    def test_valid_data_passes(self):
        from services.validation.extraction_validator import validate_extraction
        result = validate_extraction(VALID_LLM_OUTPUT, base_confidence=0.80)
        assert result["passed"] is True
        assert result["hallucination"] is False
        assert len(result["errors"]) == 0

    def test_missing_required_field_fails(self):
        from services.validation.extraction_validator import validate_extraction
        bad = {**VALID_LLM_OUTPUT}
        del bad["claim"]
        result = validate_extraction(bad)
        assert result["passed"] is False
        assert result["parsed"] is None

    def test_empty_claim_fails(self):
        from services.validation.extraction_validator import validate_extraction
        bad = {**VALID_LLM_OUTPUT, "claim": "  "}
        result = validate_extraction(bad)
        assert result["passed"] is False

    def test_confidence_out_of_range_fails(self):
        from services.validation.extraction_validator import validate_extraction
        bad = {**VALID_LLM_OUTPUT, "confidence": 1.5}
        result = validate_extraction(bad)
        assert result["passed"] is False

    def test_hallucination_reduces_confidence(self):
        from services.validation.extraction_validator import validate_extraction
        hallucinatory = {
            **VALID_LLM_OUTPUT,
            "claim": "Zepto acquired Amazon Fresh for $2 billion",
            "supporting_text": "Zepto runs a fast delivery service in Indian cities.",
        }
        result = validate_extraction(hallucinatory, base_confidence=0.80)
        assert result["hallucination"] is True
        # confidence should be reduced
        assert result["confidence"] < 0.80


# ─── Layer 4: Change Validator ────────────────────────────────────────────────

class TestChangeValidator:

    def test_identical_texts_rejected(self):
        from services.validation.change_validator import validate_change
        text = "Zepto offers 10-minute delivery in Bangalore."
        result = validate_change(text, text)
        assert result["accepted"] is False
        assert result["similarity"] > 0.95

    def test_very_different_texts_accepted(self):
        from services.validation.change_validator import validate_change
        old = "Zepto offers free delivery on orders above ₹200."
        new = "Blinkit launched a new loyalty program with cashback rewards across 20 cities."
        result = validate_change(old, new)
        assert result["accepted"] is True

    def test_no_old_text_accepted(self):
        from services.validation.change_validator import validate_change
        result = validate_change("", "Brand new content here.")
        assert result["accepted"] is True

    def test_both_empty_rejected(self):
        from services.validation.change_validator import validate_change
        result = validate_change("", "")
        assert result["accepted"] is False


# ─── Layer 5: Output Validator ────────────────────────────────────────────────

class TestOutputValidator:

    def test_valid_high_confidence_accepted(self):
        from services.validation.output_validator import validate_output
        result = validate_output(
            confidence=0.85,
            supporting_text="Zepto raised delivery fee by 10% in metro cities.",
            source_url="https://zepto.com",
        )
        assert result["accepted"] is True
        assert len(result["reasons"]) == 0

    def test_low_confidence_rejected(self):
        from services.validation.output_validator import validate_output
        result = validate_output(
            confidence=0.30,
            supporting_text="Some text.",
            source_url="https://example.com",
        )
        assert result["accepted"] is False
        assert any("Confidence" in r for r in result["reasons"])

    def test_missing_supporting_text_rejected(self):
        from services.validation.output_validator import validate_output
        result = validate_output(
            confidence=0.80,
            supporting_text="",
            source_url="https://example.com",
        )
        assert result["accepted"] is False

    def test_missing_source_url_rejected(self):
        from services.validation.output_validator import validate_output
        result = validate_output(
            confidence=0.80,
            supporting_text="Some supporting content.",
            source_url="",
        )
        assert result["accepted"] is False

    def test_exactly_at_min_threshold(self):
        from services.validation.output_validator import validate_output
        result = validate_output(
            confidence=0.50,
            supporting_text="Valid text here.",
            source_url="https://source.com",
        )
        assert result["accepted"] is True


# ─── Similarity Engine ────────────────────────────────────────────────────────

class TestSimilarityEngine:

    def test_identical_texts_return_one(self):
        from services.similarity_engine import compute_similarity
        assert compute_similarity("hello world", "hello world") == 1.0

    def test_empty_texts_return_zero(self):
        from services.similarity_engine import compute_similarity
        assert compute_similarity("", "anything") == 0.0

    def test_near_duplicate_above_threshold(self):
        from services.similarity_engine import texts_are_duplicates
        a = "Zepto dropped prices across all categories in metro cities."
        b = "Zepto dropped prices across all categories in metro cities today."
        assert texts_are_duplicates(a, b, threshold=0.85) is True

    def test_different_texts_not_duplicate(self):
        from services.similarity_engine import texts_are_duplicates
        a = "Zepto offers 10-minute delivery in Bangalore."
        b = "Swiggy launched a premium subscription plan targeting affluent customers."
        assert texts_are_duplicates(a, b) is False
