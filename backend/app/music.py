from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from prisma import Prisma
from pydantic import BaseModel

from app.auth_middleware import get_current_user_id
from app.db import get_db
from app.music_utils import generate_music_specs, generate_music_task
from app.s3 import AWS_BUCKET_NAME, s3_client

async def _delete_tracks_and_files(prisma: Prisma, user_id: str, is_saved: bool = False):
    tracks = await prisma.musictrack.find_many(
        where={"userId": user_id, "isSaved": is_saved}
    )
    
    for t in tracks:
        if t.filePath:
            try:
                s3_client.delete_object(Bucket=AWS_BUCKET_NAME, Key=t.filePath)
            except Exception as e:
                print(f"Failed to delete S3 file {t.filePath}: {e}")
                    
    count = await prisma.musictrack.delete_many(
        where={"userId": user_id, "isSaved": is_saved}
    )
    return count

router = APIRouter(prefix="/music", tags=["music"])

class GenerateLyricsRequest(BaseModel):
    user_prompt: str
    language: str
    lyrics_to_music_ratio: float
    style: str


class GenerateMusicRequest(BaseModel):
    track_id: str | None = None
    lyrics: str
    title: str
    style: str
    vocal_gender: Literal["m", "f"]
    style_weight: float | None = None
    weirdness_constraint: float | None = None


class GenerateLyricsResponse(BaseModel):
    trackId: str
    title: str
    lyrics: str

class GenerateMusicResponse(BaseModel):
    id: str
    duration: int | None = None
    filePath: str | None = None
    imageUrl: str | None = None
    isExplicit: bool
    isPublished: bool
    isSaved: bool
    status: str | None = None
    lyrics: str | None = None
    price: float | None = None
    style: str | None = None
    tags: str | None = None
    title: str | None = None
    vocalGender: str | None = None
    createdAt: datetime
    releasedAt: datetime | None = None
    updatedAt: datetime
    taskId: str | None = None
    owner_name: str | None = None
    owner_email: str | None = None

class PublishMusicResponse(BaseModel):
    trackId: str
    title: str

class SaveMusicResponse(BaseModel):
    trackId: str
    title: str

class DeleteUnsavedResponse(BaseModel):
    deleted_count: int

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
    price: float | None = None
    style: str | None = None
    tags: str | None = None
    title: str | None = None
    vocalGender: str | None = None
    createdAt: datetime
    releasedAt: datetime | None = None
    updatedAt: datetime
    taskId: str | None = None
    owner_name: str | None = None
    owner_email: str | None = None

class UnsavedTrackItem(BaseModel):
    id: str
    duration: int | None = None
    filePath: str | None = None
    imageUrl: str | None = None
    isExplicit: bool
    isPublished: bool
    isSaved: bool
    status: str | None = None
    price: float | None = None
    tags: str | None = None
    createdAt: datetime
    releasedAt: datetime | None = None
    updatedAt: datetime
    taskId: str | None = None

class UnsavedTracksResponse(BaseModel):
    trackId: str | None = None
    lyrics: str | None = None
    style: str | None = None
    title: str | None = None
    vocalGender: str | None = None
    owner_name: str | None = None
    owner_email: str | None = None
    music_tracks: list[UnsavedTrackItem]

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
        
        await _delete_tracks_and_files(prisma, user_id, is_saved=False)

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
            "lyrics": track.lyrics,
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
        if request.track_id:
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

        if request.track_id:
            track = await prisma.musictrack.update(
                where={"id": request.track_id},
                data={
                    "taskId": task_id,
                    "lyrics": music_specs.get("prompt"),
                    "title": music_specs.get("title"),
                    "style": request.style,
                    "vocalGender": request.vocal_gender,
                    "styleWeight": request.style_weight,
                    "weirdnessConstraint": request.weirdness_constraint,
                    "status": "processing",
                },
                include={"user": True}
            )
        else:
            track = await prisma.musictrack.create(
                data={
                    "userId": user_id,
                    "taskId": task_id,
                    "lyrics": music_specs.get("prompt"),
                    "title": music_specs.get("title"),
                    "style": request.style,
                    "vocalGender": request.vocal_gender,
                    "styleWeight": request.style_weight,
                    "weirdnessConstraint": request.weirdness_constraint,
                    "status": "processing",
                },
                include={"user": True}
            )

        return {
            **track.model_dump(),
            "owner_name": track.user.name if track.user else None,
            "owner_email": track.user.email if track.user else None,
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

@router.get("/unsaved", response_model=UnsavedTracksResponse)
async def get_unsaved_tracks(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    tracks = await prisma.musictrack.find_many(
        where={
            "userId": user_id,
            "isSaved": False,
        },
        order={"createdAt": "desc"},
        include={"user": True},
    )

    if not tracks:
        return UnsavedTracksResponse(music_tracks=[])

    first = tracks[0]
    
    music_tracks = []
    for t in tracks:
        item = t.model_dump()
        for field in ["lyrics", "style", "title", "vocalGender"]:
            item.pop(field, None)
        music_tracks.append(UnsavedTrackItem(**item))

    return UnsavedTracksResponse(
        trackId=tracks[-1].id,
        lyrics=first.lyrics,
        style=first.style,
        title=first.title,
        vocalGender=first.vocalGender,
        owner_name=first.user.name if first.user else None,
        owner_email=first.user.email if first.user else None,
        music_tracks=music_tracks
    )

@router.delete("/unsaved", response_model=DeleteUnsavedResponse)
async def delete_unsaved_tracks(
    user_id: str = Depends(get_current_user_id),
    prisma: Prisma = Depends(get_db),
):
    count = await _delete_tracks_and_files(prisma, user_id, is_saved=False)

    return {"deleted_count": count}

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

    params = {
        "Bucket": AWS_BUCKET_NAME,
        "Key": track.filePath,
    }

    if download:
        filename = (track.title or track_id).strip() or "track"
        safe_name = "".join(c for c in filename if c.isalnum() or c in " ._-")[:200]
        if not safe_name.endswith(".mp3"):
            safe_name += ".mp3"
        params["ResponseContentDisposition"] = f'attachment; filename="{safe_name}"'

    url = s3_client.generate_presigned_url(
        "get_object",
        Params=params,
        ExpiresIn=3600,
    )

    return RedirectResponse(url)

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

    await _delete_tracks_and_files(prisma, user_id, is_saved=False)

    return {
        "trackId": updated_track.id,
        "title": updated_track.title or "",
    }