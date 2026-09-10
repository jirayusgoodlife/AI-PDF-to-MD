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

# Resolve frontend directory (supports Docker /app/frontend and local dev ../../frontend)
def get_frontend_dir() -> Path:
    env_path = os.environ.get("FRONTEND_DIR")
    if env_path and Path(env_path).is_dir():
        return Path(env_path)

    current_dir = Path(__file__).resolve().parent  # app directory
    # Docker container: /app/app/main.py -> parent is /app -> /app/frontend
    # Local dev: backend/app/main.py -> parent.parent is root -> root/frontend
    for parent in (current_dir.parent, current_dir.parent.parent):
        candidate = parent / "frontend"
        if candidate.is_dir():
            return candidate

    return current_dir.parent / "frontend"

FRONTEND_DIR = get_frontend_dir()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    logger.info("=" * 60)
    logger.info("🚀 if-doc2md Server Starting")
    logger.info(f"   Frontend: {FRONTEND_DIR} ({'✅ Found' if FRONTEND_DIR.exists() else '❌ Not found'})")
    logger.info(f"   LLM: {'✅ Enabled' if settings.LLM_ENABLED else '⏸️ Disabled'} ({settings.LLM_BASE_URL})")
    logger.info(f"   Engine: {settings.DEFAULT_ENGINE}")
    logger.info("=" * 60)
    yield
    logger.info("Server shutting down.")

app = FastAPI(
    title="if-doc2md",
    description="Convert PDF, Word, PowerPoint, Excel to Markdown for RAG with Local LLM Thai Correction",
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
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    @app.get("/")
    async def root():
        """Redirect to API health check if frontend is not found."""
        return RedirectResponse(url="/api/health")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
