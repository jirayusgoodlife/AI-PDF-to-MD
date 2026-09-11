import asyncio
import logging
import os
from typing import List, Optional
from .base import BaseConverter
from docling.document_converter import DocumentConverter, PdfFormatOption, ImageFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractCliOcrOptions, OcrMode
from docling.datamodel.base_models import InputFormat

logger = logging.getLogger(__name__)

def is_scanned_pdf(file_path: str, max_check_pages: int = 3) -> bool:
    """Detect if a PDF is a scanned document / photocopy with minimal or no programmatic text."""
    try:
        import pypdfium2 as pdfium
        doc = pdfium.PdfDocument(file_path)
        total_text = 0
        pages_to_check = min(len(doc), max_check_pages)
        for i in range(pages_to_check):
            page_text = doc[i].get_textpage().get_text_range()
            total_text += len(page_text.strip())
        return total_text < 25
    except Exception as e:
        logger.debug(f"Failed to check text layer of {file_path}: {e}")
        return False

class DoclingConverter(BaseConverter):
    def __init__(
        self,
        ocr_enabled: bool = True,
        force_ocr: bool = False,
        ocr_lang: Optional[List[str]] = None
    ):
        self.ocr_enabled = ocr_enabled
        self.force_ocr = force_ocr
        self.ocr_lang = ocr_lang or ["tha", "eng"]

    @property
    def supported_extensions(self) -> List[str]:
        return [
            ".pdf", ".docx", ".pptx", ".xlsx", ".html",
            ".png", ".jpg", ".jpeg", ".webp", ".tiff", ".tif", ".bmp"
        ]

    @property
    def name(self) -> str:
        return "docling"

    async def convert(self, file_path: str, output_dir: str) -> str:
        try:
            ext = os.path.splitext(file_path)[1].lower()
            logger.info(
                f"Converting {file_path} using DoclingConverter "
                f"(OCR={self.ocr_enabled}, ForceOCR={self.force_ocr}, Langs={self.ocr_lang})"
            )

            def _convert_sync():
                pipeline_options = PdfPipelineOptions()
                pipeline_options.do_ocr = self.ocr_enabled

                is_scan = False
                if ext == ".pdf":
                    is_scan = is_scanned_pdf(file_path)
                    if is_scan:
                        logger.info(f"Detected scanned/photocopy PDF for {file_path}. Using Full Page OCR.")

                use_full_page = self.force_ocr or is_scan or (ext != ".pdf")

                if self.ocr_enabled:
                    pipeline_options.ocr_options = TesseractCliOcrOptions(
                        lang=self.ocr_lang,
                        mode=OcrMode.FULL_PAGE if use_full_page else OcrMode.PDF_AWARE_LAYOUT_REGIONS
                    )

                format_options = {
                    InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options),
                    InputFormat.IMAGE: ImageFormatOption(pipeline_options=pipeline_options)
                }

                converter = DocumentConverter(format_options=format_options)
                result = converter.convert(file_path)
                return result.document.export_to_markdown()

            markdown_content = await asyncio.to_thread(_convert_sync)
            return markdown_content
        except Exception as e:
            logger.error(f"Docling conversion failed for {file_path}: {str(e)}")
            raise e

