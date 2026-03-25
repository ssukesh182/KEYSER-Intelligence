"""
services/pipelines/whitespace_pipeline.py

Multi-source Whitespace Radar pipeline:
  1. Pull competitor data (snapshots, hiring signals, Reddit)
  2. Score each competitor on 6 dimensions
  3. Identify whitespace angles (low competitor score + high customer demand)
  4. Optionally enrich with Tavily market-level validation
"""
import logging
import requests
from config import TAVILY_API_KEY
from extensions import db
from models.competitor import Competitor
from models.snapshot import Snapshot
from models.source import Source
from models.hiring_signal import HiringSignal
from integrations.reddit import fetch_reddit_mentions
from services.intelligence.scoring_engine import (
    score_competitor, find_whitespace_angles, generate_keyword_taxonomy
)

logger = logging.getLogger(__name__)

# ── Dimension names shown in the UI ────────────────────────────────────────
DIMENSIONS = ["speed", "range", "price", "experience", "support", "sustainability"]

# ── Competitors to analyse ─────────────────────────────────────────────────
TRACKED_COMPETITORS = ["Zepto", "Swiggy", "Blinkit"]


def fetch_tavily_validation(angle_title: str) -> str:
    """Use Tavily to see if the market actually has demand for this angle."""
    if not TAVILY_API_KEY:
        return ""
    try:
        resp = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": f"Indian market demand for {angle_title} quick commerce 2025",
                "search_depth": "basic",
                "include_answer": True,
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("answer", "")
    except Exception as e:
        logger.warning(f"[Whitespace] Tavily error: {e}")
        return ""


def _get_snapshots_for_competitor(competitor: Competitor) -> list[str]:
    """Fetch recent snapshot text for a competitor via Source → Snapshot join."""
    source_ids = [s.id for s in competitor.sources]
    if not source_ids:
        return []
    snapshots = (
        db.session.query(Snapshot)
        .filter(Snapshot.source_id.in_(source_ids))
        .order_by(Snapshot.scraped_at.desc())
        .limit(10)
        .all()
    )
    return [s.clean_text or "" for s in snapshots if s.clean_text]


def _get_hiring_depts_for_competitor(competitor_id: int) -> list[str]:
    """Return hiring departments from HiringSignal table for a specific competitor ID."""
    if not competitor_id:
        return []
    signals = (
        db.session.query(HiringSignal)
        .filter(HiringSignal.competitor_id == competitor_id)
        .limit(50)
        .all()
    )
    return [s.department or "" for s in signals]


def run_whitespace_radar() -> dict:
    """
    Returns:
        {
          "scores": {
            "Zepto": { "speed": 72, "range": 45, ... },
            ...
          },
          "angles": [
            { "title": "...", "description": "...", "opportunity_score": 88, "impact": 4, "tag": "..." },
            ...
          ],
          "dimensions": ["speed", "range", ...]
        }
    """
    all_scores: dict = {}
    reddit_by_competitor: dict = {}
    all_snapshot_texts: list = []

    # ── Pass 1: gather data ────────────────────────────────────────────────
    competitor_data = {}
    for name in TRACKED_COMPETITORS:
        competitor = db.session.query(Competitor).filter_by(name=name).first()
        snapshots_text = _get_snapshots_for_competitor(competitor) if competitor else []
        hiring_depts   = _get_hiring_depts_for_competitor(competitor.id if competitor else None)
        reddit_posts   = fetch_reddit_mentions(name, subreddit="india+bangalore+delhi+mumbai")

        competitor_data[name] = {
            "snapshots": snapshots_text,
            "hiring":    hiring_depts,
            "reddit":    reddit_posts,
        }
        all_snapshot_texts.extend(snapshots_text[:3])   # sample for context
        reddit_by_competitor[name] = reddit_posts

    # ── Generate dynamic keyword taxonomy from real industry snapshot text ──
    # Build industry context: 600 chars of snapshot content + competitor names
    sample_text = " ".join(all_snapshot_texts)[:600]
    industry_context = (
        f"Competitors being tracked: {', '.join(TRACKED_COMPETITORS)}.\n"
        f"Sample content from their websites:\n{sample_text}"
    )
    taxonomy = generate_keyword_taxonomy(industry_context)
    logger.info(f"[Whitespace] Taxonomy generated for dimensions: {list(taxonomy.keys())}")

    # ── Pass 2: score each competitor with shared taxonomy ─────────────────
    for name, data in competitor_data.items():
        all_scores[name] = score_competitor(
            competitor_name=name,
            snapshots_text=data["snapshots"],
            hiring_departments=data["hiring"],
            reddit_posts=data["reddit"],
            taxonomy=taxonomy,
        )
        logger.info(f"[Whitespace] Scored {name}: {all_scores[name]}")

    # ── Find whitespace angles ─────────────────────────────────────────────
    angles = find_whitespace_angles(all_scores, reddit_by_competitor, taxonomy=taxonomy)

    # ── Enrich top 2 angles with Tavily market signal ─────────────────────
    for angle in angles[:2]:
        market_context = fetch_tavily_validation(angle["title"])
        if market_context:
            angle["market_context"] = market_context[:200]

    return {
        "scores":     all_scores,
        "angles":     angles,
        "dimensions": DIMENSIONS,
    }
