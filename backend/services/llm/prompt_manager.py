MASTER_INSIGHT_PROMPT = """
You are an expert competitive intelligence analyst. 
Analyze these changes detected on {competitor_name}'s website ({source_label}):

{diffs_text}

Based on the above changes, extract the most important competitive insight.

Return a JSON object (inside triple backticks) with EXACTLY these fields:
```json
{{
  "claim": "Short specific claim grounded in the diff text above",
  "description": "2-3 sentence explanation of what changed and why it matters",
  "category": "pricing",
  "subcategory": "delivery_fee",
  "competitor": "{competitor_name}",
  "confidence": 0.85,
  "urgency": 3,
  "action": "What your company should do in response",
  "supporting_text": "Copy the exact relevant line(s) from the diff text above that prove the claim",
  "source_url": "{source_url}"
}}
```

RULES:
- "claim" must summarize the key change in one sentence
- "supporting_text" must be a direct quote from the diff text above
- "confidence" must be a float between 0.0 and 1.0
- "category" must be one of: pricing, messaging, offer, feature, trend
"""


def build_insight_prompt(competitor_name: str, diffs_text: str, source_label: str = "unknown", source_url: str = "") -> str:
    """Format the master prompt with the competitor name and diffs."""
    return MASTER_INSIGHT_PROMPT.format(
        competitor_name=competitor_name,
        source_label=source_label,
        source_url=source_url,
        diffs_text=diffs_text
    )
