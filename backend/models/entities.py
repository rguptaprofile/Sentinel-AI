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


class ThreatAlert(BaseModel):
    title: str
    severity: AlertSeverity
    source: str
    summary: str
