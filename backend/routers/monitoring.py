"""
Monitoring Router — enable/disable live monitoring for comparisons.
"""
import logging
from fastapi import APIRouter, HTTPException
from schemas.models import MonitorRequest, MonitorStatus

logger = logging.getLogger(__name__)
router = APIRouter()

_monitors: dict[str, dict] = {}


@router.post("/{comparison_id}/enable", response_model=MonitorStatus)
async def enable_monitoring(comparison_id: str, req: MonitorRequest):
    """Enable periodic re-checking of a comparison's source URLs and PDFs."""
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    _monitors[comparison_id] = {
        "comparison_id": comparison_id,
        "enabled": True,
        "last_checked": None,
        "next_check": now + timedelta(hours=req.check_interval_hours),
        "change_count": 0,
        "recommendation_shifted": False,
        "latest_delta": None,
    }
    return MonitorStatus(**_monitors[comparison_id])


@router.get("/{comparison_id}", response_model=MonitorStatus)
async def get_monitor_status(comparison_id: str):
    if comparison_id not in _monitors:
        raise HTTPException(status_code=404, detail="Monitoring not configured for this comparison")
    return MonitorStatus(**_monitors[comparison_id])


@router.delete("/{comparison_id}/disable")
async def disable_monitoring(comparison_id: str):
    if comparison_id in _monitors:
        _monitors[comparison_id]["enabled"] = False
    return {"status": "disabled"}


@router.get("/", response_model=list[MonitorStatus])
async def list_monitors():
    return [MonitorStatus(**m) for m in _monitors.values()]
