from pymongo.database import Database

from backend.database.connection import list_documents
from backend.database.models import FraudGraphNodeRecord


class FraudGraphService:
    def build_network_snapshot(self, db: Database) -> dict:
        nodes = list_documents(db, FraudGraphNodeRecord, sort=[("created_at", -1)])
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
