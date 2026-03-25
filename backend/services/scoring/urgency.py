def calculate_urgency(insight_type: str) -> int:
    """
    Returns an urgency score (1-5) based on the type of change.
    pricing change = 5
    messaging change = 4
    feature change = 3
    social/trend mention = 2
    default = 1
    """
    mapping = {
        "pricing": 5,
        "messaging": 4,
        "feature": 3,
        "offer": 3,
        "trend": 2,
        "social": 2
    }
    
    return mapping.get(insight_type.lower(), 1)
