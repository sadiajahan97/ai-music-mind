from datetime import datetime
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from prisma import Prisma
from pydantic import BaseModel

from app.auth_middleware import get_current_user_id
from app.db import get_db
from app.music_utils import generate_music_specs, generate_music_task

router = APIRouter(prefix="/music", tags=["music"])

class GenerateLyricsRequest(BaseModel):
    user_prompt: str
    language: str
    lyrics_to_music_ratio: float
    style: str


class GenerateMusicRequest(BaseModel):
    track_id: str
    lyrics: str
    title: str
    style: str
    vocal_gender: Literal["m", "f"]
    style_weight: float | None = None
    weirdness_constraint: float | None = None


class GenerateLyricsResponse(BaseModel):
    trackId: str
    title: str

class GenerateMusicResponse(BaseModel):
    trackId: str
    title: str

class PublishMusicResponse(BaseModel):
    trackId: str
    title: str

class SaveMusicResponse(BaseModel):
    trackId: str
    title: str

class TrackDetailResponse(BaseModel):
    id: str
    duration: int | None = None
    filePath: str | None = None
    imageUrl: str | None = None
    isExplicit: bool
    isPublished: bool
    isSaved: bool
    status: str | None = None
    lyrics: str | None = None
    model: str | None = None
    price: float | None = None
    style: str | None = None
    styleWeight: float | None = None
    tags: str | None = None
    title: str | None = None
    vocalGender: str | None = None
    weirdnessConstraint: float | None = None
    createdAt: datetime
    releasedAt: datetime | None = None
    updatedAt: datetime
    taskId: str | None = None
    owner_name: str | None = None
    owner_email: str | None = None

class PublishMusicRequest(BaseModel):
    price: float
    releasedAt: datetime
    isExplicit: bool

@router.post("/generate/lyrics", response_model=GenerateLyricsResponse)
async def generate_lyrics(
    request: GenerateLyricsRequest,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    try:
        music_specs = generate_music_specs(
            request.user_prompt, request.language, request.lyrics_to_music_ratio, request.style
        )
        
        track = await prisma.musictrack.create(
            data={
                "userId": user_id,
                "lyrics": music_specs.get("prompt"),
                "title": music_specs.get("title"),
                "style": request.style,
                "status": "pending",
            }
        )

        return {
            "trackId": track.id,
            "title": track.title,
        }
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            detail=str(e),
            status_code=502,
        ) from e


@router.post("/generate", response_model=GenerateMusicResponse)
async def generate_music(
    request: GenerateMusicRequest,
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    try:
        track = await prisma.musictrack.find_first(
            where={"id": request.track_id, "userId": user_id}
        )
        if not track:
            raise HTTPException(status_code=404, detail="Track not found")
            
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

        await prisma.musictrack.update(
            where={"id": request.track_id},
            data={
                "taskId": task_id,
                "lyrics": music_specs.get("prompt"),
                "title": music_specs.get("title"),
                "style": request.style or None,
                "vocalGender": request.vocal_gender,
                "styleWeight": request.style_weight,
                "weirdnessConstraint": request.weirdness_constraint,
                "status": "processing",
            }
        )

        return {
            "trackId": request.track_id,
            "title": music_specs.get("title"),
        }
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            detail=str(e),
            status_code=502,
        ) from e

@router.get("/tracks", response_model=list[TrackDetailResponse])
async def get_music_tracks(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    tracks = await prisma.musictrack.find_many(
        where={
            "userId": user_id,
            "isSaved": True,
        },
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

@router.get("/published", response_model=list[TrackDetailResponse])
async def get_published_tracks(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    tracks = await prisma.musictrack.find_many(
        where={
            "isPublished": True,
            "userId": user_id,
        },
        order={"releasedAt": "desc"},
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

@router.get("/tracks/published/all", response_model=list[TrackDetailResponse])
async def get_all_published_tracks(
    prisma: Prisma = Depends(get_db),
):
    tracks = await prisma.musictrack.find_many(
        where={"isPublished": True},
        order={"releasedAt": "desc"},
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

@router.get("/tracks/{track_id}", response_model=TrackDetailResponse)
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

@router.post("/tracks/{track_id}/publish", response_model=PublishMusicResponse)
async def publish_music_track(
    track_id: str,
    request: PublishMusicRequest,
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
        data={
            "price": request.price,
            "releasedAt": request.releasedAt,
            "isExplicit": request.isExplicit,
            "isPublished": True,
        },
    )

    return {
        "trackId": updated_track.id,
        "title": updated_track.title or "",
    }

@router.post("/tracks/{track_id}/save", response_model=SaveMusicResponse)
async def save_music_track(
    track_id: str,
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
        data={"isSaved": True},
    )

    return {
        "trackId": updated_track.id,
        "title": updated_track.title or "",
    }