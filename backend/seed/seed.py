"""
seed.py — Loads seeded snapshot history for Zepto, Blinkit, Swiggy Instamart.
Guaranteed to work with no internet. Judges will never see a blank dashboard.
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime, timezone, timedelta


SEED_DIR = os.path.join(os.path.dirname(__file__), "data")


def _load_html(filename: str) -> str:
    path = os.path.join(SEED_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    print(f"[SEED] WARNING: {path} not found, using placeholder")
    return f"<html><body><h1>{filename}</h1><p>Placeholder seed content.</p></body></html>"


def run_seed(session):
    """
    Idempotent seed function — skips if data already exists.
    Creates: 3 competitors, 6 sources, 21 snapshots (3 per source, 7 days),
    15 diffs, 15 insights, 15 insight_sources.
    """
    from models.competitor    import Competitor
    from models.source        import Source
    from models.snapshot      import Snapshot
    from models.diff          import Diff
    from models.insight       import Insight
    from models.insight_source import InsightSource
    from services.parser      import parse_html
    from services.classifier  import classify_change
    from services.scoring     import score_diff_significance, score_insight
    from services.diff_engine import compute_diff

    print("[SEED] Starting seed process")

    # ── Check if already seeded ───────────────────────────────
    if session.query(Competitor).count() > 0:
        print("[SEED] Data already exists — skipping seed")
        return

    # ── Competitor definitions ────────────────────────────────
    competitors_data = [
        {
            "name":        "Zepto",
            "description": "10-minute grocery delivery startup, rapidly expanding dark store network",
            "logo_url":    "https://zepto.com/favicon.ico",
            "sources": [
                {"label": "Homepage",     "url": "https://www.zeptonow.com", "source_type": "website", "files": ["zepto_v1.html", "zepto_v2.html", "zepto_v3.html"]},
                {"label": "Offers Page",  "url": "https://www.zeptonow.com/offers", "source_type": "website", "files": ["zepto_offers_v1.html", "zepto_offers_v2.html", "zepto_offers_v3.html"]},
            ]
        },
        {
            "name":        "Blinkit",
            "description": "Zomato-owned q-commerce platform, expanding beyond groceries",
            "logo_url":    "https://blinkit.com/favicon.ico",
            "sources": [
                {"label": "Homepage",     "url": "https://blinkit.com", "source_type": "website", "files": ["blinkit_v1.html", "blinkit_v2.html", "blinkit_v3.html"]},
                {"label": "Promo Page",   "url": "https://blinkit.com/prm/blinkit-pass", "source_type": "website", "files": ["blinkit_promo_v1.html", "blinkit_promo_v2.html", "blinkit_promo_v3.html"]},
            ]
        },
        {
            "name":        "Swiggy Instamart",
            "description": "Swiggy's q-commerce arm, leveraging existing delivery network",
            "logo_url":    "https://swiggy.com/favicon.ico",
            "sources": [
                {"label": "Homepage",     "url": "https://www.swiggy.com/instamart", "source_type": "website", "files": ["swiggy_v1.html", "swiggy_v2.html", "swiggy_v3.html"]},
                {"label": "Offers Page",  "url": "https://www.swiggy.com/offers", "source_type": "website", "files": ["swiggy_offers_v1.html", "swiggy_offers_v2.html", "swiggy_offers_v3.html"]},
            ]
        },
    ]

    now = datetime.now(timezone.utc)

    for comp_data in competitors_data:
        print(f"[SEED] Seeding competitor: {comp_data['name']}")
        competitor = Competitor(
            name        = comp_data["name"],
            description = comp_data["description"],
            industry    = "q-commerce",
            logo_url    = comp_data["logo_url"],
        )
        session.add(competitor)
        session.flush()

        for src_data in comp_data["sources"]:
            print(f"[SEED]   Source: {src_data['label']} ({src_data['url']})")
            source = Source(
                competitor_id = competitor.id,
                url           = src_data["url"],
                source_type   = src_data["source_type"],
                label         = src_data["label"],
                last_scraped  = now,
            )
            session.add(source)
            session.flush()

            # Seed 3 snapshots (simulating 3 scrapes over past 7 days)
            snapshots = []
            for i, filename in enumerate(src_data["files"]):
                html = _load_html(filename)
                parsed = parse_html(html, url=src_data["url"])
                scraped_at = now - timedelta(days=(len(src_data["files"]) - 1 - i) * 3)

                snap = Snapshot(
                    source_id  = source.id,
                    clean_text = parsed["clean_text"],
                    raw_html   = html[:5000],  # trim raw HTML to save space
                    meta       = parsed["metadata"],
                    scraped_at = scraped_at,
                    is_seed    = True,
                )
                session.add(snap)
                session.flush()
                snapshots.append(snap)
                print(f"[SEED]     Snapshot {i+1}/3 created (id={snap.id})")

            # Create diffs between consecutive snapshots
            for i in range(1, len(snapshots)):
                old, new = snapshots[i - 1], snapshots[i]
                old_text = old.clean_text or ""
                new_text = new.clean_text or ""

                if old_text == new_text:
                    print(f"[SEED]     No change between snapshots {old.id} and {new.id} — injecting small diff")
                    new_text = new_text + f"\n\nSpecial offer this week only."

                result      = compute_diff(old_text, new_text)
                change_type = classify_change(result["diff_text"])
                significance= score_diff_significance(
                    old_text, new_text,
                    result["added_lines"], result["removed_lines"]
                )
                # Ensure significance > 0 for seeded data
                significance = max(significance, 0.15)

                summary = (
                    f"{'Major' if significance >= 0.5 else 'Minor'} {change_type} change: "
                    f"+{result['added_lines']} lines, -{result['removed_lines']} lines "
                    f"({significance:.0%} significance)"
                )

                diff = Diff(
                    source_id       = source.id,
                    old_snapshot_id = old.id,
                    new_snapshot_id = new.id,
                    change_type     = change_type,
                    significance    = significance,
                    diff_text       = result["diff_text"][:3000],
                    added_lines     = result["added_lines"],
                    removed_lines   = result["removed_lines"],
                    summary         = summary,
                    created_at      = new.scraped_at,
                )
                session.add(diff)
                session.flush()
                print(f"[SEED]     Diff created: id={diff.id}, type={change_type}, sig={significance:.2f}")

                # Generate insight for this diff
                scores = score_insight(change_type, frequency=1, significance=significance)
                TEMPLATES = {
                    "pricing":   ("updated pricing signals", "pricing-related content modified", "Compare pricing; test counter-offer"),
                    "offer":     ("launched new promotional offer", "offer/deal content increased", "Monitor offer expiry; consider counter-campaign"),
                    "messaging": ("shifted brand messaging", "key positioning claims changed", "Audit your messaging; find whitespace angles"),
                    "cta":       ("changed call-to-action", "acquisition copy updated", "Test competing CTA variant"),
                    "general":   ("made website content changes", "general content updates detected", "Review source page manually"),
                }
                tmpl = TEMPLATES.get(change_type, TEMPLATES["general"])

                insight = Insight(
                    competitor_id = competitor.id,
                    title         = f"{competitor.name} {tmpl[0]}",
                    description   = (
                        f"{competitor.name} has {tmpl[1]} on {src_data['label']}. "
                        f"Significance score: {significance:.0%}. "
                        f"Detected via automated snapshot comparison."
                    ),
                    category      = change_type,
                    action        = tmpl[2],
                    confidence    = scores["confidence"],
                    novelty       = scores["novelty"],
                    relevance     = scores["relevance"],
                    frequency     = 1,
                    created_at    = new.scraped_at,
                )
                session.add(insight)
                session.flush()

                ins_src = InsightSource(
                    insight_id = insight.id,
                    diff_id    = diff.id,
                    reasoning  = (
                        f"Diff {diff.id} on {src_data['label']} detected a '{change_type}' change "
                        f"with {significance:.0%} significance. Rule-based template applied."
                    ),
                )
                session.add(ins_src)
                print(f"[SEED]     Insight created: id={insight.id}")

    session.commit()
    print("[SEED] ✅ Seed complete — 3 competitors, 6 sources, 18 snapshots, 12 diffs, 12 insights")


if __name__ == "__main__":
    # Run standalone: python seed/seed.py
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

    from app import create_app
    from extensions import db as _db

    app = create_app()
    with app.app_context():
        print("[SEED] Running standalone seed")
        run_seed(_db.session)
