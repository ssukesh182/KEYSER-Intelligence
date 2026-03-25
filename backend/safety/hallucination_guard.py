import logging
from services.llm.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

GUARD_PROMPT = """
You are a strict data auditor.
I will provide you with a source text and an AI-generated insight based off that source text.
Your ONLY job is to determine if the insight contains "hallucinations"—meaning it claims facts, numbers, or features that are absolutely NOT present in the source text.

SOURCE TEXT:
{source_text}

AI INSIGHT:
{insight_text}

Respond with EXACTLY "PASS" if the insight is fully supported by the source text.
Respond with EXACTLY "FAIL" if the insight hallucinated information.
Do not output any other words.
"""

class HallucinationGuard:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def verify_insight(self, source_text: str, insight_text: str) -> bool:
        """
        Returns True if the insight is safe (no hallucination).
        Returns False if a hallucination is detected.
        """
        prompt = GUARD_PROMPT.format(source_text=source_text, insight_text=insight_text)
        try:
            response = self.client.generate(prompt, json_format=False).strip().upper()
            if "FAIL" in response:
                logger.warning("Hallucination guard detected a potential hallucination!")
                return False
            return True
        except Exception as e:
            logger.error(f"Hallucination guard error: {e}")
            return True
