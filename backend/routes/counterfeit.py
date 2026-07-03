from fastapi import APIRouter


router = APIRouter()


@router.post("/scan")
def scan_currency_note() -> dict[str, str]:
    return {"status": "pending_model_integration"}
