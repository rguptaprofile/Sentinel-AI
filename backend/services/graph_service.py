from sqlalchemy.orm import Session

from backend.database.models import FraudGraphNodeRecord


class FraudGraphService:
    def build_network_snapshot(self, db: Session) -> dict:
        nodes = db.query(FraudGraphNodeRecord).order_by(FraudGraphNodeRecord.created_at.desc()).all()
        return {
            "nodes": [
                {
                    "id": node.id,
                    "node_type": node.node_type,
                    "label": node.label,
                    "risk_score": node.risk_score,
                }
                for node in nodes
            ],
            "edges": [],
            "status": "ready",
        }
