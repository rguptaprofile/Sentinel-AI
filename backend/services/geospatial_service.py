from sqlalchemy.orm import Session

from backend.database.models import GeoIncidentRecord


class GeospatialIntelligenceService:
    def compute_hotspots(self, db: Session) -> list[GeoIncidentRecord]:
        return db.query(GeoIncidentRecord).order_by(GeoIncidentRecord.risk_score.desc()).limit(50).all()
