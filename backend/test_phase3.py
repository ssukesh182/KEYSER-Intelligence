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
from services.pipelines.brief_pipeline import create_monday_morning_brief

def run_test():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with app.app_context():
        db.create_all()
        print("\n--- Generating Mock Data for Phase 3 Test ---")
        
        comp1 = Competitor(name="Swiggy")
        comp2 = Competitor(name="Zomato")
        db.session.add_all([comp1, comp2])
        db.session.commit()
        
        # Add 5 insights
        db.session.add_all([
            Insight(competitor_id=comp1.id, title="Swiggy Instamart adds 24/7 delivery", description="Round-the-clock deliveries in key metros via Instamart.", category="feature", urgency=5, action="Match offering"),
            Insight(competitor_id=comp2.id, title="Zomato slashes platform fee", description="Reduced platform fees from Re 3 to Re 1 per order.", category="pricing", urgency=5, action="Assess margin impact"),
            Insight(competitor_id=comp1.id, title="Swiggy pushes 'Health' category", description="Highlighting Guilt-free and healthy options.", category="messaging", urgency=4, action="Monitor new SKUs"),
            Insight(competitor_id=comp2.id, title="Blinkit partners with Sony", description="PS5 controllers available in 10 minutes.", category="offer", urgency=3, action="Explore electronics"),
            Insight(competitor_id=comp1.id, title="Swiggy expands to Tier 3 cities", description="Launched operations in 12 new cities.", category="trend", urgency=2, action="Review geographical strategy")
        ])
        db.session.commit()
        
        print("Mock insights created.")
        
        print("\n--- Running Phase 3: Monday Morning Brief ---")
        try:
            result = create_monday_morning_brief()
            if result.get("error"):
                print(f"[FAILED] {result['error']}")
                return

            print("\n[SUCCESS] Brief Generated!")
            print("\nMARKDOWN OUTPUT:")
            print("==================================")
            print(result.get("markdown"))
            print("==================================")
            print(f"PDF exported to path: {result.get('pdf_path')}")
        except Exception as e:
            print(f"\n[ERROR] Pipeline exception: {e}")
            import traceback
            traceback.print_exc()
        finally:
            print("\nTest Finished.")

if __name__ == "__main__":
    run_test()
