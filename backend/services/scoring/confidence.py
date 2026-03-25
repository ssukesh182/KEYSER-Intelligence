def calculate_confidence(corroborating_sources: int, total_sources: int) -> float:
    """
    Calculates confidence based on the number of corroborating sources 
    compared to the total available sources.
    Returns a float between 0.0 and 1.0.
    """
    if total_sources <= 0:
        return 0.5  # default baseline if no triangulation data is available
    
    # Simple weight: corroborating / total
    # If 2 out of 3 sources confirm a pricing change, confidence = 0.66
    confidence = corroborating_sources / total_sources
    
    # Clamp between 0.0 and 1.0
    return max(0.0, min(1.0, confidence))
