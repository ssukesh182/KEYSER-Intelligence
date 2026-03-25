import logging
from extensions import db
from models.insight import Insight
from services.llm.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

TREND_PROMPT = """
You are a senior market analyst.
Look at the following sequence of insights for competitor "{competitor_name}" over the last 30 days.

Identify if there is a macro trend (e.g., shifting entirely to premium, aggressively cutting costs).
If there is a trend, output a short 1-2 sentence description of the trend and a trend score from 1-10.
If no trend, say "No clear trend".

INSIGHTS:
{insights_text}
"""

class TrendDetector:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def detect_macro_trend(self, competitor_name: str, insights: list) -> dict:
        if not insights:
            return {"trend": "No recent data to establish a trend.", "score": 0}
            
        insights_text = "\n".join([f"- {i.category.upper()}: {i.title} - {i.description}" for i in insights])
        prompt = TREND_PROMPT.format(competitor_name=competitor_name, insights_text=insights_text)
        
        try:
            logger.info(f"Detecting trends for {competitor_name}...")
            response = self.client.generate(prompt, json_format=False)
            return {"trend_analysis": response}
        except Exception as e:
            logger.error(f"Trend detection failed: {e}")
            return {"trend_analysis": "Error analyzing trends."}
