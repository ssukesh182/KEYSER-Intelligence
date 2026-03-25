import logging
from services.llm.ollama_client import OllamaClient
import json

logger = logging.getLogger(__name__)

WHITESPACE_PROMPT = """
You are a senior market analyst running a positioning analysis.
Your job is to identify 3 to 6 completely unclaimed positioning angles in the market based on current messaging.

CURRENT COMPETITOR THEMES:
{competitor_themes}

TAVILY REAL-TIME CONTEXT:
{tavily_context}

Output ONLY valid JSON representing an array of objects.
Do not output anything else. Your response MUST be in this exact format:
{{
  "angles": [
    {{
      "angle": "Short title",
      "explanation": "Why this is an opportunity",
      "opportunity_score": 85
    }},
    {{ ... }}
  ]
}}
"""

class WhitespaceEngine:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def detect_whitespace(self, competitor_themes: str, tavily_context: str) -> list:
        prompt = WHITESPACE_PROMPT.format(
            competitor_themes=competitor_themes, 
            tavily_context=tavily_context
        )
        
        try:
            logger.info("Detecting whitespace angles via Ollama...")
            response = self.client.generate(prompt, json_format=True)
            
            import re
            match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
            if match:
                response = match.group(1)
            parsed = json.loads(response.strip())
            
            # Ensure it is a list
            if isinstance(parsed, dict) and "angles" in parsed:
                return parsed["angles"]
            elif isinstance(parsed, list):
                return parsed
            else:
                return []
        except Exception as e:
            logger.error(f"Failed to detect whitespace: {e}")
            return []
