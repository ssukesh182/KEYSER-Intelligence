"""
services/pipelines/copilot_pipeline.py

AI Market Intelligence Copilot — answers strategic questions using real DB data
and Ollama Gemma 3:4b with the structured JSON output format.
"""
import json
import logging
import re
from extensions import db
from models.insight import Insight
from models.competitor import Competitor
from services.llm.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

# ─── System Prompt ────────────────────────────────────────────────────────────

COPILOT_SYSTEM_PROMPT = """You are an AI Market Intelligence Copilot.

Your role:
- Analyze competitor data
- Identify trends, positioning, and gaps
- Recommend clear, actionable strategies

You MUST:
- Be concise and structured
- Base answers ONLY on provided data
- Avoid assumptions not supported by data
- Think like a senior strategy consultant"""

COPILOT_USER_PROMPT = """---

CONTEXT:
Competitor Insights:
{insights}

Whitespace Opportunities:
{whitespace}

Hiring Signals:
{hiring}

Ad Messaging:
{ads}

User Question:
{question}

---

OUTPUT FORMAT (STRICT JSON, no markdown):

{{
  "summary": "1-2 line direct answer",
  "key_insights": [
    "Insight 1",
    "Insight 2"
  ],
  "opportunities": [
    "Opportunity 1",
    "Opportunity 2"
  ],
  "recommended_actions": [
    "Action 1",
    "Action 2",
    "Action 3"
  ],
  "confidence": "low | medium | high",
  "reasoning": "Why this recommendation makes sense based on data"
}}"""


# ─── Data Fetchers ────────────────────────────────────────────────────────────

def _fetch_insights_context(question: str) -> str:
    """Fetch relevant insights from DB, filtered by competitor name if mentioned."""
    try:
        q = db.session.query(Insight).join(Competitor)

        # Try to narrow by competitor name if mentioned in the question
        common_competitors = ["zepto", "blinkit", "dunzo", "swiggy", "zomato", "amazon", "flipkart"]
        for name in common_competitors:
            if name in question.lower():
                q = q.filter(db.func.lower(Competitor.name).like(f"%{name}%"))
                break

        insights = q.order_by(Insight.created_at.desc()).limit(10).all()

        if not insights:
            return "No recent insights available."

        lines = []
        for i in insights:
            line = f"[{i.category.upper()}] {i.title}"
            if i.description:
                line += f" — {i.description[:150]}"
            if i.action:
                line += f" | Suggested action: {i.action[:100]}"
            lines.append(line)
        return "\n".join(lines)
    except Exception as e:
        logger.error(f"[Copilot] Error fetching insights: {e}")
        return "Error fetching insights."


def _fetch_whitespace_context() -> str:
    """Fetch whitespace/gap opportunities from insights marked as 'trend'."""
    try:
        gaps = db.session.query(Insight).filter(
            Insight.category.in_(["trend", "feature"])
        ).order_by(Insight.confidence.desc()).limit(5).all()

        if not gaps:
            return "No whitespace data available."

        return "\n".join([f"- {i.title}" for i in gaps])
    except Exception as e:
        logger.error(f"[Copilot] Error fetching whitespace: {e}")
        return "No whitespace data available."


def _fetch_hiring_context() -> str:
    """Placeholder — return actionable note about hiring signals."""
    return "No hiring signal data available in current dataset."


def _fetch_ads_context() -> str:
    """Fetch messaging/offer insights as proxy for ad strategy."""
    try:
        ads = db.session.query(Insight).filter(
            Insight.category.in_(["messaging", "offer"])
        ).order_by(Insight.created_at.desc()).limit(5).all()

        if not ads:
            return "No ad/messaging data available."

        return "\n".join([f"- {i.title}" for i in ads])
    except Exception as e:
        logger.error(f"[Copilot] Error fetching ad data: {e}")
        return "No ad/messaging data available."


# ─── Response Parsing ─────────────────────────────────────────────────────────

def _parse_copilot_response(raw: str) -> dict:
    """Extract JSON from LLM response (may be wrapped in markdown blocks)."""
    try:
        # Strip markdown code fences
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", raw, re.DOTALL)
        clean = match.group(1) if match else raw.strip()

        parsed = json.loads(clean)

        # Ensure all required fields are present with defaults
        return {
            "summary": parsed.get("summary", "Unable to generate summary."),
            "key_insights": parsed.get("key_insights", []),
            "opportunities": parsed.get("opportunities", []),
            "recommended_actions": parsed.get("recommended_actions", []),
            "confidence": parsed.get("confidence", "low"),
            "reasoning": parsed.get("reasoning", "")
        }
    except json.JSONDecodeError:
        logger.warning(f"[Copilot] Failed to parse JSON. Raw: {raw[:200]}")
        # Return raw text wrapped in structure
        return {
            "summary": raw[:300] if raw else "No response generated.",
            "key_insights": [],
            "opportunities": [],
            "recommended_actions": [],
            "confidence": "low",
            "reasoning": "Raw LLM output (JSON parse failed)."
        }


# ─── Main Pipeline ────────────────────────────────────────────────────────────

def process_copilot_chat(message: str) -> dict:
    """
    Full copilot pipeline:
    1. Fetch relevant context from DB
    2. Format the system + user prompt
    3. Call Ollama Gemma 3:4b
    4. Parse and return structured JSON response
    """
    logger.info(f"[Copilot] Processing question: {message[:100]}")

    insights_ctx = _fetch_insights_context(message)
    whitespace_ctx = _fetch_whitespace_context()
    hiring_ctx = _fetch_hiring_context()
    ads_ctx = _fetch_ads_context()

    user_prompt = COPILOT_USER_PROMPT.format(
        insights=insights_ctx,
        whitespace=whitespace_ctx,
        hiring=hiring_ctx,
        ads=ads_ctx,
        question=message
    )

    client = OllamaClient(model="gemma3:4b")
    try:
        raw_response = client.generate(
            prompt=user_prompt,
            system_prompt=COPILOT_SYSTEM_PROMPT,
        )
        logger.info(f"[Copilot] Raw response: {raw_response[:200]}")
        return _parse_copilot_response(raw_response)
    except Exception as e:
        logger.error(f"[Copilot] Ollama call failed: {e}")
        return {
            "summary": f"Error: Could not reach AI engine. {str(e)}",
            "key_insights": [],
            "opportunities": [],
            "recommended_actions": [],
            "confidence": "low",
            "reasoning": "LLM call failed."
        }
