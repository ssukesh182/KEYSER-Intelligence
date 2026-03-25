import logging
from services.llm.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

class CopilotEngine:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def generate_demo_answer(self, question: str, context: str) -> str:
        """
        Takes the user question and the provided context (insights/themes)
        and formats an impressive markdown response for the demo.
        """
        prompt = f"""
You are a highly intelligent AI Copilot for competitive intelligence.
Answer the user's question impressively using ONLY the context provided.
Format the output in clean, readable Markdown.

USER QUESTION: {question}

AVAILABLE CONTEXT:
{context}
"""
        try:
            logger.info(f"Generating copilot answer for question: {question}")
            return self.client.generate(prompt, json_format=False)
        except Exception as e:
            logger.error(f"Failed to generate copilot answer: {e}")
            return "I'm sorry, I encountered an error analyzing that data."
            
    def get_canned_demo_answer(self, question_key: str) -> str:
        """
        Fallback logic for canned demo responses matching specific queries if data is absent.
        """
        canned_responses = {
            "zepto": "### Insight on Zepto\n**Recent Activity:** Zepto has recently launched 10-minute delivery for high-margin electronics and increased their late-night delivery fees by Rs. 5.\n**Why it matters:** They are aggressively targeting profitability per order. We should evaluate scaling our own high-AOV electronic catalogue.",
            "whitespace": "### Whitespace Radar Analysis\nI have scanned current messaging frameworks. **Community-led commerce** (supporting local stores) and **Diet-specific bundles** (Keto/Vegan family packs) remain completely uncontested by Swiggy, Zomato, and Zepto.\n**Recommendation:** Launch a pilot campaign targeting specialized diet bundles this week.",
            "weekly": "### Weekly Action Plan\nBased on competitor urgency signals:\n1. **Pricing:** Match Zomato's platform fee cut immediately to prevent churn.\n2. **Operations:** Prepare a response to Swiggy's 24/7 delivery rollout in Tier-1 cities.\n3. **Marketing:** Push messaging on our eco-friendly packaging, as the market currently ignores sustainability."
        }
        return canned_responses.get(question_key, "I do not have a dedicated answer for that demo query right now.")
