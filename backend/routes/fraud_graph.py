from fastapi import APIRouter


router = APIRouter()


@router.get("/networks")
def list_fraud_networks() -> dict[str, list]:
    return {"networks": []}
