from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db
from backend.models.entities import GeoHotspot
from backend.services.geospatial_service import GeospatialIntelligenceService


router = APIRouter()


@router.get("/hotspots", response_model=list[GeoHotspot])
def list_hotspots(db: Database = Depends(get_db)) -> list[GeoHotspot]:
    return GeospatialIntelligenceService().compute_hotspots(db)
