MASTER_INSIGHT_PROMPT = """
You are an expert competitive intelligence analyst.
Analyze the following diffs (changes) for the competitor "{competitor_name}".

Extract the single most critical insight. Do not hallucinate.
CRITICAL: The insight must be highly specific, actionable, and non-generic. Do NOT write vague statements like "improved their marketing" or "changed pricing". Specify exactly what changed (e.g., "Platform fee increased from $1 to $2.50").

Return your response ONLY as a valid JSON object matching this schema:
{{
  "title": "Short, highly specific headline for the insight",
  "description": "Detailed explanation of the exact change using exact numbers and direct implications",
  "insight_type": "pricing" | "messaging" | "offer" | "feature" | "trend",
  "confidence": 0.0 to 1.0 (float denoting how sure you are based strictly on evidence provided),
  "urgency": 1 to 5 (integer, 5 being most urgent),
  "action": "Specific, measurable recommended action for the user to take (e.g., 'Audit delivery fee margins in Delhi')"
}}

Here are the diffs:
{diffs_text}
"""

def build_insight_prompt(competitor_name: str, diffs_text: str) -> str:
    """Format the master prompt with the competitor name and diffs."""
    return MASTER_INSIGHT_PROMPT.format(
        competitor_name=competitor_name,
        diffs_text=diffs_text
    )
