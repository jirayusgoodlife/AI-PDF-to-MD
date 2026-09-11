from typing import List, Optional
import logging
from .base import BaseConverter
from .docling_converter import DoclingConverter

logger = logging.getLogger(__name__)

def get_converter(
    engine: str,
    file_extension: str,
    ocr_enabled: bool = True,
    force_ocr: bool = False,
    ocr_lang: Optional[List[str]] = None
) -> BaseConverter:
    ext = file_extension.lower()
    if engine.lower() == "marker":
        if ext == ".pdf":
            try:
                from .marker_converter import MarkerConverter
                return MarkerConverter()
            except Exception as e:
                logger.warning(f"MarkerConverter unavailable ({e}). Falling back to Docling.")
                return DoclingConverter(ocr_enabled=ocr_enabled, force_ocr=force_ocr, ocr_lang=ocr_lang)
        else:
            logger.warning(f"Marker requested but unsupported extension {ext}. Falling back to Docling.")
            return DoclingConverter(ocr_enabled=ocr_enabled, force_ocr=force_ocr, ocr_lang=ocr_lang)
    
    return DoclingConverter(ocr_enabled=ocr_enabled, force_ocr=force_ocr, ocr_lang=ocr_lang)

