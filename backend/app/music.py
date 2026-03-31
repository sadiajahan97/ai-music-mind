from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from prisma import Prisma
from pydantic import BaseModel

from app.auth_middleware import get_current_user_id
from app.db import get_db
from app.music_utils import generate_music_specs, generate_music_task, get_music_task_info

router = APIRouter(prefix="/music", tags=["music"])

class GenerateLyricsRequest(BaseModel):
    user_prompt: str
    language: str


class GenerateMusicRequest(BaseModel):
    lyrics: str
    title: str
    style: str
    vocal_gender: Literal["m", "f"]
    style_weight: float
    weirdness_constraint: float


class UpdateLyricsRequest(BaseModel):
    lyrics: str

@router.post("/generate/lyrics")
async def generate_lyrics(request: GenerateLyricsRequest):
    try:
        music_specs = generate_music_specs(
            request.user_prompt, request.language
        )
        return {
            "title": music_specs.get("title"),
            "lyrics": music_specs.get("prompt"),
        }
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            detail=str(e),
            status_code=502,
        ) from e


@router.post("/generate")
async def generate_music(
    request: GenerateMusicRequest,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    try:
        user = await prisma.user.find_unique(where={"id": user_id})
        music_specs = {
            "title": request.title,
            "prompt": request.lyrics,
        }
        task_id = generate_music_task(
            music_specs,
            request.style,
            request.vocal_gender,
            request.style_weight,
            request.weirdness_constraint,
        )

        await prisma.musictrack.create(
            data={
                "id": task_id,
                "userId": user_id,
                "lyrics": music_specs.get("prompt"),
                "title": music_specs.get("title"),
                "style": request.style or None,
                "vocalGender": request.vocal_gender,
                "styleWeight": request.style_weight,
                "weirdnessConstraint": request.weirdness_constraint,
            }
        )

        return {
            "taskId": task_id,
            "title": music_specs.get("title"),
            "lyrics": music_specs.get("prompt"),
            "owner_name": user.name if user else None,
            "owner_email": user.email if user else None,
        }
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
        include={"user": True},
    )

    return [
        {
            **t.model_dump(),
            "owner_name": t.user.name if t.user else None,
            "owner_email": t.user.email if t.user else None,
        }
        for t in tracks
    ]

@router.get("/tracks/{track_id}")
async def get_music_track(
    track_id: str,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    track = await prisma.musictrack.find_first(
        where={"id": track_id, "userId": user_id},
        include={"user": True},
    )

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    return {
        **track.model_dump(),
        "owner_name": track.user.name if track.user else None,
        "owner_email": track.user.email if track.user else None,
    }


@router.get("/tracks/{track_id}/lyrics")
async def get_music_track_lyrics(
    track_id: str,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    track = await prisma.musictrack.find_first(
        where={"id": track_id, "userId": user_id},
    )

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    return {
        "trackId": track.id,
        "lyrics": track.lyrics,
    }


@router.patch("/tracks/{track_id}/lyrics")
async def update_music_track_lyrics(
    track_id: str,
    request: UpdateLyricsRequest,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    track = await prisma.musictrack.find_first(
        where={"id": track_id, "userId": user_id},
    )

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    updated_track = await prisma.musictrack.update(
        where={"id": track_id},
        data={"lyrics": request.lyrics},
    )

    return {
        "trackId": updated_track.id,
        "lyrics": updated_track.lyrics,
    }

@router.get("/tracks/{track_id}/file")
async def get_music_track_file(
    track_id: str,
    download: bool = False,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    track = await prisma.musictrack.find_first(
        where={"id": track_id, "userId": user_id},
    )

    if track is None or not track.filePath:
        raise HTTPException(status_code=404, detail="Track or file not found")

    path = Path(track.filePath)

    if not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    filename = (track.title or track_id).strip() or "track"

    safe_name = "".join(c for c in filename if c.isalnum() or c in " ._-")[:200]

    ext = path.suffix or ".mp3"

    if not safe_name.endswith(ext):
        safe_name = f"{safe_name}{ext}"

    media_type = "audio/mpeg" if ext.lower() == ".mp3" else "audio/mp4" if ext.lower() == ".m4a" else "audio/wav"

    return FileResponse(
        path,
        media_type=media_type,
        filename=safe_name if download else None,
    )