from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, insert_document
from backend.database.models import FraudGraphNodeRecord
from backend.models.entities import FraudNetworkNode, FraudNetworkNodeCreate
from backend.services.graph_service import FraudGraphService


router = APIRouter()


@router.get("/networks")
def list_fraud_networks(db: Database = Depends(get_db)) -> dict[str, list]:
    return FraudGraphService().build_network_snapshot(db)


@router.post("/nodes", response_model=FraudNetworkNode, status_code=201)
def create_fraud_node(
    payload: FraudNetworkNodeCreate,
    db: Database = Depends(get_db),
) -> FraudGraphNodeRecord:
    node = FraudGraphNodeRecord(**payload.model_dump())
    return insert_document(db, node)
