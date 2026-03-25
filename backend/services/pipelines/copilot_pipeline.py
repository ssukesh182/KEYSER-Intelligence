import logging
from extensions import db
from models.insight import Insight
from models.competitor import Competitor
from services.intelligence.copilot_engine import CopilotEngine

logger = logging.getLogger(__name__)

def process_copilot_chat(message: str) -> str:
    """
    Routes the incoming chat question, determining if it triggers the demo questions
    and fetches relevant context from the database if necessary.
    """
    msg_lower = message.lower()
    engine = CopilotEngine()
    
    # 1. "What is Zepto doing?"
    if "zepto" in msg_lower:
        # Try fetching real Zepto insights
        zepto_insights = db.session.query(Insight).join(Competitor).filter(
            db.func.lower(Competitor.name).like('%zepto%')
        ).limit(5).all()
        # Note: If no real data is found, we fall back to the impressive canned answer
        if zepto_insights:
            context_pts = [f"- {i.title}: {i.description}" for i in zepto_insights]
            return engine.generate_demo_answer(message, "\n".join(context_pts))
        return engine.get_canned_demo_answer("zepto")
        
    # 2. "Where is the whitespace?"
    elif "whitespace" in msg_lower:
        # For demo purposes, we return a canned impressive answer unless we dynamically invoke whitespace_pipeline
        return engine.get_canned_demo_answer("whitespace")
        
    # 3. "What should we do this week?"
    elif "this week" in msg_lower or "should we do" in msg_lower:
        # Fetch the most urgent insights
        urgent_insights = db.session.query(Insight).order_by(Insight.urgency.desc()).limit(3).all()
        if urgent_insights:
            context_pts = [f"Urgency {i.urgency} | {i.category}: {i.title} - Action: {i.action}" for i in urgent_insights]
            return engine.generate_demo_answer(message, "\n".join(context_pts))
        return engine.get_canned_demo_answer("weekly")
        
    else:
        # Fallback generic handling
        recent = db.session.query(Insight).limit(3).all()
        if recent:
            ctx = "\n".join([f"- {i.title}" for i in recent])
            return engine.generate_demo_answer(message, ctx)
        return "I am an AI Copilot. Please ask questions about competitors like 'What is Zepto doing?' or 'Where is the whitespace?'"
