import logging
import os
from extensions import db
from models.insight import Insight
from services.intelligence.brief_generator import BriefGenerator

logger = logging.getLogger(__name__)

def create_monday_morning_brief() -> dict:
    """
    Gathers top 5 insights by urgency, sends to Ollama, returns markdown and optionally generates a PDF.
    """
    top_insights = db.session.query(Insight).order_by(Insight.urgency.desc()).limit(5).all()
    
    if not top_insights:
        return {"error": "No insights available to generate a brief"}
        
    signals_list = []
    for insight in top_insights:
        competitor_name = insight.competitor.name if insight.competitor else "Unknown"
        signals_list.append(
            f"Competitor: {competitor_name}\n"
            f"Title: {insight.title}\n"
            f"Category: {insight.category} (Urgency: {insight.urgency})\n"
            f"Description: {insight.description}\n"
            f"Action: {insight.action}"
        )
        
    generator = BriefGenerator()
    markdown_result = generator.generate_brief_markdown(signals_list)
    
    # Generate a temporary PDF
    pdf_path = os.path.join("/tmp", "monday_brief.pdf")
    has_pdf = generator.export_to_pdf(markdown_result, pdf_path)
    
    return {
        "markdown": markdown_result,
        "pdf_available": has_pdf,
        "pdf_path": pdf_path if has_pdf else None,
        "insights_used": [i.id for i in top_insights]
    }
