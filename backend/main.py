"""
CompareIQ AI — FastAPI Backend
Author: Raja Abimanyu N | Data Scientist | AI & Applied Machine Learning

Run from anywhere:
    uvicorn backend.main:app --reload --port 8000   (from project root)
    uvicorn main:app --reload --port 8000            (from backend/ folder)
"""

import sys
import os
import logging
from contextlib import asynccontextmanager

# ── Path fix ──────────────────────────────────────────────────────────────────
# Ensures imports like `from core.config import settings` work whether uvicorn
# is launched from the project root OR from inside the backend/ folder.
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

# Change CWD so .env and compareiq.db are found relative to backend/
os.chdir(_BACKEND_DIR)

# ── Now safe to import local modules ─────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from core.database import init_db
from core.redis_client import init_redis
from routers import compare, ingest, chat, monitoring, export, auth

# ── Logger ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s — %(message)s",
)
logger = logging.getLogger("compareiq")


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 CompareIQ AI starting up…")
    await init_db()
    logger.info("✅ Database initialized (SQLite)")
    try:
        await init_redis()
        logger.info("✅ Redis initialized")
    except Exception as exc:
        logger.warning("⚠️  Redis not available (%s) — SSE streaming disabled", exc)
    yield
    logger.info("🛑 CompareIQ AI shutting down…")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CompareIQ AI",
    description="Real-time multimodal decision intelligence platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(compare.router,    prefix="/api/compare",    tags=["Compare"])
app.include_router(ingest.router,     prefix="/api/ingest",     tags=["Ingest"])
app.include_router(chat.router,       prefix="/api/chat",       tags=["Chat"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Monitoring"])
app.include_router(export.router,     prefix="/api/export",     tags=["Export"])


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health():
    return JSONResponse({
        "status": "ok",
        "service": "CompareIQ AI",
        "version": "1.0.0",
        "docs": "/api/docs",
    })


@app.get("/", tags=["System"])
async def root():
    return {"message": "CompareIQ AI is running — visit /api/docs for the API reference"}