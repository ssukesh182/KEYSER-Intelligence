"""
parser.py — BS4 HTML cleaner
Converts raw HTML → clean readable text + metadata dict
"""
from bs4 import BeautifulSoup
import re


def parse_html(html: str, url: str = "") -> dict:
    """
    Parse raw HTML and return:
    {
        clean_text: str,
        metadata: {title, h1, h2_list, word_count, has_price, url}
    }
    """
    print(f"[PARSER] Parsing HTML ({len(html)} bytes) from {url}")

    try:
        soup = BeautifulSoup(html, "lxml")

        # ── Remove noise ──────────────────────────────────────
        for tag in soup(["script", "style", "noscript", "header",
                          "footer", "nav", "aside", "iframe", "svg"]):
            tag.decompose()

        # ── Extract structured metadata ───────────────────────
        title    = soup.title.get_text(strip=True) if soup.title else ""
        h1_tags  = soup.find_all("h1")
        h1       = h1_tags[0].get_text(strip=True) if h1_tags else ""
        h2_list  = [h.get_text(strip=True) for h in soup.find_all("h2")][:10]

        # ── Extract clean text ────────────────────────────────
        clean_text = soup.get_text(separator="\n", strip=True)
        # Collapse excessive blank lines
        clean_text = re.sub(r"\n{3,}", "\n\n", clean_text)
        clean_text = clean_text.strip()

        word_count = len(clean_text.split())

        # ── Price signal detection ────────────────────────────
        price_patterns = [r"₹\s*\d+", r"\d+\s*(?:per|/)\s*month",
                          r"free\s+(?:trial|plan)", r"starting\s+at"]
        has_price = any(re.search(p, clean_text, re.IGNORECASE) for p in price_patterns)

        metadata = {
            "url":        url,
            "title":      title,
            "h1":         h1,
            "h2_list":    h2_list,
            "word_count": word_count,
            "has_price":  has_price,
        }

        print(f"[PARSER] Done — words: {word_count}, title: '{title[:60]}', has_price: {has_price}")
        return {"clean_text": clean_text, "metadata": metadata}

    except Exception as e:
        print(f"[PARSER] ERROR: {e}")
        return {"clean_text": "", "metadata": {"url": url, "error": str(e)}}
