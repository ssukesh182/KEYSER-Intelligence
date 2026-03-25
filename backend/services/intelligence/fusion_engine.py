import logging
import json
from services.llm.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

class FusionEngine:
    """
    Fuses multiple intelligence signals (Website Diffs, Reddit, Trustpilot, Ads)
    into a single unified context for triangulation.
    """

    def __init__(self, model="gemma3:4b"):
        self.client = OllamaClient(model=model)

    def generate_triangulated_insight(self, competitor_name, data):
        """
        Gemma 3:4B analyzes the multi-source data to find cross-correlations.
        """
        system_prompt = (
            "You are a Senior Market Intelligence Strategist. "
            "Your goal is to TRIANGULATE signals from different sources to find hidden patterns. "
            "Look for cases where website changes match customer complaints or aggressive ad spending."
        )

        user_prompt = f"""
        ---
        COMPETITOR: {competitor_name}

        CONTEXT SIGNALS:
        1. WEBSITE CHANGES (Recent Diffs):
        {data.get('diffs', 'No recent changes.')}

        2. CUSTOMER SENTIMENT (Reddit/Trustpilot):
        {data.get('reviews', 'No recent reviews.')}

        3. AD STRATEGY (Google Ads):
        {data.get('ads', 'No recent ad data.')}

        ---
        INSTRUCTIONS:
        Analyze the signals above. Identify ONE high-confidence strategic triangulation.
        Example: "Website removed 'Free Delivery' banner -> Reddit is complaining about sudden cost hike -> Google Ads shifted to 'Daily Savings' messaging."

        OUTPUT FORMAT (JSON):
        {{
            "title": "Short strategic headline",
            "description": "Deep analysis of how sources cross-reference",
            "category": "strategy | pricing | expansion | sentiment",
            "urgency": 1-5,
            "confidence": 0.0-1.0,
            "action": "What should the user do?"
        }}
        """

        try:
            logger.info(f"Fusing signals for {competitor_name}...")
            # Use raw generate with specific JSON instructions
            response = self.client.generate(user_prompt, system_prompt=system_prompt)
            
            # Basic cleanup/parsing (should be more robust in production)
            # Find the JSON block
            if "{" in response and "}" in response:
                json_str = response[response.find("{"):response.rfind("}")+1]
                return json.loads(json_str)
            return None
        except Exception as e:
            logger.error(f"Fusion generation failed: {e}")
            return None
