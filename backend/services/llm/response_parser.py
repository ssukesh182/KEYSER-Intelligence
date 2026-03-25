import json
import logging
import re

logger = logging.getLogger(__name__)

def parse_insight_response(response_text: str) -> dict:
    """
    Parses the JSON response from the LLM. 
    It ensures the text is extracted from markdown blocks if necessary.
    """
    try:
        # Strip markdown json blocks if present
        match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
        if match:
            clean_text = match.group(1)
        else:
            clean_text = response_text.strip()
        
        parsed = json.loads(clean_text)
        
        # Ensure default fields map correctly
        return {
            "title": parsed.get("title", "Unknown Insight"),
            "description": parsed.get("description", ""),
            "category": parsed.get("insight_type", "trend"), # maps to insight.category
            "confidence": float(parsed.get("confidence", 0.5)),
            "urgency": int(parsed.get("urgency", 1)),
            "action": parsed.get("action", "")
        }
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM insight response: {e}. Raw text: {response_text}")
        return {
            "title": "Failed to parse insight",
            "description": "The AI provided an invalid response format.",
            "category": "error",
            "confidence": 0.0,
            "urgency": 1,
            "action": "Review source diff manually."
        }
    except Exception as e:
        logger.error(f"Unexpected error in parser: {e}")
        raise
