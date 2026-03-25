"""
integrations/reddit.py
Fetches Reddit mentions for a competitor using Reddit's public JSON API.
No API key required — uses Reddit's free search endpoint.
Falls back to seed data if scraping is blocked or fails.
"""
import requests

USER_AGENT = "KEYSER-Intelligence/1.0 (hackathon research tool)"

SEED_REDDIT = {
    "Zepto": [
        {"subreddit": "bangalore", "title": "Zepto delivered in 8 min today, faster than expected",
         "text": "Ordered veggies on a whim, guys actually showed up in 8 min. Impressive.",
         "score": 234, "url": "https://reddit.com/r/bangalore/example1"},
        {"subreddit": "india", "title": "Zepto pricing — are they cheaper than Blinkit?",
         "text": "Did a side-by-side price comparison. Zepto was 8% cheaper on most items but delivery is free only on Zepto Pass.",
         "score": 187, "url": "https://reddit.com/r/india/example2"},
        {"subreddit": "startupindia", "title": "Zepto's dark store model explained — how do they profit?",
         "text": "Zepto runs micro-warehouses (dark stores) in residential areas 3-4 km from customers. Each store handles ~200 orders/day.",
         "score": 412, "url": "https://reddit.com/r/startupindia/example3"},
    ],
    "Blinkit": [
        {"subreddit": "delhi", "title": "Blinkit now delivers medicine in 10 minutes — huge",
         "text": "Just got blood pressure meds on Blinkit before I could even find my socks. Delhi infrastructure is finally good for something.",
         "score": 891, "url": "https://reddit.com/r/delhi/example4"},
        {"subreddit": "india", "title": "Blinkit Pass vs Zepto Pass — which is better value?",
         "text": "Blinkit Pass at ₹49 beats Zepto Pass at ₹99 on price but Zepto has more products in my area.",
         "score": 302, "url": "https://reddit.com/r/india/example5"},
    ],
    "Swiggy Instamart": [
        {"subreddit": "mumbai", "title": "Swiggy Instamart now doing 15 min delivery in Bandra",
         "text": "Was skeptical but tried it yesterday. Got atta and eggs in 14 minutes. Swiggy caught up quickly.",
         "score": 156, "url": "https://reddit.com/r/mumbai/example6"},
        {"subreddit": "india", "title": "Swiggy One is now actually worth it — groceries + food in one sub",
         "text": "After they added Instamart benefits to Swiggy One, I finally subscribed. The value is real.",
         "score": 278, "url": "https://reddit.com/r/india/example7"},
    ],
}


def fetch_reddit_mentions(competitor_name: str, subreddit: str = "all") -> list:
    """
    Fetch Reddit mentions for a competitor using the public search JSON API.
    Returns list of {subreddit, title, text, score, url} dicts.
    Falls back to seed data if the request fails or is blocked.
    """
    print(f"[REDDIT] Fetching mentions for: {competitor_name}")

    search_term = competitor_name.lower().replace(" instamart", "").strip()
    url = f"https://www.reddit.com/search.json"
    params = {
        "q":       search_term,
        "sort":    "relevance",
        "limit":   10,
        "t":       "month",
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
                "subreddit": p.get("subreddit", ""),
                "title":     p.get("title", ""),
                "text":      p.get("selftext", "")[:500],
                "score":     p.get("score", 0),
                "url":       f"https://reddit.com{p.get('permalink', '')}",
            })

        print(f"[REDDIT] Got {len(results)} results from Reddit API")
        return results if results else _get_seed_mentions(competitor_name)

    except requests.exceptions.Timeout:
        print("[REDDIT] Request timed out — using seed")
        return _get_seed_mentions(competitor_name)
    except requests.exceptions.RequestException as e:
        print(f"[REDDIT] Request error: {e} — using seed")
        return _get_seed_mentions(competitor_name)
    except Exception as e:
        print(f"[REDDIT] Unexpected error: {e} — using seed")
        return _get_seed_mentions(competitor_name)


def _get_seed_mentions(competitor_name: str) -> list:
    """Return seeded Reddit mentions for a competitor."""
    for key in SEED_REDDIT:
        if key.lower() in competitor_name.lower() or competitor_name.lower() in key.lower():
            print(f"[REDDIT] Using {len(SEED_REDDIT[key])} seed mentions for '{key}'")
            return SEED_REDDIT[key]
    print(f"[REDDIT] No seed data for '{competitor_name}'")
    return []
