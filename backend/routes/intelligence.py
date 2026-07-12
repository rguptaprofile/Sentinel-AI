from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db
from backend.models.entities import IntelligenceFusionRequest, IntelligenceFusionResponse, ModelSignal
from backend.services.ai_models import model_artifact_status
from backend.services.data_sources import data_source_status
from backend.services.fusion_service import IntelligenceFusionService


router = APIRouter()


@router.get("/models/status")
def get_model_status() -> dict:
    return model_artifact_status()


@router.get("/data-sources/status")
def get_data_source_status() -> dict:
    return data_source_status()


@router.get("/training/readiness")
def get_training_readiness() -> dict:
    return {"models": model_artifact_status(), "data_sources": data_source_status()}


@router.post("/fusion/analyze", response_model=IntelligenceFusionResponse, status_code=201)
def analyze_intelligence(
    payload: IntelligenceFusionRequest,
    db: Database = Depends(get_db),
) -> IntelligenceFusionResponse:
    result = IntelligenceFusionService().analyze(db, payload.model_dump())
    return IntelligenceFusionResponse(
        risk_score=result["risk_score"],
        verdict=result["verdict"],
        priority=result["priority"],
        signals=[ModelSignal(**signal.__dict__) for signal in result["signals"]],
        recommended_actions=result["recommended_actions"],
        alert_id=result["alert_id"],
    )
