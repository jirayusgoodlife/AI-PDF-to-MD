import logging
from .base import BaseConverter
from .docling_converter import DoclingConverter
from .marker_converter import MarkerConverter

logger = logging.getLogger(__name__)

def get_converter(engine: str, file_extension: str) -> BaseConverter:
    ext = file_extension.lower()
    if engine.lower() == "marker":
        if ext == ".pdf":
            return MarkerConverter()
        else:
            logger.warning(f"Marker requested but unsupported extension {ext}. Falling back to Docling.")
            return DoclingConverter()
    
    return DoclingConverter()
