import logging
from services.intelligence.signal_aggregator import get_recent_diffs_for_competitor
from services.intelligence.insight_generator import InsightGenerator
from models.competitor import Competitor
from extensions import db

logger = logging.getLogger(__name__)

def triangulate_signals_for_competitor(competitor_id: int, window_hours: int = 48) -> dict:
    """
    Groups all diffs for the same competitor within a 48h window,
    and sends as a batch to the LLM for a single higher-confidence insight.
    """
    diffs = get_recent_diffs_for_competitor(competitor_id, window_hours)
    if not diffs:
        logger.info(f"No recent diffs found for competitor {competitor_id}")
        return None
        
    competitor = db.session.query(Competitor).get(competitor_id)
    if not competitor:
        logger.error(f"Competitor {competitor_id} not found")
        return None
        
    generator = InsightGenerator()
    insight_data = generator.generate_insight_for_diffs(competitor.name, diffs)
    
    # We can attach the number of diffs used as corroborating evidence
    if insight_data:
        insight_data["_corroborating_sources_count"] = len(set([d.source_id for d in diffs]))
        insight_data["_total_diffs_count"] = len(diffs)
        
    return insight_data
