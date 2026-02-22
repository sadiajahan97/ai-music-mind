from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.utils import generate_music_specs, generate_music_task, get_music_task_info

router = APIRouter(prefix="/music", tags=["music"])

class GenerateMusicRequest(BaseModel):
    user_prompt: str

@router.post("/generate")
def generate_music(request: GenerateMusicRequest):
    try:
        music_specs = generate_music_specs(request.user_prompt)

        task_id = generate_music_task(music_specs)

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