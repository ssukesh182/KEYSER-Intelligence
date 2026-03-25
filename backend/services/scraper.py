"""
scraper.py — Playwright-based scraper with BS4 parsing
Falls back to seeded HTML if live scrape fails.
"""
import os
from datetime import datetime, timezone

from services.parser import parse_html


SEED_DIR = os.path.join(os.path.dirname(__file__), "..", "seed", "data")


def _load_seed_html(competitor_name: str) -> str:
    """Load pre-baked seed HTML for a competitor — used when live scrape fails."""
    name_slug = competitor_name.lower().replace(" ", "_").replace("-", "_")
    # Try exact match then fuzzy
    candidates = [
        os.path.join(SEED_DIR, f"{name_slug}.html"),
        os.path.join(SEED_DIR, "zepto.html")     # last-resort fallback
    ]
    for path in candidates:
        if os.path.exists(path):
            print(f"[SCRAPER] Loading seed HTML from {path}")
            with open(path, "r", encoding="utf-8") as f:
                return f.read()
    print(f"[SCRAPER] WARNING: No seed HTML found for '{competitor_name}'")
    return "<html><body><p>Seed data unavailable.</p></body></html>"


def scrape_url(url: str, competitor_name: str = "unknown") -> dict:
    """
    Scrapes a URL with Playwright.
    Returns {clean_text, raw_html, metadata} or falls back to seed data.
    """
    print(f"[SCRAPER] Starting scrape: {url}")
    raw_html = None

    try:
        from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

        with sync_playwright() as p:
            print(f"[SCRAPER] Launching browser")
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0.0.0 Safari/537.36"
                )
            )
            page = context.new_page()

            try:
                print(f"[SCRAPER] Navigating to {url}")
                page.goto(url, timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)   # let JS settle
                raw_html = page.content()
                print(f"[SCRAPER] Got HTML: {len(raw_html)} bytes")
            except PlaywrightTimeout:
                print(f"[SCRAPER] TIMEOUT on {url} — falling back to seed")
            except Exception as e:
                print(f"[SCRAPER] Page load error on {url}: {e} — falling back to seed")
            finally:
                browser.close()

    except ImportError:
        print("[SCRAPER] Playwright not installed — falling back to seed")
    except Exception as e:
        print(f"[SCRAPER] Browser launch error: {e} — falling back to seed")

    # ── Fallback to seed if scrape failed ────────────────────
    if not raw_html:
        print(f"[SCRAPER] Using seed HTML for '{competitor_name}'")
        raw_html = _load_seed_html(competitor_name)

    parsed  = parse_html(raw_html, url=url)
    result  = {
        "raw_html":   raw_html,
        "clean_text": parsed["clean_text"],
        "metadata":   parsed["metadata"],
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }
    print(f"[SCRAPER] Scrape complete: {len(result['clean_text'])} chars clean text")
    return result


def scrape_and_store(source, db_session) -> "Snapshot | None":
    """
    Full pipeline: scrape a Source → create + save a Snapshot + run diff.
    Returns the new Snapshot or None on failure.
    """
    from models.snapshot import Snapshot
    from models.source   import Source
    from services.diff_engine import process_diff

    print(f"[SCRAPER] scrape_and_store called for source_id={source.id}, url={source.url}")

    try:
        data = scrape_url(source.url, competitor_name=source.competitor.name
                          if source.competitor else "unknown")

        snapshot = Snapshot(
            source_id  = source.id,
            clean_text = data["clean_text"],
            raw_html   = data["raw_html"],
            meta       = data["metadata"],
            is_seed    = False,
        )
        db_session.add(snapshot)
        db_session.commit()
        db_session.refresh(snapshot)
        print(f"[SCRAPER] Snapshot saved: id={snapshot.id}")

        # ── Update source.last_scraped ────────────────────────
        source.last_scraped = datetime.now(timezone.utc)
        db_session.commit()

        # ── Run diff against previous snapshot ────────────────
        prev = (
            db_session.query(Snapshot)
            .filter(
                Snapshot.source_id == source.id,
                Snapshot.id != snapshot.id
            )
            .order_by(Snapshot.scraped_at.desc())
            .first()
        )

        if prev:
            print(f"[SCRAPER] Running diff: {prev.id} → {snapshot.id}")
            diff = process_diff(prev, snapshot, db_session)
            if diff:
                print(f"[SCRAPER] Diff created: id={diff.id}")
            else:
                print(f"[SCRAPER] No changes detected")
        else:
            print(f"[SCRAPER] No previous snapshot — skipping diff")

        return snapshot

    except Exception as e:
        db_session.rollback()
        print(f"[SCRAPER] ERROR in scrape_and_store: {e}")
        return None
