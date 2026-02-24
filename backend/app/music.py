from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma
from pydantic import BaseModel

from app.auth_middleware import get_current_user_id
from app.db import get_db
from app.music_utils import generate_music_specs, generate_music_task, get_music_task_info

router = APIRouter(prefix="/music", tags=["music"])

class GenerateMusicRequest(BaseModel):
    user_prompt: str
    style: str = ""
    mood: str = ""

@router.post("/generate")
async def generate_music(
    request: GenerateMusicRequest,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    try:
        music_specs = generate_music_specs(request.user_prompt, request.mood)

        task_id = generate_music_task(music_specs, request.style)

        await prisma.musictrack.create(
            data={
                "id": task_id,
                "userId": user_id,
                "title": music_specs.get("title"),
                "style": request.style or None,
                "mood": request.mood or None,
            }
        )

        return {"taskId": task_id}
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            detail=str(e),
            status_code=502,
        ) from e

@router.get("/task/{task_id}")
def get_music_task(task_id: str):
    try:
        return get_music_task_info(task_id)
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            detail=str(e),
            status_code=502,
        ) from e

@router.get("/tracks")
async def get_music_tracks(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    tracks = await prisma.musictrack.find_many(
        where={"userId": user_id},
        order={"createdAt": "desc"},
    )

    return [t.model_dump() for t in tracks]