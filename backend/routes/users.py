from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.database.connection import get_db, list_documents
from backend.database.models import UserRecord


router = APIRouter()


@router.get("/")
def list_users(db: Database = Depends(get_db)) -> list[dict]:
    users = list_documents(db, UserRecord, sort=[("created_at", -1)])
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
            "avatar": user.avatar,
            "reportsCount": user.reports_count,
            "joinedAt": user.joined_at.date().isoformat(),
            "lastLogin": user.last_login.isoformat() if user.last_login else None,
        }
        for user in users
    ]
