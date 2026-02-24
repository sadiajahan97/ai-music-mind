from fastapi import Depends, HTTPException
from jwt import DecodeError, ExpiredSignatureError, decode

from app.auth_utils import get_bearer_token
from app.constants import JWT_ALGORITHM, JWT_SECRET

def get_current_user_id(token: str = Depends(get_bearer_token)) -> str:
    if not JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET is not configured",
        )
    try:
        payload = decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return user_id