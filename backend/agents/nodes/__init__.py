"""
CompareIQ AI — Agent Nodes
Each node is an async function: (state) -> state
Groq handles speed-critical steps; OpenAI handles deep reasoning.
"""

from __future__ import annotations
import json
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


# ─── LLM clients (lazy-loaded) ────────────────────────────────────────────────
def _groq():
    from langchain_groq import ChatGroq
    from core.config import settings
    return ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL_SMART, temperature=0.1)


def _openai():
    from langchain_openai import ChatOpenAI
    from core.config import settings
    return ChatOpenAI(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL_REASON, temperature=0.2)


def _parse_json(raw: str) -> Dict[str, Any]:
    """Safely parse JSON from LLM response."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        import re
        m = re.search(r"\{.*\}", raw, re.DOTALL)
        if m:
            return json.loads(m.group())
        return {"raw": raw}


# ─── Intent Node (Groq) ───────────────────────────────────────────────────────
async def run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Understand user intent, infer criteria, select comparison lens."""
    request = state["request"]
    llm = _groq()

    prompt = f"""You are an AI comparison assistant. Parse this user intent and return JSON.

Intent: "{request.intent}"
Entities: {[e.label or e.id for e in request.entities]}
Persona: {request.persona}
Decision mode: {request.decision_mode}

Return ONLY valid JSON with keys:
- goal (string): refined goal statement
- inferred_criteria (list of strings): up to 8 relevant comparison criteria
- domain (string): product/country/document/vendor/policy/other
- user_priorities (list): ranked priorities inferred from intent
- comparison_lens (string): the main framing for comparison
"""
    response = await llm.ainvoke([{"role": "user", "content": prompt}])
    intent_data = _parse_json(response.content)
    logger.info("[IntentNode] domain=%s, criteria=%s", intent_data.get("domain"), intent_data.get("inferred_criteria"))

    return {**state, "intent_data": intent_data, "completed_steps": state["completed_steps"] + ["intent"]}


# Export as module-level for import
import sys
import types

# Create submodule stubs for each node
# (In real project, each would be its own file)
_node_modules = [
    "intent_node", "ingest_node", "extract_node", "normalize_node",
    "evidence_node", "compare_node", "contradict_node",
    "score_node", "recommend_node", "report_node"
]


# ─── Ingest Node (dispatcher) ─────────────────────────────────────────────────
async def _ingest_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Read raw content from each entity (text passthrough; files already parsed)."""
    request = state["request"]
    raw_contents: Dict[str, str] = {}

    for entity in request.entities:
        if entity.input_type == "text":
            raw_contents[entity.id] = entity.content or ""
        elif entity.input_type == "url":
            from services.parsing.url_parser import fetch_url
            result = await fetch_url(entity.content or "")
            raw_contents[entity.id] = result.get("text", "")
        elif entity.file_path:
            from pathlib import Path
            p = Path(entity.file_path)
            if p.exists():
                raw_contents[entity.id] = p.read_text(errors="ignore")[:50_000]

    return {**state, "raw_contents": raw_contents, "completed_steps": state["completed_steps"] + ["ingest"]}


# ─── Extract Node (Groq) ──────────────────────────────────────────────────────
async def _extract_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Extract structured facts from raw content for each entity."""
    raw_contents = state.get("raw_contents") or {}
    intent_data = state.get("intent_data") or {}
    criteria = intent_data.get("inferred_criteria", [])
    llm = _groq()
    structured_facts: Dict[str, Any] = {}

    for entity_id, text in raw_contents.items():
        prompt = f"""Extract structured facts from this content. Focus on these criteria: {criteria}
Content (first 4000 chars): {text[:4000]}

Return ONLY valid JSON:
{{
  "name": "entity name if found",
  "facts": {{"criterion": "value", ...}},
  "key_claims": ["claim1", "claim2", ...],
  "metadata": {{"source_date": null, "source_type": "text"}}
}}"""
        resp = await llm.ainvoke([{"role": "user", "content": prompt}])
        structured_facts[entity_id] = _parse_json(resp.content)

    return {**state, "structured_facts": structured_facts, "completed_steps": state["completed_steps"] + ["extract"]}


