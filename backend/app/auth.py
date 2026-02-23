from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma
from pydantic import BaseModel, EmailStr

from app.auth_utils import create_access_token, hash_password, user_to_response, verify_password
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    expires_at: datetime
    user: dict

@router.post("/sign-in", response_model=TokenResponse)
async def sign_in(
    body: SignInRequest,
    prisma: Prisma = Depends(get_db),
):
    user = await prisma.user.find_unique(where={"email": body.email})
    if not user or not verify_password(body.password, user.hashedPassword):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token, expires_at = create_access_token(user.id)
    return TokenResponse(
        access_token=access_token,
        expires_at=expires_at,
        user=user_to_response(user),
    )

@router.post("/sign-up", response_model=TokenResponse)
async def sign_up(
    body: SignUpRequest,
    prisma: Prisma = Depends(get_db),
):
    existing = await prisma.user.find_unique(where={"email": body.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed = hash_password(body.password)
    user = await prisma.user.create(
        data={
            "email": body.email,
            "hashedPassword": hashed,
            "name": body.name,
        }
    )

    access_token, expires_at = create_access_token(user.id)
    return TokenResponse(
        access_token=access_token,
        expires_at=expires_at,
        user=user_to_response(user),
    )