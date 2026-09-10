from fastapi import APIRouter

router = APIRouter()

@router.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "version": "1.0.2",
        "supported_engines": ["docling", "marker"],
        "supported_formats": [".pdf", ".docx", ".pptx", ".xlsx", ".html"]
    }
