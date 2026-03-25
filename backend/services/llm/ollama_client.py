import requests
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434", model="gemma:2b"):
        self.base_url = base_url
        self.model = model

    def generate(self, prompt: str, system_prompt: str = None, json_format: bool = False) -> str:
        """Calls the generative endpoint of Ollama.
        
        Note: We intentionally do NOT pass format='json' to the Ollama API,
        because Gemma 3 returns empty {} when that mode is active.
        Instead, we use prompt instructions to request JSON and parse the
        response (including markdown-wrapped code blocks) in the response parser.
        """
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }
        if system_prompt:
            payload["system"] = system_prompt
        # NOTE: Do NOT set payload["format"] = "json" — causes Gemma 3 to return {}

        try:
            logger.info(f"[Ollama] Sending prompt for {self.model}: {prompt[:120]}...")
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "").strip()
            logger.info(f"[Ollama] Raw response: {raw_text[:300]}")
            return raw_text
        except requests.exceptions.RequestException as e:
            logger.error(f"[Ollama] Error calling API: {e}")
            raise
