from dotenv import load_dotenv
from pathlib import Path

from fastapi import FastAPI

ROOT = Path(__file__).resolve().parents[1]

load_dotenv(ROOT / ".env")

from app.music import router as music_router

app = FastAPI(title="ai-music-mind-backend")

@app.get("/")
def get_root():
    return {"message": "Hello from ai-music-mind-backend"}

@app.get("/health")
def check_health():
    return {"status": "ok"}

app.include_router(music_router)