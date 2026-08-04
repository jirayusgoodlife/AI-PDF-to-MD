from abc import ABC, abstractmethod
from typing import List

class BaseConverter(ABC):
    @property
    @abstractmethod
    def supported_extensions(self) -> List[str]:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def convert(self, file_path: str, output_dir: str) -> str:
        """
        Converts a file to markdown and returns the markdown string.
        """
        pass
