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
        
        # Normalize confidence (some LLMs return 0-100 instead of 0-1)
        raw_conf = parsed.get("confidence", 0.5)
        try:
            conf = float(raw_conf)
            if conf > 1.0:
                conf = conf / 100.0
            conf = max(0.0, min(1.0, conf))
        except:
            conf = 0.5

        # Normalize category to match InsightSchema expectations if possible
        raw_cat = parsed.get("category", parsed.get("insight_type", "trend")).lower()
        valid_categories = ["pricing", "messaging", "offer", "feature", "trend"]
        category = "trend"
        for vc in valid_categories:
            if vc in raw_cat:
                category = vc
                break

        return {
            "claim":           parsed.get("claim", parsed.get("title", "Unknown Insight")),
            "description":     parsed.get("description", ""),
            "category":        category,
            "subcategory":     parsed.get("subcategory", "general"),
            "competitor":      parsed.get("competitor", "unknown"),
            "confidence":      conf,
            "urgency":         int(parsed.get("urgency", 1)),
            "action":          parsed.get("action", ""),
            "supporting_text": parsed.get("supporting_text", "No supporting text provided"),
            "source_url":      parsed.get("source_url", "unknown")
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
