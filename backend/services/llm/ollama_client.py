import requests
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434", model="gemma3:4b"):
        self.base_url = base_url
        self.model = model

    def generate(self, prompt: str, system_prompt: str = None, json_format: bool = False) -> str:
        """Calls the generative endpoint of Ollama."""
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        if system_prompt:
            payload["system"] = system_prompt
        if json_format:
            payload["format"] = "json"

        try:
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling Ollama API: {e}")
            raise
