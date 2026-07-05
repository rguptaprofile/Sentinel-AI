from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.database.models import CitizenReportRecord
from backend.models.entities import CitizenReport, CitizenReportResponse


router = APIRouter()


@router.get("/", response_model=list[CitizenReportResponse])
def list_citizen_reports(db: Session = Depends(get_db)) -> list[CitizenReportRecord]:
    return db.query(CitizenReportRecord).order_by(CitizenReportRecord.created_at.desc()).all()


@router.post("/", response_model=CitizenReportResponse, status_code=201)
def create_citizen_report(payload: CitizenReport, db: Session = Depends(get_db)) -> CitizenReportRecord:
    report = CitizenReportRecord(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
