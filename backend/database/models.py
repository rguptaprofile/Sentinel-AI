from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, ClassVar
from uuid import uuid4


def make_uuid() -> str:
    return str(uuid4())


def utcnow() -> datetime:
    return datetime.utcnow()


@dataclass
class MongoDocument:
    id: str = field(default_factory=make_uuid)

    collection_name: ClassVar[str] = ""
    indexes: ClassVar[tuple[tuple[str, int], ...]] = ()

    def to_mongo(self) -> dict[str, Any]:
        data = self.__dict__.copy()
        data.pop("collection_name", None)
        data.pop("indexes", None)
        data["_id"] = data.pop("id")
        return data

    @classmethod
    def from_mongo(cls, data: dict[str, Any] | None):
        if data is None:
            return None
        payload = data.copy()
        payload["id"] = str(payload.pop("_id"))
        return cls(**payload)


@dataclass
class CitizenReportRecord(MongoDocument):
    channel: str = ""
    description: str = ""
    language: str = "en"
    location: str | None = None
    amount: float | None = None
    risk_score: float | None = None
    incident_type: str | None = None
    status: str = "submitted"
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "citizen_reports"
    indexes = (("created_at", -1), ("status", 1), ("risk_score", -1))


@dataclass
class AlertRecord(MongoDocument):
    title: str = ""
    severity: str = "low"
    source: str = ""
    summary: str = ""
    region: str | None = None
    payload: dict[str, Any] = field(default_factory=dict)
    status: str = "open"
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "alerts"
    indexes = (("created_at", -1), ("status", 1), ("severity", 1))


@dataclass
class ScamSessionRecord(MongoDocument):
    report_id: str | None = None
    suspected_number: str | None = None
    risk_score: float | None = None
    verdict: str = "pending"
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "scam_sessions"
    indexes = (("created_at", -1), ("report_id", 1), ("suspected_number", 1))


@dataclass
class CounterfeitScanRecord(MongoDocument):
    denomination: int = 0
    serial_number: str | None = None
    authenticity_score: float | None = None
    verdict: str = "pending"
    image_uri: str | None = None
    scanned_at: datetime = field(default_factory=utcnow)

    collection_name = "counterfeit_scans"
    indexes = (("scanned_at", -1), ("verdict", 1), ("serial_number", 1))


@dataclass
class FraudGraphNodeRecord(MongoDocument):
    node_type: str = ""
    label: str = ""
    risk_score: float | None = None
    x: float | None = None
    y: float | None = None
    attributes: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "fraud_graph_nodes"
    indexes = (("created_at", -1), ("label", 1), ("risk_score", -1))


@dataclass
class FraudGraphEdgeRecord(MongoDocument):
    source_node_id: str = ""
    target_node_id: str = ""
    relationship_type: str = ""
    confidence_score: float | None = None
    evidence: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "fraud_graph_edges"
    indexes = (("created_at", -1), ("source_node_id", 1), ("target_node_id", 1))


@dataclass
class GeoIncidentRecord(MongoDocument):
    incident_type: str = ""
    latitude: float = 0
    longitude: float = 0
    district: str | None = None
    state: str | None = None
    risk_score: float | None = None
    occurred_at: datetime = field(default_factory=utcnow)
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "geo_incidents"
    indexes = (("risk_score", -1), ("state", 1), ("created_at", -1))


@dataclass
class TransactionEventRecord(MongoDocument):
    account_id: str = ""
    account_holder: str | None = None
    transaction_type: str = ""
    amount: float = 0
    merchant: str | None = None
    location: str | None = None
    status: str = "cleared"
    risk_score: float = 0
    event_time: datetime = field(default_factory=utcnow)
    metadata_json: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "transaction_events"
    indexes = (("event_time", -1), ("risk_score", -1), ("status", 1), ("account_id", 1))


@dataclass
class ModelRunRecord(MongoDocument):
    model_name: str = ""
    model_type: str = ""
    input_ref: str | None = None
    score: float = 0
    verdict: str = ""
    features: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "model_runs"
    indexes = (("created_at", -1), ("model_type", 1), ("input_ref", 1))


@dataclass
class UserRecord(MongoDocument):
    name: str = ""
    email: str = ""
    password_hash: str = ""
    role: str = "citizen"
    status: str = "active"
    avatar: str | None = None
    reports_count: int = 0
    joined_at: datetime = field(default_factory=utcnow)
    last_login: datetime | None = None
    created_at: datetime = field(default_factory=utcnow)

    collection_name = "users"
    indexes = (("email", 1), ("role", 1), ("status", 1))


DOCUMENT_MODELS = (
    CitizenReportRecord,
    AlertRecord,
    ScamSessionRecord,
    CounterfeitScanRecord,
    FraudGraphNodeRecord,
    FraudGraphEdgeRecord,
    GeoIncidentRecord,
    TransactionEventRecord,
    ModelRunRecord,
    UserRecord,
)
