from fastapi import APIRouter


router = APIRouter()


@router.get("/hotspots")
def list_hotspots() -> dict[str, list]:
    return {"hotspots": []}
