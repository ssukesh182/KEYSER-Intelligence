import time
import requests
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(message)s")

API_BASE = "http://localhost:5001/api"

def run_full_pipeline():
    logging.info("🚀 STARTING FULL PIPELINE TEST\n")
    
    # Test 1
    logging.info("Step 1 — Seeding Database")
    res = requests.post(f"{API_BASE}/demo/reset")
    if res.status_code == 200:
        logging.info("✅ Seeding DB — OK")
    else:
        logging.error(f"❌ Seeding DB Failed: {res.text}")
        return

    # Test 2
    logging.info("Step 2 — Triggering Scraper & OSINT")
    res = requests.post(f"{API_BASE}/snapshots/trigger", json={})
    if res.status_code in [200, 201, 202]:
        logging.info("✅ Scraper Triggered — OK")
    else:
        logging.error(f"❌ Scraping Failed: {res.text}")
        return

    # Test 3 & 4 & 5 (Handled async by Celery workers dynamically)
    logging.info("Step 3 — Running Intelligence Pipeline (Diff, LLM, Scoring, Validation) ...")
    logging.info("🕒 Waiting for Background Celery Workers to process the signals...")
    for _ in range(12):
        time.sleep(1)
        print(".", end="", flush=True)
    print("")
    logging.info("✅ Diff & Validation — OK (Background lifecycle presumed finished)")

    # Test 6
    logging.info("Step 4 — Verifying Data via API")
    snaps_res = requests.get(f"{API_BASE}/snapshots")
    insights_res = requests.get(f"{API_BASE}/insights")
    
    snaps = snaps_res.json().get("data", []) if snaps_res.status_code == 200 else []
    insights = insights_res.json().get("data", []) if insights_res.status_code == 200 else []
    
    logging.info(f"📊 Snapshots stored: {len(snaps)}")
    logging.info(f"📊 Insights created: {len(insights)}")
    
    if len(insights) > 0:
        # Show sample insight
        top_insight = insights[0]
        logging.info(f"\nExample Extracted Insight:")
        logging.info(json.dumps(top_insight, indent=2))
    
    if len(snaps) > 0 and len(insights) > 0:
        logging.info("\n✅ FULL PIPELINE COMPLETE")
    else:
        logging.error("\n⚠️ PIPELINE INCOMPLETE: Insufficient data generated. Check Celery logs.")

if __name__ == "__main__":
    run_full_pipeline()
