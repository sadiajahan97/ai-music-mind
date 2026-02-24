from datetime import datetime, timedelta, timezone

from bcrypt import checkpw, gensalt, hashpw
from fastapi import HTTPException, Request
from jwt import encode

from app.constants import ACCESS_TOKEN_EXPIRY_HOURS, JWT_ALGORITHM, JWT_SECRET

def create_access_token(user_id: str) -> tuple[str, datetime]:
    if not JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET is not configured",
        )
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=ACCESS_TOKEN_EXPIRY_HOURS)
    payload = {
        "sub": user_id,
        "exp": int(expires_at.timestamp()),
        "iat": int(now.timestamp()),
    }
    token = encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )
    return token, expires_at

def get_bearer_token(request: Request) -> str:
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header",
        )
    return auth[7:].strip()

def hash_password(password: str) -> str:
    return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")

def user_to_response(user) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "is_premium": user.isPremium,
    }

def verify_password(plain: str, hashed: str) -> bool:
    return checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))