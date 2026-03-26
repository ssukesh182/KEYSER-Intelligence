"""
integrations/tavily.py
Fetches web intelligence signals for a competitor using Tavily Search API.
Returns an empty list if the API key is missing or the call fails — no static seed data.
"""
import requests
import os


def fetch_tavily_signals(competitor_name: str, query: str = None) -> list:
    """
    Fetch web intelligence signals for a competitor via Tavily.
    Returns list of {title, url, snippet} dicts.
    Returns empty list if API unavailable (no static fallback).
    """
    from config import TAVILY_API_KEY

    print(f"[TAVILY] Fetching signals for: {competitor_name}")

    if not TAVILY_API_KEY:
        print("[TAVILY] No API key found — skipping (no static fallback)")
        return []

    search_query = query or f"{competitor_name} strategy expansion news 2025"
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
            {"title": r.get("title"), "url": r.get("url"), "snippet": r.get("content", ""), "content": r.get("content", "")}
            for r in results
        ]
        print(f"[TAVILY] Got {len(signals)} results from API")
        return signals

    except requests.exceptions.Timeout:
        print("[TAVILY] Request timed out — returning empty list")
        return []
    except requests.exceptions.RequestException as e:
        print(f"[TAVILY] Request error: {e} — returning empty list")
        return []
    except Exception as e:
        print(f"[TAVILY] Unexpected error: {e} — returning empty list")
        return []
