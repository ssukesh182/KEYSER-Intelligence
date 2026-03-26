"""
integrations/reddit.py
Fetches Reddit mentions for a competitor using Reddit's public JSON API.
No API key required — uses Reddit's free search endpoint.
Returns empty list on failure — no static seed data.
"""
import requests

USER_AGENT = "KEYSER-Intelligence/1.0 (hackathon research tool)"


def fetch_reddit_mentions(competitor_name: str, subreddit: str = "all") -> list:
    """
    Fetch Reddit mentions for a competitor using the public search JSON API.
    Returns list of {subreddit, title, text, score, url} dicts.
    Returns empty list on failure (no static fallback).
    """
    print(f"[REDDIT] Fetching mentions for: {competitor_name}")

    search_term = competitor_name.lower().strip()
    url = "https://www.reddit.com/search.json"
    params = {
        "q":     search_term,
        "sort":  "relevance",
        "limit": 10,
        "t":     "month",
    }
    headers = {"User-Agent": USER_AGENT}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=8)
        response.raise_for_status()
        data  = response.json()
        posts = data.get("data", {}).get("children", [])

        results = []
        for post in posts:
            p = post.get("data", {})
            results.append({
                "subreddit":   p.get("subreddit", ""),
                "title":       p.get("title", ""),
                "text":        p.get("selftext", "")[:500],
                "score":       p.get("score", 0),
                "url":         f"https://reddit.com{p.get('permalink', '')}",
                "author":      p.get("author", "anonymous"),
                "created_utc": p.get("created_utc"),
            })

        print(f"[REDDIT] Got {len(results)} results from Reddit API")
        return results

    except requests.exceptions.Timeout:
        print("[REDDIT] Request timed out — returning empty list")
        return []
    except requests.exceptions.RequestException as e:
        print(f"[REDDIT] Request error: {e} — returning empty list")
        return []
    except Exception as e:
        print(f"[REDDIT] Unexpected error: {e} — returning empty list")
        return []
