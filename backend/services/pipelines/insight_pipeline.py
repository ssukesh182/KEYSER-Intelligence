import logging
from extensions import db
from models.diff import Diff
from models.insight import Insight
from models.insight_source import InsightSource
from services.intelligence.insight_generator import InsightGenerator
from services.scoring.confidence import calculate_confidence
from services.scoring.urgency import calculate_urgency

logger = logging.getLogger(__name__)

def process_snapshot_for_insights(snapshot_id: int):
    """
    Receives snapshot_id -> fetches un-processed diffs -> 
    calls Ollama -> parses JSON -> writes to insights + insight_sources tables.
    """
    # 1. Fetch Diffs for this snapshot
    diffs = db.session.query(Diff).filter(
        (Diff.new_snapshot_id == snapshot_id) | (Diff.old_snapshot_id == snapshot_id)
    ).all()
    
    if not diffs:
        logger.info(f"No diffs found for snapshot {snapshot_id}")
        return None
    
    source_id = diffs[0].source_id
    from models.source import Source
    source = db.session.query(Source).get(source_id)
    if not source or not source.competitor:
        logger.error(f"Competitor/Source for diffs not found")
        return None
        
    competitor = source.competitor
    
    # 2. Generate Insight
    generator = InsightGenerator()
    insight_data = generator.generate_insight_for_diffs(competitor.name, diffs)
    
    if not insight_data:
        logger.error("Failed to extract insight data from LLM")
        return None
        
    # 3. Scoring
    category = insight_data.get("category", "trend")
    urgency_score = calculate_urgency(category)
    
    # Use LLM confidence if available, otherwise calculate using basic triangulation (1/1 corroborating for single source diff)
    confidence_score = float(insight_data.get("confidence", calculate_confidence(1, 1)))
    
    # 4. Write to DB
    new_insight = Insight(
        competitor_id=competitor.id,
        title=insight_data.get("title", "New Insight"),
        description=insight_data.get("description", ""),
        category=category,
        action=insight_data.get("action", ""),
        confidence=confidence_score,
        urgency=urgency_score
    )
    
    db.session.add(new_insight)
    db.session.flush() # get new_insight.id
    
    # Create InsightSource links
    for diff in diffs:
        isource = InsightSource(
            insight_id=new_insight.id,
            diff_id=diff.id,
            reasoning="Extracted directly from diff"
        )
        db.session.add(isource)
        
    db.session.commit()
    logger.info(f"Successfully processed snapshot {snapshot_id} into Insight {new_insight.id}")
    return new_insight.id
