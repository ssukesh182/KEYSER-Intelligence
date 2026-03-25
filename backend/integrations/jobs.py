"""
integrations/jobs.py — Hiring signal fetchers.

Three data sources:
  1. Apollo.io  (/v1/organizations/search) — company hiring estimates
  2. Apify      (LinkedIn Jobs Actor)       — open role listings
  3. ArbeitNow  (/api/job-board-api)        — no-key global ATS feed

Each fetcher returns a list of dicts:
  { role_title, department, location, job_url, posted_at, source }
"""
import os
import logging
import requests
from datetime import datetime, timezone, timedelta
from typing import Optional

logger = logging.getLogger(__name__)

APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "")
APIFY_API_KEY  = os.getenv("APIFY_API_KEY", "")

# Department keyword → canonical label
DEPT_KEYWORDS = {
    "engineer": "Engineering", "developer": "Engineering", "sde": "Engineering",
    "data": "Engineering",     "ml": "Engineering",       "devops": "Engineering",
    "product": "Product",      "pm": "Product",           "program": "Product",
    "design": "Design",        "ux": "Design",            "ui": "Design",
    "ops": "Operations",       "operation": "Operations", "supply": "Operations",
    "dark store": "Operations","warehouse": "Operations", "delivery": "Operations",
    "marketing": "Marketing",  "growth": "Marketing",     "brand": "Marketing",
    "sales": "Sales",          "account": "Sales",        "business development": "Sales",
    "finance": "Finance",      "analytics": "Finance",    "hr": "People",
    "recruit": "People",       "talent": "People",        "legal": "Legal",
}


def _infer_department(role_title: str) -> str:
    """Heuristically map a job title to a canonical department."""
    lower = role_title.lower()
    for kw, dept in DEPT_KEYWORDS.items():
        if kw in lower:
            return dept
    return "Strategy"


def _parse_iso(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.rstrip("Z")).replace(tzinfo=timezone.utc)
    except Exception:
        return None


# ── Apollo.io ─────────────────────────────────────────────────────────────────
def fetch_apollo_signals(competitor_name: str) -> list[dict]:
    """
    Calls Apollo /v1/organizations/search to get hiring estimates.
    Returns synthetic role signals derived from org headcount data.
    NOTE: Apollo doesn't expose individual job postings — we derive
    high-level signals from department headcount growth data.
    """
    if not APOLLO_API_KEY:
        logger.warning("[Apollo] No APOLLO_API_KEY set — skipping")
        return []
    try:
        resp = requests.post(
            "https://api.apollo.io/v1/organizations/search",
            params={"api_key": APOLLO_API_KEY}, # Try query param auth too
            headers={
                "Content-Type": "application/json",
                "x-api-key": APOLLO_API_KEY,
                "Cache-Control": "no-cache"
            },
            json={
                "q_organization_name": competitor_name,
                "page": 1,
                "per_page": 1,
            },
            timeout=10,
        )
        resp.raise_for_status()
        orgs = resp.json().get("organizations", [])
        if not orgs:
            return []

        org = orgs[0]
        signals = []
        # Apollo gives department_headcount hints — synthesise role signals
        for dept in org.get("departments", []):
            signals.append({
                "role_title":  f"[Apollo Signal] Expanding {dept.get('name', 'Unknown')} team",
                "department":  dept.get("name", "Unknown"),
                "location":    org.get("city", "India"),
                "job_url":     org.get("website_url") or "",
                "posted_at":   datetime.now(timezone.utc) - timedelta(days=1),
                "source":      "apollo",
            })
        logger.info(f"[Apollo] {len(signals)} signals for {competitor_name}")
        return signals
    except Exception as e:
        logger.error(f"[Apollo] Error: {e}")
        return []


# ── Apify LinkedIn Jobs ────────────────────────────────────────────────────────
def fetch_linkedin_signals(competitor_name: str) -> list[dict]:
    """
    Calls Apify's LinkedIn Jobs Scraper actor synchronously.
    Using the run-sync-get-dataset-items endpoint for immediate results.
    """
    if not APIFY_API_KEY:
        logger.warning("[Apify] No APIFY_API_KEY set — skipping")
        return []
    try:
        # Start synchronous run — returns data items directly
        resp = requests.post(
            "https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/run-sync-get-dataset-items",
            params={"token": APIFY_API_KEY},
            json={
                "urls": [
                    f"https://www.linkedin.com/jobs/search/?keywords={competitor_name}"
                ],
                "maxItems": 10
            },
            timeout=60, # Sync runs can take longer
        )
        resp.raise_for_status()
        jobs = resp.json()

        signals = []
        for job in jobs:
            title = job.get("title") or job.get("positionName", "")
            if not title: continue
            
            signals.append({
                "role_title":  title,
                "department":  _infer_department(title),
                "location":    job.get("location", "India"),
                "job_url":     job.get("url") or job.get("jobUrl", ""),
                "posted_at":   _parse_iso(job.get("postedAt")) or datetime.now(timezone.utc),
                "source":      "linkedin",
            })
        logger.info(f"[Apify/LinkedIn] {len(signals)} jobs for {competitor_name}")
        return signals
    except Exception as e:
        logger.error(f"[Apify/LinkedIn] Error: {e}")
        return []


# ── ArbeitNow (no key required) ───────────────────────────────────────────────
def fetch_arbeitnow_signals(competitor_name: str) -> list[dict]:
    """
    Calls the free ArbeitNow job-board API — no API key required.
    Filters returned jobs by competitor name in title/description.
    """
    try:
        resp = requests.get(
            "https://www.arbeitnow.com/api/job-board-api",
            params={"q": competitor_name, "location": "india"},
            timeout=10,
        )
        resp.raise_for_status()
        jobs = resp.json().get("data", [])

        comp_lower = competitor_name.lower()
        signals = []
        for job in jobs:
            title = job.get("title", "")
            # Only include if the company name appears somewhere relevant
            company = (job.get("company_name") or "").lower()
            if comp_lower not in company and comp_lower not in title.lower():
                continue
            signals.append({
                "role_title":  title,
                "department":  _infer_department(title),
                "location":    job.get("location", "Remote"),
                "job_url":     job.get("url", ""),
                "posted_at":   _parse_iso(job.get("created_at")) or datetime.now(timezone.utc),
                "source":      "arbeitnow",
            })
        logger.info(f"[ArbeitNow] {len(signals)} jobs for {competitor_name}")
        return signals
    except Exception as e:
        logger.error(f"[ArbeitNow] Error: {e}")
        return []
