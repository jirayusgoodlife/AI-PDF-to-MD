import logging
import re
from typing import Optional
from .client import LLMClient
from .thai_corrector import ThaiCorrector, THAI_CORRECTION_SYSTEM_PROMPT
from ..config import settings

logger = logging.getLogger(__name__)

class PostProcessor:
    def __init__(self, llm_client: Optional[LLMClient]):
        self.llm_client = llm_client

    def _clean_whitespace(self, text: str) -> str:
        lines = text.split("\n")
        cleaned_lines = []
        for line in lines:
            cleaned_lines.append(line.rstrip())
        
        text = "\n".join(cleaned_lines)
        # Replace 3 or more newlines with 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text

    def _clean_rag_artifacts(self, text: str) -> str:
        """Deterministically cleans unnecessary RAG noise like dots, form blanks, and page numbers."""
        cleaned_lines = []
        for line in text.split("\n"):
            stripped = line.strip()
            # Remove standalone dot leader lines or line fill blanks (e.g., ............., ------------)
            if re.fullmatch(r'[\.\s_—\-]{4,}', stripped):
                continue
            # Remove common standalone page numbers (e.g. "- 1 -", "หน้า 1 จาก 10", "Page 2 of 5")
            if re.fullmatch(r'([-—~]\s*)?(หน้า|page)\s*\d+(\s*(จาก|of|\/)\s*\d+)?(\s*[-—~])?', stripped, re.IGNORECASE):
                continue

            # Clean repeated dots inside lines (e.g. "หัวข้อ .................... 12")
            cleaned_line = re.sub(r'\.{4,}', ' ... ', line)
            cleaned_line = re.sub(r'(\.\s){4,}', ' ... ', cleaned_line)
            # Normalize 3 or more consecutive spaces inside line (preserves code indentation if any)
            if not cleaned_line.startswith("    ") and not cleaned_line.startswith("\t"):
                cleaned_line = re.sub(r'(?<!^)[ ]{3,}', ' ', cleaned_line)
            cleaned_lines.append(cleaned_line)

        text = "\n".join(cleaned_lines)
        # Normalize multiple spaces between Thai characters caused by justify alignment
        text = re.sub(r'(?<=[\u0E00-\u0E7F])\s{2,}(?=[\u0E00-\u0E7F])', ' ', text)
        return text

    def _clean_thai_ocr_spacing(self, text: str) -> str:
        """Fixes OCR spacing artifacts in Thai text caused by character-level or syllable-level bounding boxes."""
        # 1. Attach upper/lower vowels and tones to base consonant
        text = re.sub(r'([ก-๙])\s+([\u0E30-\u0E3A\u0E47-\u0E4E])', r'\1\2', text)
        text = re.sub(r'([\u0E30-\u0E3A\u0E47-\u0E4E])\s+([ก-๙])', r'\1\2', text)
        text = re.sub(r'([\u0E40-\u0E44])\s+([ก-๙])', r'\1\2', text)
        text = re.sub(r'([ก-๙])\s+([\u0E30-\u0E33\u0E45])', r'\1\2', text)

        # 2. Process line by line to preserve markdown formatting and code blocks
        lines = text.split("\n")
        cleaned_lines = []
        in_code_block = False

        for line in lines:
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
                cleaned_lines.append(line)
                continue

            if in_code_block:
                cleaned_lines.append(line)
                continue

            # If line contains Thai characters, collapse single spaces between Thai letters
            if re.search(r'[\u0E00-\u0E7F]', line):
                line = re.sub(r'(?<=[\u0E01-\u0E5B])\s(?=[\u0E01-\u0E5B])', '', line)

            cleaned_lines.append(line)

        res = "\n".join(cleaned_lines)
        res = re.sub(r'([ก-๙])\s+([\u0E30-\u0E3A\u0E47-\u0E4E])', r'\1\2', res)
        res = re.sub(r'([\u0E40-\u0E44])\s+([ก-๙])', r'\1\2', res)
        return res

    def _fix_markdown_structure(self, text: str) -> str:
        return text

    async def process(self, markdown: str, llm_enabled: bool, custom_prompt: Optional[str] = None) -> str:
        processed = self._clean_thai_ocr_spacing(markdown)
        processed = self._clean_rag_artifacts(processed)
        processed = self._clean_whitespace(processed)
        processed = self._fix_markdown_structure(processed)
        
        if llm_enabled and self.llm_client:
            logger.info("Running Thai correction & RAG cleansing via LLM...")
            prompt = custom_prompt or settings.SYSTEM_PROMPT or THAI_CORRECTION_SYSTEM_PROMPT
            corrector = ThaiCorrector(self.llm_client, system_prompt=prompt)
            processed = await corrector.correct(processed)
            processed = self._clean_thai_ocr_spacing(processed)
            processed = self._clean_rag_artifacts(processed)
            processed = self._clean_whitespace(processed)
            
        return processed

