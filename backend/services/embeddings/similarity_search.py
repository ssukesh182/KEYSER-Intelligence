import math
import logging
from services.embeddings.embedding_client import EmbeddingClient

logger = logging.getLogger(__name__)

class SimilaritySearch:
    def __init__(self):
        self.client = EmbeddingClient()
        
    def cosine_similarity(self, vec1: list, vec2: list) -> float:
        """
        Calculates cosine similarity between two numeric vectors.
        Returns a float between -1.0 and 1.0.
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
            
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(b * b for b in vec2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
            
        return dot_product / (magnitude1 * magnitude2)
