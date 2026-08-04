import os
import uuid
import logging
import aiofiles
from typing import Dict, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from ..config import settings
from ..models import ConversionResponse, ConversionStatus
from ..converters.factory import get_converter
from ..llm.client import LLMClient
from ..llm.post_processor import PostProcessor
from ..chunking.rag_chunker import RAGChunker

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for conversion status
conversion_tasks: Dict[str, ConversionStatus] = {}

def get_task_status(task_id: str) -> Optional[ConversionStatus]:
    return conversion_tasks.get(task_id)

@router.post("/api/convert", response_model=ConversionResponse)
async def convert_document(
    file: UploadFile = File(...),
    engine: str = Form(settings.DEFAULT_ENGINE),
    llm_enabled: bool = Form(False),
    rag_mode: bool = Form(False),
    chunk_size: int = Form(4000)
):
    task_id = str(uuid.uuid4())
    
    conversion_tasks[task_id] = ConversionStatus(
        task_id=task_id,
        status="pending",
        progress=0,
        current_step="Initializing",
        message="Upload started"
    )
    
    try:
        # Create directories if they don't exist
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
        
        # Determine extension
        ext = os.path.splitext(file.filename or "")[1].lower()
        if not ext:
            raise HTTPException(status_code=400, detail="File extension missing")
            
        file_path = os.path.join(settings.UPLOAD_DIR, f"{task_id}{ext}")
        
        conversion_tasks[task_id].status = "processing"
        conversion_tasks[task_id].progress = 10
        conversion_tasks[task_id].current_step = "Saving file"
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        # Convert
        conversion_tasks[task_id].progress = 30
        conversion_tasks[task_id].current_step = f"Converting with {engine}"
        
        converter = get_converter(engine, ext)
        markdown_content = await converter.convert(file_path, settings.OUTPUT_DIR)
        
        # Post processing & LLM
        conversion_tasks[task_id].progress = 60
        conversion_tasks[task_id].current_step = "Post processing"
        
        llm_client = None
        if llm_enabled:
            conversion_tasks[task_id].status = "correcting"
            conversion_tasks[task_id].current_step = "LLM Correction"
            llm_client = LLMClient(settings.LLM_BASE_URL, settings.LLM_API_KEY, settings.LLM_MODEL)
            
        processor = PostProcessor(llm_client)
        final_markdown = await processor.process(markdown_content, llm_enabled=llm_enabled)
        
        # Save markdown
        out_md_path = os.path.join(settings.OUTPUT_DIR, f"{task_id}.md")
        async with aiofiles.open(out_md_path, 'w', encoding='utf-8') as f:
            await f.write(final_markdown)
            
        chunks_url = None
        if rag_mode:
            conversion_tasks[task_id].status = "chunking"
            conversion_tasks[task_id].progress = 80
            conversion_tasks[task_id].current_step = "RAG Chunking"
            
            chunker = RAGChunker()
            rag_output = chunker.chunk_by_headings(final_markdown, file.filename or "unknown", chunk_size)
            
            out_json_path = os.path.join(settings.OUTPUT_DIR, f"{task_id}_rag.json")
            async with aiofiles.open(out_json_path, 'w', encoding='utf-8') as f:
                await f.write(rag_output.model_dump_json(indent=2))
                
            chunks_url = f"/api/convert/{task_id}/download/rag"
            
        # Complete
        conversion_tasks[task_id].status = "completed"
        conversion_tasks[task_id].progress = 100
        conversion_tasks[task_id].current_step = "Done"
        conversion_tasks[task_id].message = "Conversion successful"
        
        return ConversionResponse(
            task_id=task_id,
            status="completed",
            filename=file.filename or "unknown",
            engine=converter.name,
            output_url=f"/api/convert/{task_id}/download",
            chunks_url=chunks_url,
            message="Success"
        )
        
    except Exception as e:
        logger.error(f"Error in convert endpoint: {str(e)}")
        if task_id in conversion_tasks:
            conversion_tasks[task_id].status = "error"
            conversion_tasks[task_id].message = str(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/convert/{task_id}/status", response_model=ConversionStatus)
async def get_status(task_id: str):
    status = get_task_status(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="Task not found")
    return status

@router.get("/api/convert/{task_id}/download")
async def download_md(task_id: str):
    file_path = os.path.join(settings.OUTPUT_DIR, f"{task_id}.md")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="text/markdown", filename=f"{task_id}.md")

@router.get("/api/convert/{task_id}/download/rag")
async def download_rag(task_id: str):
    file_path = os.path.join(settings.OUTPUT_DIR, f"{task_id}_rag.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/json", filename=f"{task_id}_rag.json")

@router.get("/api/history")
async def get_history():
    history = []
    if os.path.exists(settings.OUTPUT_DIR):
        for f in os.listdir(settings.OUTPUT_DIR):
            if f.endswith(".md"):
                task_id = f.replace(".md", "")
                status = conversion_tasks.get(task_id)
                history.append({
                    "task_id": task_id,
                    "filename": f,
                    "status": status.status if status else "completed",
                    "output_url": f"/api/convert/{task_id}/download"
                })
    return history
