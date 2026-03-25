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
from services.pipelines.copilot_pipeline import process_copilot_chat

def run_test():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with app.app_context():
        db.create_all()
        print("\n--- Generating Mock Data for Phase 5 Test ---")
        
        comp1 = Competitor(name="Zepto")
        comp2 = Competitor(name="Zomato")
        db.session.add_all([comp1, comp2])
        db.session.commit()
        
        # Add insights
        db.session.add_all([
            Insight(competitor_id=comp1.id, title="10-min electronics delivery", description="Zepto pushing high-AOV electronics with <10m SLA.", category="feature", urgency=5, action="Check warehouse spacing"),
            Insight(competitor_id=comp2.id, title="Reduced fees", description="Zomato platform fee cuts.", category="pricing", urgency=4, action="Analyze margins")
        ])
        db.session.commit()
        print("Mock data seeded.")
        
        print("\n--- Running AI Copilot Chat Demo ---")
        questions = [
            "What is Zepto doing?",
            "Where is the whitespace?",
            "What should we do this week?"
        ]
        
        for q in questions:
            print(f"\nUser: {q}")
            try:
                ans = process_copilot_chat(q)
                print(f"Copilot:\n{ans}")
            except Exception as e:
                print(f"[ERROR] {e}")
                
        print("\nTest Finished.")

if __name__ == "__main__":
    run_test()
