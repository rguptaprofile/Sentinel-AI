from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from pymongo.database import Database

from backend.authentication.security import hash_password, verify_password
from backend.database.connection import get_db, insert_document
from backend.database.models import UserRecord


router = APIRouter()


class AuthRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=8)
    role: str | None = None


class SignupRequest(AuthRequest):
    name: str = Field(..., min_length=2)
    role: str = "citizen"


def serialize_user(user: UserRecord) -> dict:
    return {
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


@router.post("/signup", status_code=201)
def signup(payload: SignupRequest, db: Database = Depends(get_db)) -> dict:
    email = payload.email.lower()
    if db[UserRecord.collection_name].find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email is already registered.")
    user = UserRecord(
        name=payload.name,
        email=email,
        role=payload.role,
        password_hash=hash_password(payload.password),
        last_login=datetime.utcnow(),
    )
    insert_document(db, user)
    return {"user": serialize_user(user)}


@router.post("/signin")
def signin(payload: AuthRequest, db: Database = Depends(get_db)) -> dict:
    email = payload.email.lower()
    raw = db[UserRecord.collection_name].find_one({"email": email})
    user = UserRecord.from_mongo(raw) if raw else None
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if payload.role and user.role != payload.role:
        raise HTTPException(status_code=403, detail="This account does not have the selected role.")
    user.last_login = datetime.utcnow()
    db[UserRecord.collection_name].update_one({"_id": user.id}, {"$set": {"last_login": user.last_login}})
    return {"user": serialize_user(user)}
