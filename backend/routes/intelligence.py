from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db
from backend.models.entities import IntelligenceFusionRequest, IntelligenceFusionResponse, ModelSignal
from backend.services.fusion_service import IntelligenceFusionService


router = APIRouter()


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
