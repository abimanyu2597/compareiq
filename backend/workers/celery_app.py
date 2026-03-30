"""
CompareIQ AI — Celery Worker
Handles background monitoring tasks: periodic re-checks, change detection, alerting.
"""

import logging
from celery import Celery
from core.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery(
    "compareiq",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "check-monitored-comparisons": {
            "task": "workers.tasks.check_all_monitors",
            "schedule": 3600.0,  # every hour
        },
    },
)
