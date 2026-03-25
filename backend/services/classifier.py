"""
classifier.py — Change type detection
Reads diff text and labels it: pricing / messaging / offer / cta / general
"""
import re


# ─── Keyword dictionaries per category ───────────────────────────────────────
KEYWORD_MAP = {
    "pricing": [
        r"₹\s*\d+", r"price", r"pricing", r"plan", r"subscription",
        r"per month", r"free trial", r"discount", r"offer", r"\d+%\s*off",
        r"starting at", r"fee", r"charge", r"cost",
    ],
    "messaging": [
        r"fastest", r"10[- ]minute", r"guaranteed", r"promise",
        r"trusted", r"reliable", r"fresh", r"certified", r"quality",
        r"brand new", r"India's", r"top rated",
    ],
    "offer": [
        r"free delivery", r"cashback", r"promo", r"coupon",
        r"limited time", r"exclusive", r"deal", r"save up to",
        r"flat \d+% off", r"no minimum",
    ],
    "cta": [
        r"download app", r"sign up", r"get started", r"order now",
        r"shop now", r"try free", r"claim", r"install",
    ],
}


def classify_change(diff_text: str) -> str:
    """
    Returns the most likely change type for a given diff string.
    Scans only the '+' (added) lines in the diff.
    """
    print(f"[CLASSIFIER] Classifying diff ({len(diff_text)} chars)")

    if not diff_text:
        print("[CLASSIFIER] Empty diff — returning 'general'")
        return "general"

    # Only look at added lines
    added_lines = " ".join(
        line[1:] for line in diff_text.splitlines() if line.startswith("+")
    ).lower()

    scores = {category: 0 for category in KEYWORD_MAP}

    for category, patterns in KEYWORD_MAP.items():
        for pattern in patterns:
            if re.search(pattern, added_lines, re.IGNORECASE):
                scores[category] += 1

    best = max(scores, key=scores.get)
    best_score = scores[best]

    result = best if best_score > 0 else "general"
    print(f"[CLASSIFIER] Scores: {scores} → result: '{result}'")
    return result
