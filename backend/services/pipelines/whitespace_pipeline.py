import logging
import requests
from config import TAVILY_API_KEY
from extensions import db
from models.insight import Insight
from services.intelligence.whitespace_engine import WhitespaceEngine

logger = logging.getLogger(__name__)

def fetch_tavily_context(query: str) -> str:
    if not TAVILY_API_KEY:
        logger.warning("No TAVILY_API_KEY set. Skipping live web context.")
        return "No real-time web context available."
        
    try:
        resp = requests.post(
            "https://api.tavily.com/search",
            json={"api_key": TAVILY_API_KEY, "query": query, "search_depth": "basic", "include_answer": True},
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("answer", str(data.get("results", [])))
    except Exception as e:
        logger.error(f"Tavily API error: {e}")
        return "Tavily search failed."

def run_whitespace_radar() -> list:
    """
    Collects messaging themes from all competitors, fetches Tavily context,
    and prompts Ollama to find unclaimed positioning angles.
    """
    # 1. Collect messaging themes
    messaging_insights = db.session.query(Insight).filter(
        Insight.category.in_(["messaging", "feature", "offer"])
    ).limit(30).all()
    
    competitor_themes = []
    for insight in messaging_insights:
        comp_name = insight.competitor.name if insight.competitor else "Unknown"
        competitor_themes.append(f"{comp_name}: {insight.title} - {insight.description}")
        
    themes_text = "\n".join(competitor_themes) if competitor_themes else "No active messaging themes found in the DB."
    
    # 2. Fetch Tavily context
    market_query = "What are the latest positioning and marketing trends?"
    tavily_context = fetch_tavily_context(market_query)
    
    # 3. Request LLM
    engine = WhitespaceEngine()
    angles = engine.detect_whitespace(themes_text, tavily_context)
    
    return angles
