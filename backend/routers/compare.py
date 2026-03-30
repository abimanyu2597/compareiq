"""
Compare Router — POST /compare, GET /compare/{id}/status (SSE), GET /compare/{id}
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from fastapi.responses import StreamingResponse

from schemas.models import (
    CompareRequest, ComparisonResult, ComparisonStatusResponse, PipelineEvent
)
from agents.graph.comparison_graph import run_comparison_graph

logger = logging.getLogger(__name__)
router = APIRouter()


# ─── In-memory store (replace with Postgres in production) ───────────────────
_jobs: dict[str, dict] = {}


# ─── POST /compare ────────────────────────────────────────────────────────────
@router.post("/", response_model=ComparisonStatusResponse, status_code=202)
async def create_comparison(req: CompareRequest, background: BackgroundTasks):
    """
    Kick off a comparison job asynchronously.
    Returns job ID immediately; client polls SSE /compare/{id}/status for live updates.
    """
    job_id = str(uuid.uuid4())
    now = datetime.utcnow()

    _jobs[job_id] = {
        "id": job_id,
        "status": "pending",
        "current_step": None,
        "progress": 0.0,
        "request": req.dict(),
        "created_at": now.isoformat(),
        "result": None,
        "error": None,
    }

    background.add_task(_run_job, job_id, req)
    logger.info("Comparison job %s created for intent: %s", job_id, req.intent[:60])

    return ComparisonStatusResponse(id=job_id, status="pending", progress=0.0)


# ─── Background job runner ────────────────────────────────────────────────────
async def _run_job(job_id: str, req: CompareRequest):
    # Try to get Redis for pub/sub; degrade gracefully if unavailable
    try:
        from core.redis_client import get_redis
        redis = await get_redis()
        pubsub_available = True
    except Exception:
        redis = None
        pubsub_available = False

    channel = f"compareiq:job:{job_id}"

    async def emit(event: str, step: str | None = None, detail: str | None = None, data: dict | None = None):
        payload = PipelineEvent(event=event, step=step, detail=detail, data=data)
        if pubsub_available and redis:
            try:
                await redis.publish(channel, payload.json())
            except Exception:
                pass
        if step:
            _jobs[job_id]["current_step"] = step

    try:
        _jobs[job_id]["status"] = "running"

        steps = [
            ("ingest", "Ingesting inputs"),
            ("parse", "Parsing content"),
            ("extract", "Extracting structured facts"),
            ("normalize", "Normalizing fields"),
            ("evidence", "Retrieving evidence"),
            ("score", "Scoring entities"),
            ("contradict", "Running contradiction check"),
            ("recommend", "Generating recommendation"),
            ("report", "Building final report"),
        ]
        total = len(steps)

        for i, (step_id, step_label) in enumerate(steps):
            await emit("step_start", step=step_label)
            _jobs[job_id]["progress"] = i / total

            # Hand off to LangGraph
            result = await run_comparison_graph(
                job_id=job_id,
                step=step_id,
                request=req,
            )

            await emit("step_done", step=step_label, data={"result_preview": str(result)[:80]})
            _jobs[job_id]["progress"] = (i + 1) / total

        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["progress"] = 1.0
        await emit("comparison_done", data={"job_id": job_id})

    except Exception as exc:
        logger.exception("Job %s failed: %s", job_id, exc)
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["error"] = str(exc)
        await emit("comparison_error", detail=str(exc))


# ─── GET /compare/{id}/status — SSE ──────────────────────────────────────────
@router.get("/{job_id}/status")
async def stream_status(job_id: str, request: Request):
    """
    Server-Sent Events endpoint. Client subscribes here for live pipeline updates.
    """
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Comparison not found")

    redis = await get_redis()
    channel = f"compareiq:job:{job_id}"
    pubsub = redis.pubsub()
    await pubsub.subscribe(channel)

    async def event_generator():
        try:
            async for message in pubsub.listen():
                if await request.is_disconnected():
                    break
                if message["type"] == "message":
                    data = message["data"]
                    if isinstance(data, bytes):
                        data = data.decode()
                    yield f"data: {data}\n\n"

                # Also send current status every poll
                job = _jobs.get(job_id, {})
                status_payload = json.dumps({
                    "event": "status_poll",
                    "status": job.get("status"),
                    "progress": job.get("progress", 0),
                    "current_step": job.get("current_step"),
                })
                yield f"data: {status_payload}\n\n"

                if job.get("status") in ("done", "error"):
                    break
        finally:
            await pubsub.unsubscribe(channel)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


# ─── GET /compare/{id} ────────────────────────────────────────────────────────
@router.get("/{job_id}", response_model=ComparisonStatusResponse)
async def get_comparison(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return ComparisonStatusResponse(
        id=job_id,
        status=job["status"],
        current_step=job.get("current_step"),
        progress=job.get("progress", 0.0),
        error=job.get("error"),
    )


# ─── GET /compare/{id}/history ────────────────────────────────────────────────
@router.get("/", response_model=list[ComparisonStatusResponse])
async def list_comparisons():
    return [
        ComparisonStatusResponse(
            id=j["id"],
            status=j["status"],
            current_step=j.get("current_step"),
            progress=j.get("progress", 0.0),
            error=j.get("error"),
        )
        for j in _jobs.values()
    ]
