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
from services.pipelines.whitespace_pipeline import run_whitespace_radar

def run_test():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with app.app_context():
        db.create_all()
        print("\n--- Generating Mock Data for Phase 4 Test ---")
        
        comp1 = Competitor(name="Swiggy")
        comp2 = Competitor(name="Zomato")
        db.session.add_all([comp1, comp2])
        db.session.commit()
        
        # Add 'messaging'/'feature'/'offer' insights
        db.session.add_all([
            Insight(competitor_id=comp1.id, title="10 min grocery delivery", description="Core messaging is around speed to door.", category="messaging", urgency=4, action=""),
            Insight(competitor_id=comp2.id, title="Lowest prices guaranteed", description="Focusing strictly on affordability in Tier 1 cities.", category="messaging", urgency=5, action=""),
            Insight(competitor_id=comp1.id, title="Gourmet food expansion", description="Swiggy is targeting high-end gourmet food.", category="feature", urgency=3, action="")
        ])
        db.session.commit()
        
        print("Mock messaging insights created.")
        
        print("\n--- Running Phase 4: Whitespace Radar ---")
        try:
            result = run_whitespace_radar()
            print("\n[SUCCESS] Whitespace Angles Detected:")
            import json
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"\n[ERROR] Pipeline exception: {e}")
            import traceback
            traceback.print_exc()
        finally:
            print("\nTest Finished.")

if __name__ == "__main__":
    run_test()
