from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, insert_document
from backend.database.models import ScamSessionRecord
from backend.models.entities import ScamClassificationRequest, ScamClassificationResponse
from backend.services.scam_service import ScamDetectionService


router = APIRouter()


@router.post("/classify", response_model=ScamClassificationResponse, status_code=201)
def classify_scam_session(
    payload: ScamClassificationRequest,
    db: Database = Depends(get_db),
) -> ScamClassificationResponse:
    result = ScamDetectionService().classify(payload.model_dump())
    session = ScamSessionRecord(
        report_id=payload.report_id,
        suspected_number=payload.suspected_number,
        risk_score=result["risk_score"],
        verdict=result["verdict"],
    )
    insert_document(db, session)
    return ScamClassificationResponse(
        id=session.id,
        risk_score=session.risk_score or 0,
        verdict=session.verdict,
        status=result["status"],
    )
