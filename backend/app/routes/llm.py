from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..config import settings
from ..models import LLMSettings, LLMStatusResponse
from ..llm.client import LLMClient

router = APIRouter()

@router.get("/api/llm/status", response_model=LLMStatusResponse)
async def check_status():
    client = LLMClient(settings.LLM_BASE_URL, settings.LLM_API_KEY, settings.LLM_MODEL)
    connected, error = await client.check_connection()
    return LLMStatusResponse(
        connected=connected,
        model=settings.LLM_MODEL,
        base_url=settings.LLM_BASE_URL,
        error=error
    )

@router.get("/api/llm/settings", response_model=LLMSettings)
async def get_settings():
    return LLMSettings(
        base_url=settings.LLM_BASE_URL,
        model=settings.LLM_MODEL,
        api_key=settings.LLM_API_KEY,
        enabled=settings.LLM_ENABLED,
        temperature=0.3,
        system_prompt=""
    )

@router.post("/api/llm/settings")
async def update_settings(new_settings: LLMSettings):
    settings.LLM_BASE_URL = new_settings.base_url
    settings.LLM_MODEL = new_settings.model
    settings.LLM_API_KEY = new_settings.api_key
    settings.LLM_ENABLED = new_settings.enabled
    return {"message": "Settings updated"}

class TestRequest(BaseModel):
    text: str

@router.post("/api/llm/test")
async def test_llm(req: TestRequest):
    if not settings.LLM_ENABLED:
        raise HTTPException(status_code=400, detail="LLM is not enabled")
        
    client = LLMClient(settings.LLM_BASE_URL, settings.LLM_API_KEY, settings.LLM_MODEL)
    from ..llm.thai_corrector import THAI_CORRECTION_SYSTEM_PROMPT
    
    try:
        result = await client.complete(THAI_CORRECTION_SYSTEM_PROMPT, req.text)
        return {"original": req.text, "corrected": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
