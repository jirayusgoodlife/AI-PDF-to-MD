from pydantic import BaseModel
from typing import Optional, List

class ConversionRequest(BaseModel):
    engine: str = "docling"
    ocr_enabled: bool = True
    force_ocr: bool = False
    llm_enabled: bool = False
    rag_mode: bool = False
    chunk_size: int = 4000

class ConversionResponse(BaseModel):
    task_id: str
    status: str
    filename: str
    engine: str
    output_url: str
    chunks_url: Optional[str] = None
    message: str

class ConversionStatus(BaseModel):
    task_id: str
    status: str
    progress: int
    current_step: str
    message: str

class LLMSettings(BaseModel):
    base_url: str = "http://localhost:11434/v1"
    model: str = "llama3.1"
    api_key: str = "ollama"
    enabled: bool = False
    temperature: float = 0.3
    system_prompt: str = ""

class LLMStatusResponse(BaseModel):
    connected: bool
    model: str
    base_url: str
    error: Optional[str] = None

class ChunkMetadata(BaseModel):
    source: str
    page: Optional[int] = None
    heading_path: List[str] = []
    chunk_index: int
    total_chunks: int

class RAGChunk(BaseModel):
    content: str
    metadata: ChunkMetadata

class RAGOutput(BaseModel):
    chunks: List[RAGChunk]
    total_chunks: int
    source_file: str
