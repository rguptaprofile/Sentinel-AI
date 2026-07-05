from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.alerts.notifier import AlertNotifier
from backend.database.connection import get_db
from backend.database.models import AlertRecord
from backend.models.entities import ThreatAlert, ThreatAlertResponse


router = APIRouter()


@router.get("/", response_model=list[ThreatAlertResponse])
def list_alerts(db: Session = Depends(get_db)) -> list[AlertRecord]:
    return db.query(AlertRecord).order_by(AlertRecord.created_at.desc()).all()


@router.post("/", response_model=ThreatAlertResponse, status_code=201)
def create_alert(payload: ThreatAlert, db: Session = Depends(get_db)) -> AlertRecord:
    alert = AlertRecord(**payload.model_dump(mode="json"))
    db.add(alert)
    db.commit()
    db.refresh(alert)
    AlertNotifier().send({"id": alert.id, "title": alert.title, "severity": alert.severity})
    return alert
