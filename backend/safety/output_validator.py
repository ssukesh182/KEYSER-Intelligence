import logging

logger = logging.getLogger(__name__)

class OutputValidator:
    """
    Validates structural integrity of LLM outputs to prevent application crashes.
    """
    
    @staticmethod
    def validate_insight_schema(parsed_json: dict) -> bool:
        required_keys = ["title", "description", "insight_type", "confidence", "urgency", "action"]
        
        if not isinstance(parsed_json, dict):
            logger.error("Output JSON is not a dictionary.")
            return False
            
        for key in required_keys:
            if key not in parsed_json:
                logger.error(f"Output JSON missing required key: {key}")
                return False
                
        try:
            float(parsed_json["confidence"])
            int(parsed_json["urgency"])
        except ValueError:
            logger.error("Output JSON has invalid types for confidence or urgency.")
            return False
            
        return True
        
    @staticmethod
    def validate_whitespace_schema(parsed_json: list) -> bool:
        if not isinstance(parsed_json, list):
            logger.error("Whitespace output is not a list.")
            return False
            
        required_keys = ["angle", "explanation", "opportunity_score"]
        for item in parsed_json:
            if not isinstance(item, dict):
                return False
            for key in required_keys:
                if key not in item:
                    return False
        return True
