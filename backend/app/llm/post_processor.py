import logging
from typing import Optional
from .client import LLMClient
from .thai_corrector import ThaiCorrector

logger = logging.getLogger(__name__)

class PostProcessor:
    def __init__(self, llm_client: Optional[LLMClient]):
        self.llm_client = llm_client

    def _clean_whitespace(self, text: str) -> str:
        lines = text.split("\n")
        cleaned_lines = []
        for line in lines:
            cleaned_lines.append(line.rstrip())
        
        # Replace 3 or more newlines with 2
        text = "\n".join(cleaned_lines)
        import re
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text

    def _fix_markdown_structure(self, text: str) -> str:
        # Simplified structural fixes if needed
        return text

    async def process(self, markdown: str, llm_enabled: bool, custom_prompt: Optional[str] = None) -> str:
        processed = self._clean_whitespace(markdown)
        processed = self._fix_markdown_structure(processed)
        
        if llm_enabled and self.llm_client:
            logger.info("Running Thai correction via LLM...")
            corrector = ThaiCorrector(self.llm_client)
            processed = await corrector.correct(processed)
            processed = self._clean_whitespace(processed)
            
        return processed
