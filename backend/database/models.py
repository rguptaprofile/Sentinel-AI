from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.connection import Base


def make_uuid() -> str:
    return str(uuid4())


class CitizenReportRecord(Base):
    __tablename__ = "citizen_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    channel: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(12), default="en", nullable=False)
    location: Mapped[str | None] = mapped_column(String(160))
    amount: Mapped[float | None] = mapped_column(Float)
    risk_score: Mapped[float | None] = mapped_column(Float)
    incident_type: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(40), default="submitted", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class AlertRecord(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    severity: Mapped[str] = mapped_column(String(40), nullable=False)
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    region: Mapped[str | None] = mapped_column(String(120))
    payload: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="open", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class ScamSessionRecord(Base):
    __tablename__ = "scam_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    report_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("citizen_reports.id"))
    suspected_number: Mapped[str | None] = mapped_column(String(40))
    risk_score: Mapped[float | None] = mapped_column(Float)
    verdict: Mapped[str] = mapped_column(String(40), default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class CounterfeitScanRecord(Base):
    __tablename__ = "counterfeit_scans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    denomination: Mapped[int] = mapped_column(Integer, nullable=False)
    serial_number: Mapped[str | None] = mapped_column(String(32))
    authenticity_score: Mapped[float | None] = mapped_column(Float)
    verdict: Mapped[str] = mapped_column(String(40), default="pending", nullable=False)
    image_uri: Mapped[str | None] = mapped_column(Text)
    scanned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class FraudGraphNodeRecord(Base):
    __tablename__ = "fraud_graph_nodes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    node_type: Mapped[str] = mapped_column(String(60), nullable=False)
    label: Mapped[str] = mapped_column(String(160), nullable=False)
    risk_score: Mapped[float | None] = mapped_column(Float)
    x: Mapped[float | None] = mapped_column(Float)
    y: Mapped[float | None] = mapped_column(Float)
    attributes: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class FraudGraphEdgeRecord(Base):
    __tablename__ = "fraud_graph_edges"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    source_node_id: Mapped[str] = mapped_column(String(36), ForeignKey("fraud_graph_nodes.id"), nullable=False)
    target_node_id: Mapped[str] = mapped_column(String(36), ForeignKey("fraud_graph_nodes.id"), nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(80), nullable=False)
    confidence_score: Mapped[float | None] = mapped_column(Float)
    evidence: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class GeoIncidentRecord(Base):
    __tablename__ = "geo_incidents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    incident_type: Mapped[str] = mapped_column(String(80), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    district: Mapped[str | None] = mapped_column(String(120))
    state: Mapped[str | None] = mapped_column(String(120))
    risk_score: Mapped[float | None] = mapped_column(Float)
    occurred_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class TransactionEventRecord(Base):
    __tablename__ = "transaction_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    account_id: Mapped[str] = mapped_column(String(80), nullable=False)
    account_holder: Mapped[str | None] = mapped_column(String(160))
    transaction_type: Mapped[str] = mapped_column(String(80), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    merchant: Mapped[str | None] = mapped_column(String(160))
    location: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(40), default="cleared", nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    event_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class ModelRunRecord(Base):
    __tablename__ = "model_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=make_uuid)
    model_name: Mapped[str] = mapped_column(String(80), nullable=False)
    model_type: Mapped[str] = mapped_column(String(80), nullable=False)
    input_ref: Mapped[str | None] = mapped_column(String(120))
    score: Mapped[float] = mapped_column(Float, nullable=False)
    verdict: Mapped[str] = mapped_column(String(60), nullable=False)
    features: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
