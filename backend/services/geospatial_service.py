from pymongo.database import Database

from backend.database.connection import list_documents
from backend.database.models import GeoIncidentRecord


class GeospatialIntelligenceService:
    def compute_hotspots(self, db: Database) -> list[GeoIncidentRecord]:
        return list_documents(db, GeoIncidentRecord, sort=[("risk_score", -1)], limit=50)
