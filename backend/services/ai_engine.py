"""
services/ai_engine.py
Integrates with Google Gemini to provide executive summaries and deep classification.
"""
import os
import google.generativeai as genai

# Configure Gemini (will fall back gracefully if no key is present)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
# We use Gemini 1.5 Flash for fast, cheap inference during hackathons
MODEL_NAME = "gemini-1.5-flash"


def generate_insight_summary(competitor_name: str, diff_text: str, category: str) -> str:
    """
    Takes raw diff text and generates a punchy, 1-2 sentence executive summary.
    If API key is missing, uses a rule-based fallback.
    """
    if not GEMINI_API_KEY or not diff_text:
        return _fallback_summary(competitor_name, category)

    prompt = f"""
    You are a competitive intelligence analyst for a quick-commerce startup (like Zepto/Blinkit/Swiggy).
    Analyze the following website change for {competitor_name}. 
    Category is: {category}

    Raw Diff Data:
    {diff_text[:1500]} 

    Write a punchy, 1-2 sentence executive summary of this change. 
    Focus on business impact. Do NOT use markdown. Start directly with the insight.
    """
    print(f"[AI_ENGINE] Generating summary for {competitor_name} ({category})")
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[AI_ENGINE] Error calling Gemini: {e}")
        return _fallback_summary(competitor_name, category)


def fuse_signals(competitor_name: str, web_changes: list, news: list, social: list) -> str:
    """
    The 'Kill Feature' of Phase 3.
    Takes recent website changes, Tavily news, and Reddit mentions,
    and fuses them into a single strategic brief.
    """
    if not GEMINI_API_KEY:
        return "AI Fusion unavailable (Missing GEMINI_API_KEY)."

    prompt = f"""
    Write a 3-bullet point competitive intelligence brief for {competitor_name}.
    Synthesize these 3 data sources to find correlations:

    1. Website Changes: {web_changes}
    2. Recent News: {news}
    3. Reddit Sentiment: {social}

    Format as 3 crisp bullet points.
    """
    print(f"[AI_ENGINE] Fusing signals for {competitor_name}")
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[AI_ENGINE] Error during fusion: {e}")
        return "Error synthesizing intelligence."


def _fallback_summary(competitor_name: str, category: str) -> str:
    if category == "pricing":
        return f"{competitor_name} adjusted pricing or delivery fees."
    elif category == "offer":
        return f"{competitor_name} launched a new promotional offer."
    elif category == "messaging":
        return f"{competitor_name} updated their marketing messaging."
    else:
        return f"{competitor_name} made an structural update to their platform."
