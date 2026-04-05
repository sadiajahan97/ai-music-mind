import time
from asyncio import CancelledError, sleep, to_thread
from json import dumps, JSONDecodeError, loads
from re import sub
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from langchain_core.messages import HumanMessage, SystemMessage

from tempfile import NamedTemporaryFile
from app.constants import KIE_GENERATE_URL, KIE_HEADERS, KIE_RECORD_INFO_URL, SYSTEM_PROMPT
from app.db import get_db
from app.model import get_model
from app.s3 import AWS_BUCKET_NAME, s3_client

from app.s3 import AWS_BUCKET_NAME, s3_client

def _upload_url_to_s3(url: str, key: str) -> None:
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "audio/*,*/*",
        },
    )

    with urlopen(request) as response:
        with NamedTemporaryFile(delete=True) as tmp:
            tmp.write(response.read())
            tmp.flush()
            s3_client.upload_file(
                tmp.name, 
                AWS_BUCKET_NAME, 
                key,
                ExtraArgs={"ContentType": "audio/mpeg"}
            )

def generate_music_specs(
    user_prompt: str, language: str, lyrics_to_music_ratio: float, style: str
) -> dict:
    try:
        model = get_model()

        parts = []

        if language:
            parts.append(f"Language: {language}")

        if style:
            parts.append(f"Style: {style}")

        if lyrics_to_music_ratio:
            parts.append(f"Lyrics duration: {round(lyrics_to_music_ratio * 240)} seconds")

        parts.append(user_prompt)

        human_content = "\n\n".join(parts)

        response = model.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=human_content),
        ])

        return loads(response.content)
    except JSONDecodeError as e:
        raise ValueError(f"Gemini response was not valid JSON: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get music specs: {e}") from e

def generate_music_task(
    music_specs: dict,
    style: str,
    vocal_gender: str,
    style_weight: float,
    weirdness_constraint: float,
) -> str:
    vocal = "f" if vocal_gender == "f" else "m"

    try:
        payload = {
            "prompt": music_specs.get("prompt", ""),
            "customMode": True,
            "instrumental": False,
            "model": "V4",
            "callBackUrl": "http://localhost:8000",
            "style": style,
            "title": music_specs.get("title", ""),
            "vocalGender": vocal,
        }

        if style_weight is not None:
            payload["styleWeight"] = style_weight
        if weirdness_constraint is not None:
            payload["weirdnessConstraint"] = weirdness_constraint

        request = Request(
            KIE_GENERATE_URL,
            data=dumps(payload).encode("utf-8"),
            headers=KIE_HEADERS,
            method="POST",
        )

        with urlopen(request) as response:
            result = loads(response.read().decode())

            if result.get("code") == 200:
                return (result.get("data") or {}).get("taskId")
            else:
                raise ValueError(f"Kie.ai request failed: {result.get("code")} - {result.get("msg", "Unknown error")}")
    except Exception as e:
        raise RuntimeError(f"Failed to generate music: {e}") from e

def get_music_task_info(task_id: str) -> dict:
    try:
        url = f"{KIE_RECORD_INFO_URL}?{urlencode({"taskId": task_id})}"

        request = Request(
            url,
            headers=KIE_HEADERS,
            method="GET",
        )

        with urlopen(request) as response:
            result = loads(response.read().decode())

            if result.get("code") == 200:
                data = result.get("data") or {}

                response = data.get("response") or {}

                suno_data = response.get("sunoData") or []

                status = data.get("status")

                if suno_data:
                    if status == "FIRST_SUCCESS" or status == "SUCCESS":
                        return {
                            "status": status,
                            "sunoData": suno_data[0],
                        }
                    else:
                        return {
                            "status": status,
                            "sunoData": [],
                        }
                else:
                    raise ValueError("Kie.ai response has no sunoData")
            else:
                raise ValueError(f"Kie.ai request failed: {data.get("errorCode")} - {data.get("errorMessage", "Unknown error")}")
    except JSONDecodeError as e:
        raise ValueError(f"Kie.ai response was not valid JSON: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get music task info: {e}") from e

async def run_not_ready_tracks_task() -> None:
    gen = get_db()

    try:
        prisma = await anext(gen)

        tracks = await prisma.musictrack.find_many(
            where={
                "status": "processing",
                "NOT": {"taskId": None},
            },
        )

        for track_obj in tracks:
            task_id = track_obj.taskId
            try:
                info = get_music_task_info(task_id)

                if info.get("status") in ("FIRST_SUCCESS", "SUCCESS") and info.get("sunoData"):
                    suno = info["sunoData"]

                    duration = suno.get("duration")

                    download_url = suno.get("sourceAudioUrl")

                    track = await prisma.musictrack.find_first(
                        where={"taskId": task_id},
                        include={"user": True},
                    )

                    if track and download_url:
                        title = (track.title or suno.get("title") or "untitled").strip()
                        safe_title = _sanitize_path_part(title)
                        
                        s3_key = f"tracks/{track.userId}/{task_id}_{safe_title}.mp3"

                        try:
                            await to_thread(_upload_url_to_s3, download_url, s3_key)
                        except Exception as e:
                            print(f"S3 Upload failed for {task_id}: {e}")
                            s3_key = None
                    else:
                        s3_key = None

                    await prisma.musictrack.update(
                        where={"taskId": task_id},
                        data={
                            "duration": int(duration * 1000) if duration is not None else None,
                            "filePath": s3_key,
                            "imageUrl": suno.get("sourceImageUrl"),
                            "status": "complete",
                            "model": suno.get("modelName"),
                            "tags": suno.get("tags"),
                        },
                    )
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)
    finally:
        await gen.aclose()

def _sanitize_path_part(s: str, max_len: int = 200) -> str:
    if not s or not isinstance(s, str):
        return "unknown"

    s = sub(r'[/\\:*?"<>|]', "_", s.strip())

    s = sub(r"\s+", "_", s)

    return (s[:max_len] if len(s) > max_len else s) or "unknown"

async def task_loop() -> None:
    while True:
        try:
            start = time.perf_counter()
            await run_not_ready_tracks_task()
            elapsed = time.perf_counter() - start
            print(f"run_not_ready_tracks_task completed in {elapsed:.2f}s")
        except CancelledError:
            break
        except Exception as e:
            print(e)
        await sleep(5)