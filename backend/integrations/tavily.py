"""
integrations/tavily.py
Fetches web intelligence signals for a competitor using Tavily Search API.
Falls back to seeded data if API key is missing or API call fails.
"""
import requests
import json
import os

SEED_TAVILY = {
    "Zepto": [
        {"title": "Zepto raises $350M, eyes profitability and IPO in 2025",
         "url": "https://example.com/zepto-funding",
         "snippet": "Zepto has raised $350 million in a fresh funding round, valuing the company at $5 billion. The funds will be used to expand its dark store network across tier-2 cities."},
        {"title": "Zepto launches 'Zepto Cafe' — hot food delivery in 10 minutes",
         "url": "https://example.com/zepto-cafe",
         "snippet": "In a bold category expansion, Zepto now delivers hot meals alongside groceries. The Zepto Cafe pilot is live in Bengaluru and Mumbai."},
    ],
    "Blinkit": [
        {"title": "Blinkit expands to electronics and fashion, poses challenge to Amazon",
         "url": "https://example.com/blinkit-expansion",
         "snippet": "Blinkit, backed by Zomato, is rapidly expanding beyond groceries into electronics, clothing, and medicine delivery."},
        {"title": "Zomato reports Blinkit GOV tripled YoY in Q3 FY25",
         "url": "https://example.com/blinkit-growth",
         "snippet": "Blinkit's Gross Order Value has tripled year-over-year, making it Zomato's fastest growing segment."},
    ],
    "Swiggy Instamart": [
        {"title": "Swiggy Instamart cuts delivery time from 30 to 15 minutes across cities",
         "url": "https://example.com/swiggy-speed",
         "snippet": "Swiggy Instamart has halved its promised delivery time to 15 minutes following pressure from Zepto and Blinkit."},
        {"title": "Swiggy One subscription adds Instamart free delivery to existing plan",
         "url": "https://example.com/swiggy-one",
         "snippet": "Swiggy is bundling Instamart free delivery into Swiggy One, its premium subscription service, to drive conversion."},
    ],
}


def fetch_tavily_signals(competitor_name: str, query: str = "") -> list:
    """
    Fetch web intelligence signals for a competitor via Tavily.
    Returns list of {title, url, snippet} dicts.
    Falls back to seed data if API fails.
    """
    from config import TAVILY_API_KEY

    print(f"[TAVILY] Fetching signals for: {competitor_name}")

    if not TAVILY_API_KEY:
        print("[TAVILY] No API key found — using seed fallback")
        return _get_seed_signals(competitor_name)

    search_query = query or f"{competitor_name} pricing expansion India news"
    print(f"[TAVILY] Query: '{search_query}'")

    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query":   search_query,
                "max_results": 5,
                "search_depth": "advanced",
            },
            timeout=10,
        )
        response.raise_for_status()
        data    = response.json()
        results = data.get("results", [])
        signals = [
            {"title": r.get("title"), "url": r.get("url"), "snippet": r.get("content", "")}
            for r in results
        ]
        print(f"[TAVILY] Got {len(signals)} results from API")
        return signals

    except requests.exceptions.Timeout:
        print("[TAVILY] Request timed out — falling back to seed")
        return _get_seed_signals(competitor_name)
    except requests.exceptions.RequestException as e:
        print(f"[TAVILY] Request error: {e} — falling back to seed")
        return _get_seed_signals(competitor_name)
    except Exception as e:
        print(f"[TAVILY] Unexpected error: {e} — falling back to seed")
        return _get_seed_signals(competitor_name)


def _get_seed_signals(competitor_name: str) -> list:
    """Return seeded signals for a competitor."""
    for key in SEED_TAVILY:
        if key.lower() in competitor_name.lower() or competitor_name.lower() in key.lower():
            print(f"[TAVILY] Using {len(SEED_TAVILY[key])} seed signals for '{key}'")
            return SEED_TAVILY[key]
    print(f"[TAVILY] No seed data for '{competitor_name}' — returning empty list")
    return []
