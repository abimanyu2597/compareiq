"""
CompareIQ AI — SQLAlchemy Database Models (Postgres)
"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import (
    Column, String, Text, Float, Integer, Boolean,
    DateTime, ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    comparisons = relationship("Comparison", back_populates="user", cascade="all, delete")


class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    intent = Column(Text, nullable=False)
    persona = Column(String(50), default="developer")
    decision_mode = Column(String(50), default="buy")
    status = Column(String(20), default="pending")  # pending/running/done/error
    progress = Column(Float, default=0.0)
    current_step = Column(String(100), nullable=True)

    # Stored results (JSONB in Postgres)
    request_payload = Column(JSON, nullable=True)
    result_payload = Column(JSON, nullable=True)
    trust_metrics = Column(JSON, nullable=True)

    # Monitoring
    monitoring_enabled = Column(Boolean, default=False)
    monitor_interval_hours = Column(Integer, default=24)
    last_checked_at = Column(DateTime, nullable=True)
    next_check_at = Column(DateTime, nullable=True)
    change_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="comparisons")
    entities = relationship("ComparisonEntity", back_populates="comparison", cascade="all, delete")
    events = relationship("PipelineEvent", back_populates="comparison", cascade="all, delete")


class ComparisonEntity(Base):
    __tablename__ = "comparison_entities"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comparison_id = Column(PGUUID(as_uuid=True), ForeignKey("comparisons.id"))
    label = Column(String(255), nullable=False)
    input_type = Column(String(20), nullable=False)  # text/pdf/url/image/audio
    content_ref = Column(Text, nullable=True)         # text content or file path
    structured_facts = Column(JSON, nullable=True)
    normalized_facts = Column(JSON, nullable=True)
    final_score = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)
    is_winner = Column(Boolean, default=False)

    comparison = relationship("Comparison", back_populates="entities")


class PipelineEvent(Base):
    __tablename__ = "pipeline_events"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comparison_id = Column(PGUUID(as_uuid=True), ForeignKey("comparisons.id"))
    event_type = Column(String(50), nullable=False)   # step_start/step_done/error
    step_name = Column(String(100), nullable=True)
    detail = Column(Text, nullable=True)
    data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    comparison = relationship("Comparison", back_populates="events")


class MonitorAlert(Base):
    __tablename__ = "monitor_alerts"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comparison_id = Column(PGUUID(as_uuid=True), ForeignKey("comparisons.id"))
    alert_type = Column(String(50))  # price_change/content_change/recommendation_shift
    summary = Column(Text)
    delta_data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