# ─── Normalize Node (Groq) ────────────────────────────────────────────────────
async def _normalize_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize units, currencies, dates, and terminology across entities."""
    facts = state.get("structured_facts") or {}
    llm = _groq()

    all_facts_json = json.dumps(facts, indent=2)
    prompt = f"""Normalize these structured facts for fair comparison.
- Standardize all currencies to USD
- Standardize all weights to kg, distances to km
- Normalize date formats to ISO 8601
- Unify terminology (e.g. "RAM" and "Memory" → "RAM")
- Fill obvious missing equivalents (e.g. price in INR → add USD)

Input: {all_facts_json[:6000]}

Return the same structure with normalized values, plus a "normalization_notes" key listing what was changed."""
    resp = await llm.ainvoke([{"role": "user", "content": prompt}])
    normalized = _parse_json(resp.content)

    return {**state, "normalized_facts": normalized, "completed_steps": state["completed_steps"] + ["normalize"]}


# ─── Evidence Node (Qdrant + Groq) ───────────────────────────────────────────
async def _evidence_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Retrieve supporting evidence from Qdrant vector store."""
    # Stub: in production, embed queries and search Qdrant
    evidence_snippets = [
        {
            "text": "Evidence retrieved from knowledge base",
            "source_type": "text",
            "source_ref": "internal_kb",
            "confidence": 0.85,
        }
    ]
    return {**state, "evidence_snippets": evidence_snippets, "completed_steps": state["completed_steps"] + ["evidence"]}


# ─── Compare Node (Groq) ──────────────────────────────────────────────────────
async def _compare_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Build side-by-side comparison matrix."""
    facts = state.get("normalized_facts") or {}
    intent = state.get("intent_data") or {}
    llm = _groq()

    prompt = f"""Build a comparison matrix for these entities.
Criteria: {intent.get("inferred_criteria", [])}
Facts: {json.dumps(facts, indent=2)[:5000]}

Return JSON:
{{
  "comparison_rows": [
    {{"criterion": "...", "entity_id": "...", "value": "...", "advantage": "A|B|tie"}}
  ],
  "similarities": ["..."],
  "key_differences": ["..."]
}}"""
    resp = await llm.ainvoke([{"role": "user", "content": prompt}])
    matrix = _parse_json(resp.content)

    return {**state, "comparison_matrix": matrix, "completed_steps": state["completed_steps"] + ["compare"]}


# ─── Contradiction Node (OpenAI) ──────────────────────────────────────────────
async def _contradict_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Detect conflicting claims across sources — uses OpenAI for deep reasoning."""
    facts = state.get("normalized_facts") or {}
    llm = _openai()

    prompt = f"""Analyze these entity facts and identify contradictions, conflicts, or suspicious inconsistencies.
Facts: {json.dumps(facts, indent=2)[:5000]}

Return JSON:
{{
  "contradictions": [
    {{
      "claim_a": "...", "claim_b": "...",
      "source_a": "entity_id", "source_b": "entity_id",
      "severity": "low|medium|high",
      "resolution_note": "..."
    }}
  ],
  "reliability_flags": ["..."],
  "missing_data_warnings": ["..."]
}}"""
    resp = await llm.ainvoke([{"role": "user", "content": prompt}])
    result = _parse_json(resp.content)

    return {**state, "contradictions": result.get("contradictions", []), "completed_steps": state["completed_steps"] + ["contradict"]}


# ─── Score Node (Groq) ────────────────────────────────────────────────────────
async def _score_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Score each entity per criterion with weighted total."""
    request = state["request"]
    facts = state.get("normalized_facts") or {}
    criteria = request.criteria
    llm = _groq()

    prompt = f"""Score each entity on each criterion from 0-100. Be objective and evidence-based.
Entities: {[e.id for e in request.entities]}
Criteria with weights: {[c.dict() for c in criteria]}
Facts: {json.dumps(facts, indent=2)[:5000]}
Persona: {request.persona}, Decision mode: {request.decision_mode}

