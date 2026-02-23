from json import dumps, JSONDecodeError, loads
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from langchain_core.messages import HumanMessage, SystemMessage

from app.constants import KIE_GENERATE_URL, KIE_HEADERS, KIE_RECORD_INFO_URL, SYSTEM_PROMPT
from app.model import get_model

def generate_music_specs(user_prompt: str) -> dict:
    try:
        model = get_model()

        response = model.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt),
        ])

        return loads(response.content)
    except JSONDecodeError as e:
        raise ValueError(f"Gemini response was not valid JSON: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Failed to get music specs: {e}") from e

def generate_music_task(music_specs: dict) -> str:
    try:
        payload = {
            "prompt": music_specs.get("prompt", ""),
            "customMode": True,
            "instrumental": False,
            "model": "V4",
            "callBackUrl": "http://localhost:8000",
            "style": music_specs.get("style", ""),
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