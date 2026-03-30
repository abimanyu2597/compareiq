"""
Ingest Router — Multimodal file upload and parsing endpoints.
POST /ingest/pdf | /ingest/url | /ingest/audio | /ingest/image
"""

import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from schemas.models import IngestResponse
from services.parsing.pdf_parser import parse_pdf
from services.parsing.url_parser import fetch_url
from services.parsing.audio_parser import transcribe_audio
from services.parsing.image_parser import describe_image

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = Path("/tmp/compareiq_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_MB = 50


def _save_upload(file: UploadFile) -> Path:
    ext = Path(file.filename or "file").suffix
    dest = UPLOAD_DIR / f"{uuid.uuid4()}{ext}"
    dest.write_bytes(file.file.read())
    return dest


# ─── PDF ──────────────────────────────────────────────────────────────────────
@router.post("/pdf", response_model=IngestResponse)
async def ingest_pdf(file: UploadFile = File(...)):
    """Upload and parse a PDF — returns extracted text preview and page count."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files accepted")

    size = 0
    chunks = []
    while chunk := file.file.read(1024 * 1024):
        size += len(chunk)
        chunks.append(chunk)
        if size > MAX_FILE_MB * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"File exceeds {MAX_FILE_MB}MB limit")
    data = b"".join(chunks)

    file_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{file_id}.pdf"
    dest.write_bytes(data)

    try:
        parsed = await parse_pdf(dest)
        return IngestResponse(
            file_id=file_id,
            input_type="pdf",
            filename=file.filename,
            size_bytes=size,
            parsed_text_preview=parsed["text"][:200],
            page_count=parsed["pages"],
            status="ok",
        )
    except Exception as exc:
        logger.exception("PDF parse failed: %s", exc)
        return IngestResponse(file_id=file_id, input_type="pdf", filename=file.filename or "",
                              size_bytes=size, status="error", message=str(exc))


# ─── URL ──────────────────────────────────────────────────────────────────────
@router.post("/url", response_model=IngestResponse)
async def ingest_url(url: str = Form(...)):
    """Fetch and extract text content from a web URL."""
    file_id = str(uuid.uuid4())
    try:
        result = await fetch_url(url)
        return IngestResponse(
            file_id=file_id,
            input_type="url",
            filename=url[:60],
            size_bytes=len(result["text"].encode()),
            parsed_text_preview=result["text"][:200],
            status="ok",
        )
    except Exception as exc:
        logger.exception("URL fetch failed: %s", exc)
        return IngestResponse(file_id=file_id, input_type="url", filename=url, size_bytes=0,
                              status="error", message=str(exc))


# ─── Audio ────────────────────────────────────────────────────────────────────
@router.post("/audio", response_model=IngestResponse)
async def ingest_audio(file: UploadFile = File(...)):
    """Upload and transcribe audio using OpenAI Whisper."""
    allowed = {".mp3", ".wav", ".m4a", ".ogg", ".webm"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported audio format. Allowed: {allowed}")

    dest = _save_upload(file)
    file_id = dest.stem

    try:
        result = await transcribe_audio(dest)
        return IngestResponse(
            file_id=file_id,
            input_type="audio",
            filename=file.filename or "",
            size_bytes=dest.stat().st_size,
            parsed_text_preview=result["transcript"][:200],
            duration_seconds=result.get("duration"),
            status="ok",
        )
    except Exception as exc:
        logger.exception("Audio transcription failed: %s", exc)
        return IngestResponse(file_id=file_id, input_type="audio", filename=file.filename or "",
                              size_bytes=0, status="error", message=str(exc))


# ─── Image ────────────────────────────────────────────────────────────────────
@router.post("/image", response_model=IngestResponse)
async def ingest_image(file: UploadFile = File(...)):
    """Upload an image and extract textual description via GPT-4o vision."""
    allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported image format. Allowed: {allowed}")

    dest = _save_upload(file)
    file_id = dest.stem

    try:
        result = await describe_image(dest)
        return IngestResponse(
            file_id=file_id,
            input_type="image",
            filename=file.filename or "",
            size_bytes=dest.stat().st_size,
            parsed_text_preview=result["description"][:200],
            status="ok",
        )
    except Exception as exc:
        logger.exception("Image description failed: %s", exc)
        return IngestResponse(file_id=file_id, input_type="image", filename=file.filename or "",
                              size_bytes=0, status="error", message=str(exc))
