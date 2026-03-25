import logging
from pprint import pprint

# Configure logging to see the pipeline's printouts
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s %(message)s")

# Mock the database session for the test
class MockQuery:
    def __init__(self, *args, **kwargs): pass
    def filter(self, *args, **kwargs): return self
    def filter_by(self, *args, **kwargs): return self
    def join(self, *args, **kwargs): return self
    def all(self): return []
    def count(self): return 0
    def first(self): return None

class MockSession:
    def add(self, *args): pass
    def commit(self): pass
    def rollback(self): pass
    def query(self, *args): return MockQuery()
    def get(self, *args): return None

mock_db = MockSession()

def run_test():
    from services.validation import run_validation_pipeline

    print("\n" + "="*60)
    print("🚀 TESTING 5-LAYER VALIDATION PIPELINE")
    print("="*60 + "\n")

    raw_llm_output = {
        "claim": "Zepto cut essentials prices by 20% today",
        "category": "pricing",
        "subcategory": "discount",
        "competitor": "Zepto",
        "confidence": 0.85,
        "supporting_text": "We noticed Zepto cut essentials prices by 20% today across Mumbai.",
        "source_url": "https://zepto.com/mumbai",
    }
    
    source_type = "google_ads"  # high base confidence
    old_text = "Zepto offers standard pricing."
    new_text = " Zepto cut essentials prices by 20% today across Mumbai."
    insight_id = 999 

    result = run_validation_pipeline(
        raw_llm_output=raw_llm_output,
        source_type=source_type,
        old_text=old_text,
        new_text=new_text,
        insight_id=insight_id,
        db_session=mock_db
    )

    print("\n" + "="*60)
    print("✅ FINAL PIPELINE RESULT:")
    print("="*60)
    pprint(result, sort_dicts=False)
    print("="*60 + "\n")

if __name__ == "__main__":
    run_test()
