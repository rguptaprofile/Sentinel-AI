from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, insert_document, list_documents
from backend.database.models import CitizenReportRecord
from backend.models.entities import CitizenReport, CitizenReportResponse


router = APIRouter()


@router.get("/", response_model=list[CitizenReportResponse])
def list_citizen_reports(db: Database = Depends(get_db)) -> list[CitizenReportRecord]:
    return list_documents(db, CitizenReportRecord, sort=[("created_at", -1)])


@router.post("/", response_model=CitizenReportResponse, status_code=201)
def create_citizen_report(payload: CitizenReport, db: Database = Depends(get_db)) -> CitizenReportRecord:
    report = CitizenReportRecord(**payload.model_dump())
    return insert_document(db, report)
