from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parents[1]

load_dotenv(ROOT / ".env")

from app.auth import router as auth_router
from app.music import router as music_router

app = FastAPI(title="ai-music-mind-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_root():
    return {"message": "Hello from ai-music-mind-backend"}

@app.get("/health")
def check_health():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(music_router)