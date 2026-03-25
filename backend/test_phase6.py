import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

import config
config.DATABASE_URL = "sqlite:///:memory:"

from sqlalchemy.dialects import sqlite
from sqlalchemy.types import JSON
sqlite.base.SQLiteTypeCompiler.visit_JSONB = sqlite.base.SQLiteTypeCompiler.visit_JSON

from app import create_app
from extensions import db
from models.competitor import Competitor
from models.insight import Insight

from services.intelligence.trend_detector import TrendDetector
from services.scoring.novelty import calculate_novelty_score
from safety.hallucination_guard import HallucinationGuard
from safety.output_validator import OutputValidator

def run_test():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with app.app_context():
        db.create_all()
        print("\n--- Phase 6 Test: Initializing ---")
        
        # 1. Test OutputValidator
        print("\n[1] Testing OutputValidator...")
        valid_json = {
            "title": "A", "description": "B", "insight_type": "pricing", 
            "confidence": 0.9, "urgency": 5, "action": "Do this"
        }
        invalid_json = {"title": "Missing fields"}
        
        is_valid = OutputValidator.validate_insight_schema(valid_json)
        is_invalid = OutputValidator.validate_insight_schema(invalid_json)
        
        print(f"Valid schema passed: {is_valid}")
        print(f"Invalid schema rejected: {not is_invalid}")
        
        # 2. Test HallucinationGuard
        print("\n[2] Testing HallucinationGuard (Requires gemma3:4b)...")
        guard = HallucinationGuard()
        source_text = "Swiggy increased delivery fee from rs 10 to rs 20."
        good_insight = "Swiggy doubled their delivery fee to 20 rs."
        bad_insight = "Swiggy doubled their delivery fee and also launched drone delivery."
        
        safe_check = guard.verify_insight(source_text, good_insight)
        fail_check = guard.verify_insight(source_text, bad_insight)
        print(f"Good insight passed: {safe_check}")
        print(f"Bad insight flagged as hallucination: {not fail_check}")
        
        # 3. Test Novelty Score (Embeddings)
        print("\n[3] Testing Novelty Score (Requires nomic-embed-text)...")
        hist_insights = ["Swiggy launched a new premium service", "Zomato reduced prices"]
        new_insight_dup = "Swiggy starts premium account service" # High semantic similarity
        new_insight_unique = "Blinkit introducing 24/7 drone delivery" # Unrelated
        
        score_dup = calculate_novelty_score(new_insight_dup, hist_insights)
        score_unique = calculate_novelty_score(new_insight_unique, hist_insights)
        print(f"Novelty for duplicate-like insight: {score_dup} / 10 (Lower is redundant)")
        print(f"Novelty for unique insight: {score_unique} / 10 (Higher is novel)")
        
        # 4. Test TrendDetector
        print("\n[4] Testing TrendDetector (Requires gemma3:4b)...")
        comp = Competitor(name="MockZepto")
        db.session.add(comp)
        db.session.commit()
        
        insights = [
            Insight(competitor_id=comp.id, title="Zepto raises 10min fee", description="Fee went from 5 to 10", category="pricing", urgency=4, action=""),
            Insight(competitor_id=comp.id, title="Zepto adds midnight surge", description="Midnight fee of 15 added", category="pricing", urgency=5, action=""),
            Insight(competitor_id=comp.id, title="Zepto drops free delivery", description="Minimum order for free delivery up from 99 to 199", category="offer", urgency=5, action="")
        ]
        
        detector = TrendDetector()
        trend = detector.detect_macro_trend("Zepto", insights)
        print("Detected Trend Analysis:")
        print(trend.get("trend_analysis"))

        print("\n[SUCCESS] Phase 6 Diagnostic script completed!")

if __name__ == "__main__":
    run_test()
