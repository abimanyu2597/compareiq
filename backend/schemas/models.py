"""
CompareIQ AI — Pydantic Schemas
Covers all request/response models for API contracts.
"""

from __future__ import annotations
from typing import Any, Dict, List, Literal, Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl


# ─── Enums ────────────────────────────────────────────────────────────────────
InputType = Literal["text", "pdf", "url", "image", "audio"]
Persona = Literal["student", "investor", "developer", "traveler", "family", "business", "procurement"]
DecisionMode = Literal["buy", "migrate", "apply", "shortlist", "validate", "choose_vendor", "negotiate"]
ComparisonStatus = Literal["pending", "running", "done", "error"]


# ─── Shared Primitives ────────────────────────────────────────────────────────
class EvidenceSnippet(BaseModel):
    text: str
    source_type: InputType
    source_ref: str  # filename, URL, etc.
    confidence: float = Field(ge=0.0, le=1.0)
    freshness_date: Optional[datetime] = None


class CriterionWeight(BaseModel):
    name: str
    weight: float = Field(ge=0.0, le=100.0)
    description: Optional[str] = None


class EntityScore(BaseModel):
    entity_id: str
    entity_label: str
    criterion: str
    score: float = Field(ge=0.0, le=100.0)
    rationale: str
    evidence: List[EvidenceSnippet] = []


class ContradictionItem(BaseModel):
    claim_a: str
    claim_b: str
    source_a: str
    source_b: str
    severity: Literal["low", "medium", "high"]
    resolution_note: Optional[str] = None


class TrustMetrics(BaseModel):
    confidence: float = Field(ge=0.0, le=1.0)
    completeness: float = Field(ge=0.0, le=1.0)
    freshness: float = Field(ge=0.0, le=1.0)
    contradiction_count: int = 0
    missing_fields: List[str] = []
    uncertainty_warnings: List[str] = []


class ScoreSummary(BaseModel):
    entity_id: str
    entity_label: str
    total_score: float
    rank: int
    is_winner: bool
    pros: List[str] = []
    cons: List[str] = []


# ─── Comparison Request ───────────────────────────────────────────────────────
class EntityInput(BaseModel):
    id: str
    label: str
    input_type: InputType
    content: Optional[str] = None          # text / URL
    file_path: Optional[str] = None        # server path after upload
    metadata: Dict[str, Any] = {}


class CompareRequest(BaseModel):
    intent: str = Field(..., min_length=5, description="User's natural-language decision goal")
    entities: List[EntityInput] = Field(..., min_items=2, max_items=5)
    criteria: List[CriterionWeight] = []
    persona: Persona = "developer"
    decision_mode: DecisionMode = "buy"
    enable_monitoring: bool = False
    user_id: Optional[str] = None


# ─── Comparison Result ────────────────────────────────────────────────────────
class ComparisonResult(BaseModel):
    id: UUID
    status: ComparisonStatus
    intent: str
    persona: Persona
    decision_mode: DecisionMode
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Output
    executive_summary: Optional[str] = None
    winner_id: Optional[str] = None
    winner_label: Optional[str] = None
    winner_rationale: Optional[str] = None
    scores: List[ScoreSummary] = []
    criterion_scores: List[EntityScore] = []
    contradictions: List[ContradictionItem] = []
    trust: Optional[TrustMetrics] = None
    follow_up_suggestions: List[str] = []
    monitoring_enabled: bool = False


class ComparisonStatusResponse(BaseModel):
    id: UUID
    status: ComparisonStatus
    current_step: Optional[str] = None
    progress: float = Field(ge=0.0, le=1.0, default=0.0)
    error: Optional[str] = None


# ─── Ingest ───────────────────────────────────────────────────────────────────
class IngestResponse(BaseModel):
    file_id: str
    input_type: InputType
    filename: str
    size_bytes: int
    parsed_text_preview: Optional[str] = None  # first 200 chars
    page_count: Optional[int] = None           # PDFs
    duration_seconds: Optional[float] = None   # audio
    status: Literal["ok", "error"]
    message: Optional[str] = None


# ─── SSE Event ────────────────────────────────────────────────────────────────
class PipelineEvent(BaseModel):
    event: Literal[
        "step_start", "step_done", "step_error",
        "comparison_done", "comparison_error",
        "monitoring_alert"
    ]
    step: Optional[str] = None
    detail: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ─── Chat / Follow-up ─────────────────────────────────────────────────────────
class FollowUpRequest(BaseModel):
    comparison_id: UUID
    question: str
    user_id: Optional[str] = None


class FollowUpResponse(BaseModel):
    answer: str
    updated_scores: Optional[List[ScoreSummary]] = None
    citations: List[EvidenceSnippet] = []


# ─── Monitoring ───────────────────────────────────────────────────────────────
class MonitorRequest(BaseModel):
    comparison_id: UUID
    check_interval_hours: int = Field(default=24, ge=1, le=168)
    alert_on_changes: bool = True
    alert_on_recommendation_shift: bool = True


class MonitorStatus(BaseModel):
    comparison_id: UUID
    enabled: bool
    last_checked: Optional[datetime]
    next_check: Optional[datetime]
    change_count: int = 0
    recommendation_shifted: bool = False
    latest_delta: Optional[Dict[str, Any]] = None


# ─── Auth ─────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
    name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str
