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
# Note: competitors are dynamically sourced from the authenticated user's profile (no static list)


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


def _get_snapshots_for_competitor(user_id, competitor_name) -> list[str]:
    """Fetch recent snapshots for this user's competitor."""
    from models.snapshot import Snapshot
    from models.source import Source
    from models.competitor import Competitor
    # We need to find the Source for this user/competitor
    # For now, we search all snapshots with this competitor name
    # In a full system, Source would also be user_scoped
    snapshots = (
        db.session.query(Snapshot)
        .join(Source)
        .join(Competitor)
        .filter(Competitor.name == competitor_name)
        .order_by(Snapshot.scraped_at.desc())
        .limit(10)
        .all()
    )
    return [s.clean_text or "" for s in snapshots if s.clean_text]


def _get_hiring_depts_for_competitor(user_id, competitor_name) -> list[str]:
    """Return hiring departments for a specific user's competitor."""
    signals = (
        db.session.query(HiringSignal)
        .filter(HiringSignal.user_id == user_id, HiringSignal.competitor_name == competitor_name)
        .limit(50)
        .all()
    )
    return [s.department or "" for s in signals]


def run_whitespace_radar(user_id, competitors, user_usp="") -> dict:
    """
    Multi-tenant Whitespace Radar:
    - user_id: int
    - competitors: list of str
    - user_usp: str
    """
    all_scores: dict = {}
    reddit_by_competitor: dict = {}
    all_snapshot_texts: list = []

    if not competitors:
        return {"scores": {}, "angles": [], "dimensions": DIMENSIONS}

    # ── Pass 1: gather data ────────────────────────────────────────────────
    competitor_data = {}
    for name in competitors:
        snapshots_text = _get_snapshots_for_competitor(user_id, name)
        hiring_depts   = _get_hiring_depts_for_competitor(user_id, name)
        reddit_posts   = fetch_reddit_mentions(name, subreddit="india+bangalore+delhi+mumbai")

        competitor_data[name] = {
            "snapshots": snapshots_text,
            "hiring":    hiring_depts,
            "reddit":    reddit_posts,
        }
        all_snapshot_texts.extend(snapshots_text[:3])
        reddit_by_competitor[name] = reddit_posts

    # ── Generate taxonomy ──────────────────────────────────────────────────
    sample_text = " ".join(all_snapshot_texts)[:600]
    industry_context = (
        f"Competitors: {', '.join(competitors)}.\n"
        f"User USP: {user_usp}\n"
        f"Context: {sample_text}"
    )
    taxonomy = generate_keyword_taxonomy(industry_context)

    # ── Pass 2: score each ─────────────────────────────────────────────────
    for name, data in competitor_data.items():
        all_scores[name] = score_competitor(
            competitor_name=name,
            snapshots_text=data["snapshots"],
            hiring_departments=data["hiring"],
            reddit_posts=data["reddit"],
            taxonomy=taxonomy,
        )

    # ── Find whitespace angles ─────────────────────────────────────────────
    # Pass user_usp to find_whitespace_angles to prioritize gaps vs THEIR strengths
    angles = find_whitespace_angles(all_scores, reddit_by_competitor, taxonomy=taxonomy)

    # ── Enrich ─────────────────────────────────────────────────────────────
    for angle in angles[:2]:
        market_context = fetch_tavily_validation(angle["title"])
        if market_context:
            angle["market_context"] = market_context[:200]

    return {
        "scores":     all_scores,
        "angles":     angles,
        "dimensions": DIMENSIONS,
    }
