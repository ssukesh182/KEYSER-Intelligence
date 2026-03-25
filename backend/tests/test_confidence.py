"""
tests/test_confidence.py — Unit tests for the confidence scoring pipeline.

Tests urgency scoring, novelty scoring, and the final combined confidence.

Run with:
    cd backend
    python -m pytest tests/test_confidence.py -v
"""
import pytest


# ─── Urgency Scoring ──────────────────────────────────────────────────────────

class TestUrgencyScoring:

    def test_price_drop_high_urgency(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency(
            claim="Zepto announced a major price cut on essentials",
            supporting_text="",
        )
        assert score >= 0.80

    def test_delivery_time_high_urgency(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("10-minute delivery now available in all cities")
        assert score >= 0.75

    def test_new_city_launch_high_urgency(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("Blinkit expanding to new city in South India")
        assert score >= 0.70

    def test_hiring_spike_high_urgency(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("Swiggy mass hiring 500+ riders this month")
        assert score >= 0.65

    def test_generic_claim_low_urgency(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("Competitor updated their website footer")
        assert score < 0.50   # low urgency for mundane change

    def test_urgency_within_bounds(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("anything")
        assert 0.0 <= score <= 1.0

    def test_empty_claim_returns_floor(self):
        from services.scoring.urgency import score_urgency
        score = score_urgency("")
        assert score >= 0.0


# ─── Novelty Scoring ─────────────────────────────────────────────────────────

class TestNoveltyScoring:

    def test_first_time_event_high_novelty(self):
        from services.scoring.novelty import score_novelty
        score = score_novelty(
            "Zepto launched instant credit feature for the first time"
        )
        assert score >= 0.85

    def test_beta_launch_high_novelty(self):
        from services.scoring.novelty import score_novelty
        score = score_novelty("Blinkit in beta testing for drone delivery")
        assert score >= 0.75

    def test_rebrand_high_novelty(self):
        from services.scoring.novelty import score_novelty
        score = score_novelty("Swiggy announced a major rebrand of its app")
        assert score >= 0.70

    def test_ordinary_claim_mid_novelty(self):
        from services.scoring.novelty import score_novelty
        score = score_novelty("Zepto updated its homepage banner")
        assert 0.0 <= score <= 0.75

    def test_novelty_within_bounds(self):
        from services.scoring.novelty import score_novelty
        for claim in ["", "random text", "first time launch"]:
            score = score_novelty(claim)
            assert 0.0 <= score <= 1.0, f"Out of bounds for claim: {claim!r}"


# ─── Combined Confidence ──────────────────────────────────────────────────────

class TestComputeFinalConfidence:

    def test_high_base_high_final(self):
        from services.scoring.confidence import compute_final_confidence
        final = compute_final_confidence(
            base_confidence=0.95,
            triangulation_bonus=0.20,
            novelty_score=0.90,
            urgency_score=0.85,
        )
        assert final >= 0.80
        assert final <= 1.0

    def test_low_base_low_final(self):
        from services.scoring.confidence import compute_final_confidence
        final = compute_final_confidence(
            base_confidence=0.30,
            triangulation_bonus=0.0,
            novelty_score=0.20,
            urgency_score=0.15,
        )
        assert final < 0.50

    def test_result_always_clamped(self):
        from services.scoring.confidence import compute_final_confidence
        # Edge: absurdly high inputs still clamp to 1.0
        final = compute_final_confidence(
            base_confidence=1.0,
            triangulation_bonus=1.0,
            novelty_score=1.0,
            urgency_score=1.0,
        )
        assert final == 1.0

    def test_zero_inputs_low_but_positive(self):
        from services.scoring.confidence import compute_final_confidence
        final = compute_final_confidence(0.0, 0.0, 0.0, 0.0)
        assert final == 0.0

    def test_triangulation_bonus_increases_confidence(self):
        from services.scoring.confidence import compute_final_confidence
        without = compute_final_confidence(0.70, 0.0, 0.50, 0.50)
        with_   = compute_final_confidence(0.70, 0.20, 0.50, 0.50)
        assert with_ > without

    def test_confidence_is_float(self):
        from services.scoring.confidence import compute_final_confidence
        result = compute_final_confidence(0.80, 0.10, 0.60, 0.70)
        assert isinstance(result, float)
