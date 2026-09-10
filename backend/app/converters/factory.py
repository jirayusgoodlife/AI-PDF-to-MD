import logging
from .base import BaseConverter
from .docling_converter import DoclingConverter

logger = logging.getLogger(__name__)

def get_converter(engine: str, file_extension: str) -> BaseConverter:
    ext = file_extension.lower()
    if engine.lower() == "marker":
        if ext == ".pdf":
            try:
                from .marker_converter import MarkerConverter
                return MarkerConverter()
            except Exception as e:
                logger.warning(f"MarkerConverter unavailable ({e}). Falling back to Docling.")
                return DoclingConverter()
        else:
            logger.warning(f"Marker requested but unsupported extension {ext}. Falling back to Docling.")
            return DoclingConverter()
    
    return DoclingConverter()
