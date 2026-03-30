"""
CompareIQ AI — LangGraph Multi-Agent Comparison Graph

Agent pipeline:
  intent → ingest → extract → normalize → evidence → compare → contradict → score → recommend → report

Uses:
  - Groq (fast): extraction, summarization, JSON structuring, first-pass parsing
  - OpenAI (deep): reasoning, contradiction analysis, final recommendation, report writing
"""

from __future__ import annotations
import logging
from typing import Any, Dict, List, Optional, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

from schemas.models import CompareRequest
from agents.nodes import (
    intent_node,
    ingest_node,
    extract_node,
    normalize_node,
    evidence_node,
    compare_node,
    contradict_node,
    score_node,
    recommend_node,
    report_node,
)

logger = logging.getLogger(__name__)


# ─── Graph State ──────────────────────────────────────────────────────────────
class ComparisonState(TypedDict):
    job_id: str
    request: CompareRequest
    step: str

    # Extracted data per entity
    intent_data: Optional[Dict[str, Any]]
    raw_contents: Optional[Dict[str, str]]       # entity_id → raw text
    structured_facts: Optional[Dict[str, Any]]   # entity_id → structured JSON
    normalized_facts: Optional[Dict[str, Any]]   # entity_id → normalized JSON

    # Evidence
    evidence_snippets: Optional[List[Dict[str, Any]]]

    # Comparison artifacts
    comparison_matrix: Optional[Dict[str, Any]]
    contradictions: Optional[List[Dict[str, Any]]]

    # Scoring
    criterion_scores: Optional[List[Dict[str, Any]]]
    final_scores: Optional[List[Dict[str, Any]]]

    # Output
    recommendation: Optional[Dict[str, Any]]
    report: Optional[Dict[str, Any]]

    # Control
    error: Optional[str]
    completed_steps: List[str]


# ─── Graph Builder ────────────────────────────────────────────────────────────
def build_comparison_graph() -> StateGraph:
    """
    Constructs and compiles the LangGraph state machine.
    Each node is a pure async function that receives and returns ComparisonState.
    """
    graph = StateGraph(ComparisonState)

    # Add all agent nodes
    graph.add_node("intent",     intent_node.run)
    graph.add_node("ingest",     ingest_node.run)
    graph.add_node("extract",    extract_node.run)
    graph.add_node("normalize",  normalize_node.run)
    graph.add_node("evidence",   evidence_node.run)
    graph.add_node("compare",    compare_node.run)
    graph.add_node("contradict", contradict_node.run)
    graph.add_node("score",      score_node.run)
    graph.add_node("recommend",  recommend_node.run)
    graph.add_node("report",     report_node.run)

    # Linear pipeline edges
    graph.set_entry_point("intent")
    graph.add_edge("intent",     "ingest")
    graph.add_edge("ingest",     "extract")
    graph.add_edge("extract",    "normalize")
    graph.add_edge("normalize",  "evidence")
    graph.add_edge("evidence",   "compare")
    graph.add_edge("compare",    "contradict")
    graph.add_edge("contradict", "score")
    graph.add_edge("score",      "recommend")
    graph.add_edge("recommend",  "report")
    graph.add_edge("report",     END)

    # Error routing: any node can set state["error"] to skip to END
    for node in ["intent", "ingest", "extract", "normalize", "evidence",
                 "compare", "contradict", "score", "recommend"]:
        graph.add_conditional_edges(
            node,
            lambda s: END if s.get("error") else None,
        )

    return graph.compile()


# ─── Compiled singleton ───────────────────────────────────────────────────────
_graph = build_comparison_graph()


# ─── Entry point ─────────────────────────────────────────────────────────────
async def run_comparison_graph(
    job_id: str,
    step: str,
    request: CompareRequest,
) -> Dict[str, Any]:
    """
    Run the comparison graph from the beginning (or resume from a step).
    In production, use checkpointing via LangGraph's MemorySaver / Postgres persister.
    """
    initial_state: ComparisonState = {
        "job_id": job_id,
        "request": request,
        "step": step,
        "intent_data": None,
        "raw_contents": None,
        "structured_facts": None,
        "normalized_facts": None,
        "evidence_snippets": None,
        "comparison_matrix": None,
        "contradictions": None,
        "criterion_scores": None,
        "final_scores": None,
        "recommendation": None,
        "report": None,
        "error": None,
        "completed_steps": [],
    }

    try:
        final_state = await _graph.ainvoke(initial_state)
        logger.info("Graph completed for job %s", job_id)
        return final_state.get("report") or {}
    except Exception as exc:
        logger.exception("Graph failed for job %s: %s", job_id, exc)
        raise
