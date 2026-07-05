from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.database.models import FraudGraphNodeRecord
from backend.models.entities import FraudNetworkNode, FraudNetworkNodeCreate
from backend.services.graph_service import FraudGraphService


router = APIRouter()


@router.get("/networks")
def list_fraud_networks(db: Session = Depends(get_db)) -> dict[str, list]:
    return FraudGraphService().build_network_snapshot(db)


@router.post("/nodes", response_model=FraudNetworkNode, status_code=201)
def create_fraud_node(
    payload: FraudNetworkNodeCreate,
    db: Session = Depends(get_db),
) -> FraudGraphNodeRecord:
    node = FraudGraphNodeRecord(**payload.model_dump())
    db.add(node)
    db.commit()
    db.refresh(node)
    return node
