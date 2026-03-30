"""
CompareIQ AI — Utility Functions
Shared helpers for response formatting, validation, and formatting.
"""

from __future__ import annotations
import json
import re
import logging
from typing import Any, Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


def parse_llm_json(raw: str) -> Dict[str, Any]:
    """
    Safely parse JSON from an LLM response string.
    Handles markdown fences, leading/trailing whitespace, and partial JSON.
    """
    # Strip markdown code fences
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).strip()
    cleaned = re.sub(r"```\s*$", "", cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to find JSON object in the string
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        logger.warning("Failed to parse LLM JSON: %s…", raw[:100])
        return {"raw_response": raw}


def truncate_text(text: str, max_chars: int = 4000) -> str:
    """Truncate text to max_chars, appending ellipsis if truncated."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "…"


def sanitize_label(label: str) -> str:
    """Clean entity label for display and storage."""
    return label.strip()[:200]


def score_to_grade(score: float) -> str:
    """Convert numeric score (0–100) to a letter grade."""
    if score >= 90: return "A+"
    if score >= 80: return "A"
    if score >= 70: return "B"
    if score >= 60: return "C"
    return "D"


def confidence_label(confidence: float) -> str:
    """Convert confidence float (0–1) to a human label."""
    if confidence >= 0.9: return "Very High"
    if confidence >= 0.75: return "High"
    if confidence >= 0.6: return "Moderate"
    if confidence >= 0.4: return "Low"
    return "Very Low"


def format_bytes(n: int) -> str:
    """Format byte size to a human-readable string."""
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}"
        n //= 1024
    return f"{n:.1f} TB"


def utcnow_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


def build_comparison_prompt_context(
    intent: str,
    persona: str,
    decision_mode: str,
    criteria: list[dict],
    entity_facts: dict[str, Any],
) -> str:
    """
    Build a rich prompt context string for LLM calls.
    Centralizes prompt construction to keep nodes clean.
    """
    criteria_str = ", ".join(f"{c['name']} (weight: {c['weight']}%)" for c in criteria)
    facts_str = json.dumps(entity_facts, indent=2)[:5000]
    return (
        f"User intent: {intent}\n"
        f"Persona: {persona}\n"
        f"Decision mode: {decision_mode}\n"
        f"Criteria (weighted): {criteria_str}\n"
        f"Entity facts:\n{facts_str}"
    )
