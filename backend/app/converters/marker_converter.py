import logging
from typing import List
from .base import BaseConverter

logger = logging.getLogger(__name__)

class MarkerConverter(BaseConverter):
    @property
    def supported_extensions(self) -> List[str]:
        return [".pdf"]

    @property
    def name(self) -> str:
        return "marker"

    async def convert(self, file_path: str, output_dir: str) -> str:
        try:
            from marker.converters.pdf import PdfConverter
            from marker.config.parser import ConfigParser
        except ImportError as e:
            logger.error(f"Marker dependencies are not installed: {str(e)}")
            raise RuntimeError(
                f"Marker engine is unavailable because required dependencies are missing ({str(e)}). "
                f"Please switch to Docling engine."
            ) from e

        try:
            logger.info(f"Converting {file_path} using MarkerConverter")
            config_parser = ConfigParser({})
            converter = PdfConverter(
                config=config_parser.generate_config_dict(),
                artifact_dict=config_parser.get_artifacts_dict(),
                processor_list=config_parser.get_processors()
            )
            rendered = converter(file_path)
            
            # marker returns a tuple or object, extracting markdown
            if hasattr(rendered, "markdown"):
                return rendered.markdown
            elif isinstance(rendered, tuple) and len(rendered) > 0:
                return rendered[0]
            else:
                return str(rendered)
        except Exception as e:
            logger.error(f"Marker conversion failed for {file_path}: {str(e)}")
            raise e
