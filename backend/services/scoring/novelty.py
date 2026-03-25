import logging
from services.embeddings.similarity_search import SimilaritySearch

logger = logging.getLogger(__name__)

def calculate_novelty_score(new_insight_text: str, historical_insights_texts: list) -> int:
    """
    Calculates a novelty score from 1-10 based on how semantically different 
    the new insight is compared to historical insights.
    10 means highly novel (no similar past insights).
    1 means highly redundant.
    """
    if not historical_insights_texts:
        return 10
        
    try:
        searcher = SimilaritySearch()
        max_sim = 0.0
        new_emb = searcher.client.get_embedding(new_insight_text)
        
        if not new_emb:
            return 5
            
        for hist_text in historical_insights_texts:
            hist_emb = searcher.client.get_embedding(hist_text)
            if hist_emb:
                sim = searcher.cosine_similarity(new_emb, hist_emb)
                if sim > max_sim:
                    max_sim = sim
                    
        novelty = int(10 - (max_sim * 9))
        return max(1, min(10, novelty))
    except Exception as e:
        logger.error(f"Error calculating novelty: {e}")
        return 5
