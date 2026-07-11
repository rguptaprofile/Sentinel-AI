from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, insert_document
from backend.database.models import CounterfeitScanRecord
from backend.models.entities import CounterfeitScanRequest, CounterfeitScanResponse
from backend.services.counterfeit_service import CounterfeitDetectionService


router = APIRouter()


@router.post("/scan", response_model=CounterfeitScanResponse, status_code=201)
def scan_currency_note(
    payload: CounterfeitScanRequest,
    db: Database = Depends(get_db),
) -> CounterfeitScanResponse:
    result = CounterfeitDetectionService().inspect_note(payload.model_dump())
    scan = CounterfeitScanRecord(
        denomination=payload.denomination,
        serial_number=payload.serial_number,
        image_uri=payload.image_uri,
        authenticity_score=result["authenticity_score"],
        verdict=result["verdict"],
    )
    insert_document(db, scan)
    return CounterfeitScanResponse(
        id=scan.id,
        authenticity_score=scan.authenticity_score or 0,
        verdict=scan.verdict,
        status=result["status"],
    )
