"""
Auth Router — JWT-based register, login, and token verification.
"""
import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt

from schemas.models import RegisterRequest, LoginRequest, TokenResponse
from core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# In-memory user store (replace with Postgres in production)
_users: dict[str, dict] = {}


def _hash(pwd: str) -> str:
    return pwd_ctx.hash(pwd)


def _verify(pwd: str, hashed: str) -> bool:
    return pwd_ctx.verify(pwd, hashed)


def _create_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def _decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(req: RegisterRequest):
    if req.email in _users:
        raise HTTPException(status_code=409, detail="Email already registered")
    user_id = f"user_{len(_users) + 1}"
    _users[req.email] = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "hashed_password": _hash(req.password),
    }
    token = _create_token({"sub": user_id, "email": req.email})
    return TokenResponse(access_token=token, user_id=user_id, name=req.name, email=req.email)


@router.post("/login", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = _users.get(form.username)
    if not user or not _verify(form.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = _create_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token, user_id=user["id"], name=user["name"], email=user["email"])


@router.get("/me")
async def me(token: str = Depends(oauth2_scheme)):
    payload = _decode_token(token)
    email = payload.get("email")
    user = _users.get(email or "")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user["id"], "name": user["name"], "email": user["email"]}
