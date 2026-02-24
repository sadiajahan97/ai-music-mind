from asyncio import CancelledError, sleep
from json import dumps, JSONDecodeError, loads
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from langchain_core.messages import HumanMessage, SystemMessage

from app.constants import KIE_GENERATE_URL, KIE_HEADERS, KIE_RECORD_INFO_URL, SYSTEM_PROMPT
from app.db import get_db
from app.model import get_model

def generate_music_specs(user_prompt: str, mood: str = "") -> dict:
    try:
        model = get_model()

        human_content = user_prompt

        if mood:
            human_content = f"Mood: {mood}\n\n{user_prompt}"

        response = model.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=human_content),
        ])

        return loads(response.content)
    except JSONDecodeError as e:
        raise ValueError(f"Gemini response was not valid JSON: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get music specs: {e}") from e

def generate_music_task(music_specs: dict, style: str = "") -> str:
    try:
        payload = {
            "prompt": music_specs.get("prompt", ""),
            "customMode": True,
            "instrumental": False,
            "model": "V4",
            "callBackUrl": "http://localhost:8000",
            "style": style,
            "title": music_specs.get("title", ""),
            "vocalGender": music_specs.get("vocalGender", "m"),
        }

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
            where={"isReady": False},
        )

        ids = [t.id for t in tracks]

        for task_id in ids:
            try:
                info = get_music_task_info(task_id)

                if info.get("status") in ("FIRST_SUCCESS", "SUCCESS") and info.get("sunoData"):
                    suno = info["sunoData"]

                    duration = suno.get("duration")

                    await prisma.musictrack.update(
                        where={"id": task_id},
                        data={
                            "downloadUrl": suno.get("audioUrl"),
                            "duration": int(duration * 1000) if duration is not None else None,
                            "imageUrl": suno.get("imageUrl"),
                            "isReady": True,
                            "model": suno.get("modelName"),
                            "streamUrl": suno.get("streamAudioUrl"),
                            "tags": suno.get("tags"),
                        },
                    )
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)
    finally:
        await gen.aclose()

async def task_loop() -> None:
    while True:
        try:
            await run_not_ready_tracks_task()

            print("Not-ready tracks task completed successfully.")
        except CancelledError:
            break
        except Exception as e:
            print(e)
        await sleep(30)