from fastapi import APIRouter


router = APIRouter()


@router.post("/")
def create_citizen_report() -> dict[str, str]:
    return {"status": "received"}
