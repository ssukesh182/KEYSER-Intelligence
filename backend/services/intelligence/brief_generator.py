import logging
from services.llm.ollama_client import OllamaClient
import markdown
import pdfkit

logger = logging.getLogger(__name__)

BRIEF_PROMPT = """
You are a senior market analyst. Given these top signals across the market, write a 3-recommendation CEO brief.
For every single recommendation, you MUST explicitly include and bold exactly these 4 sub-headings:
1) What to do
2) Why now (the urgency)
3) Evidence (referencing exact signals provided)
4) Timeline (when this action must be completed)

SIGNALS:
{signals_text}

Format your response in Markdown. Do not include external links or hallucinate.
"""

class BriefGenerator:
    def __init__(self):
        self.client = OllamaClient("http://localhost:11434", "gemma3:4b")
        
    def generate_brief_markdown(self, signals_list: list) -> str:
        signals_text = "\n\n".join([f"Signal {i+1}:\n{s}" for i, s in enumerate(signals_list)])
        prompt = BRIEF_PROMPT.format(signals_text=signals_text)
        
        try:
            logger.info("Generating CEO brief via Ollama...")
            # We don't want JSON format here, we want Markdown
            return self.client.generate(prompt, json_format=False)
        except Exception as e:
            logger.error(f"Failed to generate brief: {e}")
            return "Error generating brief."
            
    def export_to_pdf(self, markdown_text: str, output_path: str):
        try:
            html = markdown.markdown(markdown_text)
            # Make it look a little bit better
            styled_html = f"<html><body style='font-family: sans-serif; padding: 2em;'>{html}</body></html>"
            pdfkit.from_string(styled_html, output_path, options={"enable-local-file-access": ""})
            return True
        except Exception as e:
            logger.error(f"Failed to export PDF: {e}")
            return False
