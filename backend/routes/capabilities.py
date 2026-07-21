from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import count_documents, get_db
from backend.database.models import (
    CitizenReportRecord,
    CounterfeitScanRecord,
    FraudGraphNodeRecord,
    GeoIncidentRecord,
    ModelRunRecord,
    ScamSessionRecord,
)
from backend.services.data_sources import data_source_status


router = APIRouter()


@router.get("/status")
def capability_status(db: Database = Depends(get_db)) -> dict:
    """Safe operational view for the five public safety AI capabilities.

    API keys are never returned to the browser. Only configuration health and
    MongoDB-backed activity counts are exposed.
    """
    sources = {source["key"]: source for source in data_source_status()["sources"]}

    def ready(*keys: str) -> bool:
        return all(sources[key]["configured"] for key in keys)

    return {
        "updated_at": "live",
        "features": [
            {
                "id": "digital-arrest",
                "title": "Digital Arrest Scam Detection & Alerting",
                "description": "Call-flow, spoofing, script and video-session signals are fused into high-priority alerts.",
                "status": "configured" if ready("telecom", "mha_alert") else "configuration_required",
                "data_count": count_documents(db, ScamSessionRecord),
                "sources": ["telecom", "mha_alert", "ncrb"],
            },
            {
                "id": "counterfeit",
                "title": "Counterfeit Currency Identification Agent",
                "description": "Note scans evaluate denomination, serial patterns and image-derived security features.",
                "status": "configured" if ready("currency_image") else "configuration_required",
                "data_count": count_documents(db, CounterfeitScanRecord),
                "sources": ["currency_image"],
            },
            {
                "id": "fraud-graph",
                "title": "Fraud Network Graph Intelligence",
                "description": "Account, device, transaction and case links are grouped into investigation-ready networks.",
                "status": "configured" if ready("bank_fraud") else "configuration_required",
                "data_count": count_documents(db, FraudGraphNodeRecord),
                "sources": ["bank_fraud", "telecom", "mha_alert"],
            },
            {
                "id": "geospatial",
                "title": "Geospatial Crime Pattern Intelligence",
                "description": "Complaint and seizure locations become live hotspot intelligence for deployment planning.",
                "status": "configured" if ready("geocoding", "ncrb") else "configuration_required",
                "data_count": count_documents(db, GeoIncidentRecord),
                "sources": ["geocoding", "ncrb"],
            },
            {
                "id": "citizen-shield",
                "title": "Citizen Fraud Shield (Multi-channel)",
                "description": "Guided risk assessment and reporting for calls, payment requests and suspicious messages.",
                "status": "configured" if ready("whatsapp", "speech_ai", "ncrb") else "configuration_required",
                "data_count": count_documents(db, CitizenReportRecord) + count_documents(db, ModelRunRecord),
                "sources": ["whatsapp", "speech_ai", "ncrb"],
            },
        ],
        "sources": [{"key": key, "name": item["name"], "configured": item["configured"]} for key, item in sources.items()],
    }
