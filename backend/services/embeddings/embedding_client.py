import logging
import requests

logger = logging.getLogger(__name__)

class EmbeddingClient:
    def __init__(self, base_url="http://localhost:11434", model="nomic-embed-text"):
        self.base_url = base_url
        self.model = model
        self.api_url = f"{self.base_url}/api/embeddings"
        
    def get_embedding(self, text: str) -> list:
        """
        Calls Ollama to get an embedding vector for the provided text.
        Requires an embedding-capable model like 'nomic-embed-text' installed in Ollama.
        """
        payload = {
            "model": self.model,
            "prompt": text
        }
        
        try:
            response = requests.post(self.api_url, json=payload, timeout=5)
            response.raise_for_status()
            data = response.json()
            return data.get("embedding", [])
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return []
