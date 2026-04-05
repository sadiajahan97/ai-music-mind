from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma

from app.auth_middleware import get_current_user_id
from app.auth_utils import user_to_response
from app.db import get_db
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_premium: bool

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=UserResponse)
async def get_profile(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user_to_response(user)
