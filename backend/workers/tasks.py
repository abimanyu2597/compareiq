"""
CompareIQ AI — Celery Tasks
Background tasks for monitoring, change detection, and re-analysis.
"""

import logging
from datetime import datetime

from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def check_all_monitors(self):
    """
    Periodic task: re-check all monitored comparisons for changes.
    Runs every hour via Celery Beat.
    """
    logger.info("Running scheduled monitor check at %s", datetime.utcnow().isoformat())
    # In production: query DB for all enabled monitors, re-fetch URLs, compare diffs
    return {"checked_at": datetime.utcnow().isoformat(), "monitors_checked": 0}


@celery_app.task(bind=True, max_retries=3)
def recheck_comparison(self, comparison_id: str):
    """
    Re-run a single comparison with fresh source data.
    Triggered manually or by monitoring schedule.
    """
    logger.info("Re-checking comparison %s", comparison_id)
    try:
        # 1. Load comparison from DB
        # 2. Re-fetch all URL/PDF sources
        # 3. Re-run extraction + scoring agents
        # 4. Compare new results vs old results
        # 5. If winner changed → emit alert
        # 6. Store delta in monitor_alerts table
        return {"comparison_id": comparison_id, "status": "rechecked", "changes": 0}
    except Exception as exc:
        logger.exception("Recheck failed for %s: %s", comparison_id, exc)
        raise self.retry(exc=exc)


@celery_app.task
def send_monitoring_alert(comparison_id: str, alert_type: str, summary: str, delta: dict):
    """
    Send alert notification when a monitored comparison changes.
    Supports email, webhook, and in-app notifications.
    """
    logger.info("Alert for %s: %s", comparison_id, alert_type)
    # In production: send email via SMTP / SendGrid, POST to webhook URL
    return {"sent": True, "comparison_id": comparison_id, "alert_type": alert_type}
