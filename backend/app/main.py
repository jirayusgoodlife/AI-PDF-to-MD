import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
import logging

from .config import settings
from .routes import health, convert, llm

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# Resolve paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    logger.info("=" * 60)
    logger.info("🚀 AI-PDF-to-MD Server Starting")
    logger.info(f"   Frontend: {FRONTEND_DIR} ({'✅ Found' if FRONTEND_DIR.exists() else '❌ Not found'})")
    logger.info(f"   LLM: {'✅ Enabled' if settings.LLM_ENABLED else '⏸️ Disabled'} ({settings.LLM_BASE_URL})")
    logger.info(f"   Engine: {settings.DEFAULT_ENGINE}")
    logger.info("=" * 60)
    yield
    logger.info("Server shutting down.")

app = FastAPI(
    title="AI PDF to MD Converter",
    description="แปลงเอกสาร PDF, Word, PowerPoint, Excel เป็น Markdown สำหรับ RAG พร้อม Local LLM แก้ไขภาษาไทย",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(convert.router)
app.include_router(llm.router)

# Mount frontend static files
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

@app.get("/")
async def root():
    """Redirect to frontend or API health check."""
    if FRONTEND_DIR.exists():
        return FileResponse(str(FRONTEND_DIR / "index.html"))
    return RedirectResponse(url="/api/health")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
