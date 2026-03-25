import os
from dotenv import load_dotenv

load_dotenv()

# ─── Database ───────────────────────────────────────────────
DB_USER     = os.getenv("DB_USER", "hk")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "5432")
DB_NAME     = os.getenv("DB_NAME", "keyser")

# Build connection string — no password if empty
if DB_PASSWORD:
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    DATABASE_URL = f"postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ─── Flask ───────────────────────────────────────────────────
FLASK_PORT  = int(os.getenv("FLASK_PORT", 5001))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"

# ─── Scraper ─────────────────────────────────────────────────
SCRAPE_INTERVAL_MINUTES = int(os.getenv("SCRAPE_INTERVAL_MINUTES", 30))
SCRAPER_TIMEOUT_MS      = int(os.getenv("SCRAPER_TIMEOUT_MS", 30000))

# ─── External APIs (Phase 2) ─────────────────────────────────
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

print(f"[CONFIG] Loaded — DB: {DB_NAME} on {DB_HOST}:{DB_PORT} | Port: {FLASK_PORT}")
