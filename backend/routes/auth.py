from datetime import datetime, timedelta
import base64
import hashlib
import hmac
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from pymongo.database import Database

from backend.config.settings import settings
from backend.authentication.security import hash_password, verify_password
from backend.database.connection import get_db, insert_document
from backend.database.models import UserRecord


router = APIRouter()
security = HTTPBearer(auto_error=False)
SESSION_TTL_HOURS = 24 * 7


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


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")


def _sign_payload(payload: dict) -> str:
    body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    body_b64 = _base64url_encode(body)
    signature = hmac.new(settings.auth_session_secret.encode("utf-8"), body_b64.encode("ascii"), hashlib.sha256).digest()
    return f"{body_b64}.{_base64url_encode(signature)}"


def _verify_token(token: str) -> dict | None:
    try:
      body_b64, signature_b64 = token.split(".", 1)
      expected = hmac.new(settings.auth_session_secret.encode("utf-8"), body_b64.encode("ascii"), hashlib.sha256).digest()
      provided = _base64url_decode(signature_b64)
      if not hmac.compare_digest(expected, provided):
          return None
      payload = json.loads(_base64url_decode(body_b64).decode("utf-8"))
      if int(payload.get("exp", 0)) < int(datetime.utcnow().timestamp()):
          return None
      return payload
    except Exception:
      return None


def _issue_session(user: UserRecord) -> dict:
    expires_at = datetime.utcnow() + timedelta(hours=SESSION_TTL_HOURS)
    token = _sign_payload({"sub": user.id, "email": user.email, "role": user.role, "exp": int(expires_at.timestamp())})
    return {"token": token, "expiresAt": expires_at.isoformat()}


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
    return {"user": serialize_user(user), **_issue_session(user)}


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
    return {"user": serialize_user(user), **_issue_session(user)}


@router.get("/me")
def me(credentials: HTTPAuthorizationCredentials | None = Depends(security), db: Database = Depends(get_db)) -> dict:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing session token.")
    payload = _verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token.")
    raw = db[UserRecord.collection_name].find_one({"_id": payload.get("sub")})
    user = UserRecord.from_mongo(raw) if raw else None
    if not user:
        raise HTTPException(status_code=401, detail="Session user not found.")
    return {"user": serialize_user(user)}
