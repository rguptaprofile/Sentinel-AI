from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, insert_document
from backend.database.models import GeoIncidentRecord
from backend.models.entities import GeoHotspot, GeoIncidentCreate
from backend.services.geospatial_service import GeospatialIntelligenceService


router = APIRouter()


@router.post("/incidents", status_code=201)
def create_incident(payload: GeoIncidentCreate, db: Database = Depends(get_db)) -> dict:
    incident = GeoIncidentRecord(**payload.model_dump())
    insert_document(db, incident)
    return {"id": incident.id, "status": "stored", "created_at": incident.created_at}


@router.get("/hotspots", response_model=list[GeoHotspot])
def list_hotspots(db: Database = Depends(get_db)) -> list[GeoHotspot]:
    return GeospatialIntelligenceService().compute_hotspots(db)
