from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class AlertSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CitizenReport(BaseModel):
    channel: str = Field(..., examples=["mobile_app", "whatsapp", "ivr"])
    description: str
    language: str = "en"
    location: str | None = None
    amount: float | None = None
    incident_type: str | None = None


class CitizenReportResponse(CitizenReport):
    id: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ThreatAlert(BaseModel):
    title: str
    severity: AlertSeverity
    source: str
    summary: str
    region: str | None = None


class ThreatAlertResponse(ThreatAlert):
    id: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ScamClassificationRequest(BaseModel):
    report_id: str | None = None
    suspected_number: str | None = None
    transcript: str | None = None
    indicators: list[str] = []


class ScamClassificationResponse(BaseModel):
    id: str
    risk_score: float
    verdict: str
    status: str


class CounterfeitScanRequest(BaseModel):
    denomination: int = Field(..., gt=0)
    serial_number: str | None = None
    image_uri: str | None = None
    feature_score: float | None = Field(default=None, ge=0, le=1)


class CounterfeitScanResponse(BaseModel):
    id: str
    authenticity_score: float
    verdict: str
    status: str


class FraudNetworkNodeCreate(BaseModel):
    node_type: str
    label: str
    risk_score: float | None = Field(default=None, ge=0, le=1)


class FraudNetworkNode(FraudNetworkNodeCreate):
    id: str

    model_config = {"from_attributes": True}


class GeoHotspot(BaseModel):
    id: str
    incident_type: str
    latitude: float
    longitude: float
    district: str | None = None
    state: str | None = None
    risk_score: float | None = None

    model_config = {"from_attributes": True}


class IntelligenceFusionRequest(BaseModel):
    report_id: str | None = None
    transaction_id: str | None = None
    denomination: int | None = None
    serial_number: str | None = None
    image_uri: str | None = None
    transcript: str | None = None
    suspected_number: str | None = None
    voice_confidence: float | None = Field(default=None, ge=0, le=1)
    latitude: float | None = None
    longitude: float | None = None
    location: str | None = None
    indicators: list[str] = []


class ModelSignal(BaseModel):
    model_name: str
    model_type: str
    score: float
    verdict: str
    features: dict = {}


class IntelligenceFusionResponse(BaseModel):
    risk_score: float
    verdict: str
    priority: str
    signals: list[ModelSignal]
    recommended_actions: list[str]
    alert_id: str | None = None
