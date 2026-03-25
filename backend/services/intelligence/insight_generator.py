import logging
from services.llm.ollama_client import OllamaClient
from services.llm.context_builder import build_diffs_context
from services.llm.prompt_manager import build_insight_prompt
from services.llm.response_parser import parse_insight_response

logger = logging.getLogger(__name__)

class InsightGenerator:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def generate_insight_for_diffs(self, competitor_name: str, diffs: list) -> dict:
        """Generates a structured insight from a list of diffs using Ollama."""
        context = build_diffs_context(diffs)
        prompt = build_insight_prompt(competitor_name, context)
        
        try:
            logger.info(f"Generating insight for {competitor_name} with {len(diffs)} diffs")
            response = self.client.generate(prompt, json_format=True)
            return parse_insight_response(response)
        except Exception as e:
            logger.error(f"Failed to generate insight: {e}")
            return None
