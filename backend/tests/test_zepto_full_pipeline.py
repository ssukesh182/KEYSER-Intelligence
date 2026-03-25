import requests
import time
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

API_BASE = "http://localhost:5001/api"

def run_zepto_test():
    print("🚀 STARTING ZEPTO E2E PIPELINE TEST")

    # Step 1 — Reset DB
    print("\nStep 1 — Resetting Database")
    try:
        res = requests.post(f"{API_BASE}/demo/reset")
        if res.status_code == 200:
            print("✅ DB Reset — OK")
        else:
            print(f"❌ DB Reset Failed: {res.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # Step 2 — Find Zepto Homepage source
    print("\nStep 2 — Finding Zepto Source")
    from app import create_app
    from extensions import db
    from models import Competitor, Source

    app = create_app()
    with app.app_context():
        zepto = db.session.query(Competitor).filter_by(name="Zepto").first()
        if not zepto:
            print("❌ Zepto not found in DB")
            return
        source = db.session.query(Source).filter_by(competitor_id=zepto.id, label="Homepage").first()
        source_id = source.id
        print(f"✅ Found Zepto Homepage Source (ID: {source_id})")

    # Step 3 — Create a "Price Drop" Snapshot
    print("\nStep 3 — Simulating Price Drop Snapshot")
    price_drop_html = """
    <html>
        <head><title>Zepto - 10 Min Grocery Delivery</title></head>
        <body>
            <header>
                <h1>Zepto Homepage</h1>
                <nav>Offers | Groceries | Electronics</nav>
            </header>
            <main>
                <section id="hero">
                    <h2 style="color: red;">URGENT: Delivery Fee Dropped!</h2>
                    <p>We've slashed our delivery fees across Mumbai and Delhi. All orders above 199 INR now ship for FREE.</p>
                    <p>Old Fee: 25 INR | <b>New Fee: 0 INR</b></p>
                    <button class="cta-primary">Order Now for Free Delivery</button>
                </section>
                <section id="categories">
                    <ul>
                        <li>Milk: 30 INR (was 35)</li>
                        <li>Bread: 40 INR</li>
                    </ul>
                </section>
            </main>
        </body>
    </html>
    """

    with app.app_context():
        from models import Snapshot, Diff
        from services.diff_engine import compute_diff
        from services.classifier import classify_change
        from services.scoring import score_diff_significance

        prev_snap = db.session.query(Snapshot).filter_by(source_id=source_id).order_by(Snapshot.scraped_at.desc()).first()
        old_text = prev_snap.clean_text if prev_snap else ""

        new_text = ("Zepto Homepage. URGENT: Delivery Fee Dropped! "
                    "We've slashed our delivery fees across Mumbai and Delhi. All orders above 199 INR now ship for FREE. "
                    "Old Fee: 25 INR | New Fee: 0 INR. Order Now for Free Delivery. "
                    "Milk: 30 INR (was 35). Bread: 40 INR.")

        new_snap = Snapshot(
            source_id=source_id,
            clean_text=new_text,
            raw_html=price_drop_html,
            meta={"title": "Zepto - Delivery Fee Drop"},
            is_seed=False
        )
        db.session.add(new_snap)
        db.session.flush()

        res_diff = compute_diff(old_text, new_text)
        change_type = classify_change(res_diff["diff_text"])
        sig = score_diff_significance(old_text, new_text, res_diff["added_lines"], res_diff["removed_lines"])

        diff = Diff(
            source_id=source_id,
            old_snapshot_id=prev_snap.id if prev_snap else None,
            new_snapshot_id=new_snap.id,
            change_type=change_type,
            significance=sig,
            diff_text=res_diff["diff_text"],
            added_lines=res_diff["added_lines"],
            removed_lines=res_diff["removed_lines"],
            summary=f"Automated test diff: {change_type} | Delivery Fee Drop"
        )
        db.session.add(diff)
        db.session.commit()

        snapshot_id = new_snap.id
        print(f"✅ Created Price Drop Snapshot (ID: {snapshot_id}) and Diff (ID: {diff.id})")

    # Step 4 — Trigger Intelligence Pipeline
    print("\nStep 4 — Triggering Intelligence Pipeline")
    from workers.intelligence_tasks import generate_insights_for_snapshot_task
    task_result = generate_insights_for_snapshot_task.delay(snapshot_id)
    print(f"✅ Intelligence Task Queued (task_id: {task_result.id})")

    # Step 5 — Wait and Verify (look for insight TIED to our snapshot/diff)
    print("\nStep 5 — Waiting for AI to generate insight... (up to 30s)")
    time.sleep(8)  # give Ollama time to respond

    found_insight = None
    for attempt in range(10):
        res = requests.get(f"{API_BASE}/insights")
        all_insights = res.json().get("data", [])
        # Find the insight linked to our specific diff
        for ins in all_insights:
            sources = ins.get("sources", [])
            for s in sources:
                if s.get("diff_id") == diff.id:
                    found_insight = ins
                    break
            if found_insight:
                break
        if found_insight:
            break
        print(f"  🕒 Polling attempt {attempt+1}/10...")
        time.sleep(3)

    if found_insight:
        print("\n✨ AI INSIGHT GENERATED!")
        print(f"  ID          : {found_insight['id']}")
        print(f"  Title       : {found_insight['title']}")
        print(f"  Description : {found_insight['description']}")
        print(f"  Category    : {found_insight['category']}")
        print(f"  Confidence  : {found_insight['confidence']}")
        print(f"  Action      : {found_insight.get('action', 'N/A')}")
    else:
        print("\n❌ Timeout: Could not find AI insight linked to diff. Check celery_worker.log")
        return

    # Step 6 — Wait for Async Validation to Complete
    print("\nStep 6 — Waiting for 5-Layer Validation... (5s)")
    time.sleep(5)

    print("\nStep 7 — Checking Validation Logs in DB")
    with app.app_context():
        from models.validation_log import ValidationLog
        logs = db.session.query(ValidationLog).filter_by(insight_id=found_insight['id']).order_by(ValidationLog.id).all()
        if logs:
            print(f"\n✅ {len(logs)} VALIDATION LOG(S) FOUND FOR INSIGHT {found_insight['id']}:")
            for log in logs:
                conf_before = log.confidence_before or 0.0
                conf_after = log.confidence_after or 0.0
                print(f"  [{log.validation_stage.upper():15}] status={log.status:8} | conf: {conf_before:.2f} → {conf_after:.2f} | {log.notes}")
        else:
            print("  ⚠️  No validation logs found yet (async task may still be running).")
            # Check global logs
            all_logs = db.session.query(ValidationLog).order_by(ValidationLog.id.desc()).limit(10).all()
            if all_logs:
                print(f"\n  Last 10 validation logs (all insights):")
                for log in all_logs:
                    print(f"  Insight {log.insight_id} | [{log.validation_stage.upper():15}] {log.status} | {log.notes}")
            else:
                print("  ❌ No validation logs in DB at all.")

    print("\n✅ ZEPTO E2E TEST COMPLETE")

if __name__ == "__main__":
    run_zepto_test()
