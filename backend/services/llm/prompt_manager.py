MASTER_INSIGHT_PROMPT = """
You are an expert competitive intelligence analyst.
Analyze the following diffs (changes) for the competitor "{competitor_name}".

Extract the most critical insight. Do not hallucinate.
Return your response ONLY as a valid JSON object matching this schema:
{{
  "title": "Short headline for the insight",
  "description": "Detailed explanation of the change and its implications",
  "insight_type": "pricing" | "messaging" | "offer" | "feature" | "trend",
  "confidence": 0.0 to 1.0 (float denoting how sure you are),
  "urgency": 1 to 5 (integer, 5 being most urgent),
  "action": "Recommended action for the user to take"
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
