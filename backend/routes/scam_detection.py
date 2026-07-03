from fastapi import APIRouter


router = APIRouter()


@router.post("/classify")
def classify_scam_session() -> dict[str, str]:
    return {"status": "pending_model_integration"}
