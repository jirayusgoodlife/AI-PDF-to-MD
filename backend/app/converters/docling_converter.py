import logging
from typing import List
from .base import BaseConverter
from docling.document_converter import DocumentConverter

logger = logging.getLogger(__name__)

class DoclingConverter(BaseConverter):
    @property
    def supported_extensions(self) -> List[str]:
        return [".pdf", ".docx", ".pptx", ".xlsx", ".html"]

    @property
    def name(self) -> str:
        return "docling"

    async def convert(self, file_path: str, output_dir: str) -> str:
        try:
            logger.info(f"Converting {file_path} using DoclingConverter")
            converter = DocumentConverter()
            result = converter.convert(file_path)
            markdown_content = result.document.export_to_markdown()
            return markdown_content
        except Exception as e:
            logger.error(f"Docling conversion failed for {file_path}: {str(e)}")
            raise e