Return JSON:
{{
  "criterion_scores": [
    {{"entity_id": "...", "criterion": "...", "score": 85, "rationale": "..."}}
  ],
  "final_scores": [
    {{"entity_id": "...", "total_score": 88.5, "rank": 1}}
  ]
}}"""
    resp = await llm.ainvoke([{"role": "user", "content": prompt}])
    result = _parse_json(resp.content)

    return {
        **state,
        "criterion_scores": result.get("criterion_scores", []),
        "final_scores": result.get("final_scores", []),
        "completed_steps": state["completed_steps"] + ["score"],
    }


# ─── Recommend Node (OpenAI) ──────────────────────────────────────────────────
async def _recommend_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Generate final recommendation tailored to persona and decision mode."""
    request = state["request"]
    scores = state.get("final_scores") or []
    matrix = state.get("comparison_matrix") or {}
    contradictions = state.get("contradictions") or []
    llm = _openai()

    winner = max(scores, key=lambda s: s.get("total_score", 0)) if scores else None

    prompt = f"""You are a decision intelligence AI. Based on this analysis, produce a clear recommendation.

Winner candidate: {winner}
Full scores: {json.dumps(scores, indent=2)}
Key differences: {matrix.get("key_differences", [])}
Contradictions found: {len(contradictions)}
Persona: {request.persona}
Decision mode: {request.decision_mode}
User intent: {request.intent}

Return JSON:
{{
  "winner_id": "...",
  "winner_label": "...",
  "executive_summary": "3-4 sentence decision-ready summary",
  "winner_rationale": "Detailed explanation of why this entity wins for this persona",
  "pros_winner": ["..."],
  "cons_winner": ["..."],
  "when_to_choose_other": "Context where the runner-up might be better",
  "confidence": 0.87,
  "follow_up_suggestions": ["...", "...", "..."]
}}"""
    resp = await llm.ainvoke([{"role": "user", "content": prompt}])
    recommendation = _parse_json(resp.content)

    return {**state, "recommendation": recommendation, "completed_steps": state["completed_steps"] + ["recommend"]}


# ─── Report Node (OpenAI) ─────────────────────────────────────────────────────
async def _report_run(state: Dict[str, Any]) -> Dict[str, Any]:
    """Compile final structured report for UI rendering and export."""
    recommendation = state.get("recommendation") or {}
    scores = state.get("final_scores") or []
    contradictions = state.get("contradictions") or []
    criterion_scores = state.get("criterion_scores") or []
    evidence = state.get("evidence_snippets") or []
    missing = state.get("missing_data_warnings") or []

    report = {
        "executive_summary": recommendation.get("executive_summary"),
        "winner_id": recommendation.get("winner_id"),
        "winner_label": recommendation.get("winner_label"),
        "winner_rationale": recommendation.get("winner_rationale"),
        "scores": scores,
        "criterion_scores": criterion_scores,
        "contradictions": contradictions,
        "evidence": evidence,
        "trust": {
            "confidence": recommendation.get("confidence", 0.8),
            "completeness": 0.75,
            "freshness": 0.9,
            "contradiction_count": len(contradictions),
            "missing_fields": missing,
            "uncertainty_warnings": [],
        },
        "follow_up_suggestions": recommendation.get("follow_up_suggestions", []),
        "completed_steps": state.get("completed_steps", []),
    }

    return {**state, "report": report, "completed_steps": state["completed_steps"] + ["report"]}


# ─── Export node runners as module attributes ─────────────────────────────────
# This file also serves as the nodes package entry. In the full project each
# node would be its own file in agents/nodes/. We bind them here for clarity.

class _NodeModule(types.ModuleType):
    run: Any


def _make_node(fn) -> _NodeModule:
    m = _NodeModule(fn.__name__)
    m.run = fn
    return m


# Expose as importable modules
import importlib

intent_node = _make_node(run)               # uses the intent run defined above
ingest_node = _make_node(_ingest_run)
extract_node = _make_node(_extract_run)
normalize_node = _make_node(_normalize_run)
evidence_node = _make_node(_evidence_run)
compare_node = _make_node(_compare_run)
contradict_node = _make_node(_contradict_run)
score_node = _make_node(_score_run)
recommend_node = _make_node(_recommend_run)
report_node = _make_node(_report_run)
