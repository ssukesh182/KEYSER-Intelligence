import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

import config
config.DATABASE_URL = "sqlite:///:memory:"

# Patch sqlite to support JSONB fields meant for postgres
from sqlalchemy.dialects import sqlite
sqlite.base.SQLiteTypeCompiler.visit_JSONB = sqlite.base.SQLiteTypeCompiler.visit_JSON

from app import create_app
from extensions import db
from models.competitor import Competitor
from models.source import Source
from models.snapshot import Snapshot
from models.diff import Diff
from models.insight import Insight
from models.insight_source import InsightSource
from services.pipelines.insight_pipeline import process_snapshot_for_insights

def run_test():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    
    with app.app_context():
        # Using an in-memory database to avoid touching the production/postgres DB
        db.create_all()
        
        print("\n--- Generating Mock Data for Phase 2 Test ---")
        insight_id = None
        
        # 1. Create a Competitor
        comp = Competitor(name="TestCompetitor_Phase2")
        db.session.add(comp)
        db.session.commit()
        
        # 2. Create a Source
        source = Source(competitor_id=comp.id, url="https://testcomp.com/pricing", source_type="pricing", label="Mock Pricing")
        db.session.add(source)
        db.session.commit()
        
        # 3. Create Snapshots
        old_snap = Snapshot(source_id=source.id, clean_text="Basic: $10/mo", is_seed=True)
        new_snap = Snapshot(source_id=source.id, clean_text="Basic: $15/mo", is_seed=False)
        db.session.add_all([old_snap, new_snap])
        db.session.commit()
        
        # 4. Create a Diff
        diff = Diff(
            source_id=source.id,
            old_snapshot_id=old_snap.id,
            new_snapshot_id=new_snap.id,
            change_type="pricing",
            significance=0.8,
            summary="Price increased from $10 to $15",
            diff_text="- Basic: $10/mo\n+ Basic: $15/mo"
        )
        db.session.add(diff)
        db.session.commit()
        
        print(f"Created Mock Snapshot ID: {new_snap.id}")
        
        # 5. Run the insight pipeline
        print("\n--- Running Phase 2 Insight Pipeline ---")
        try:
            insight_id = process_snapshot_for_insights(new_snap.id)
            if insight_id:
                insight = db.session.query(Insight).get(insight_id)
                print("\n[SUCCESS] Insight Generated!")
                print("Title:", insight.title)
                print("Description:", insight.description)
                print("Category:", insight.category)
                print("Confidence:", insight.confidence)
                print("Urgency:", insight.urgency)
                
                # Check insight sources
                isources = db.session.query(InsightSource).filter_by(insight_id=insight_id).all()
                print(f"Number of Linked Sources: {len(isources)}")
            else:
                print("\n[FAILED] Insight Pipeline returned None.")
        except Exception as e:
            print(f"\n[ERROR] Pipeline exception: {e}")
            import traceback
            traceback.print_exc()
        finally:
            print("\nTest Finished.")

if __name__ == "__main__":
    run_test()
