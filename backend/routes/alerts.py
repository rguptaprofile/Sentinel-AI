from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.alerts.notifier import AlertNotifier
from backend.database.connection import get_db, insert_document, list_documents
from backend.database.models import AlertRecord
from backend.models.entities import ThreatAlert, ThreatAlertResponse


router = APIRouter()


@router.get("/", response_model=list[ThreatAlertResponse])
def list_alerts(db: Database = Depends(get_db)) -> list[AlertRecord]:
    return list_documents(db, AlertRecord, sort=[("created_at", -1)])


@router.post("/", response_model=ThreatAlertResponse, status_code=201)
def create_alert(payload: ThreatAlert, db: Database = Depends(get_db)) -> AlertRecord:
    alert = AlertRecord(**payload.model_dump(mode="json"))
    insert_document(db, alert)
    AlertNotifier().send({"id": alert.id, "title": alert.title, "severity": alert.severity})
    return alert
