from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config.settings import settings
from backend.database.connection import init_db
from backend.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="SentinelAI Public Safety Intelligence API",
    version="0.1.0",
    description="Backend scaffold for scam detection, counterfeit analysis, fraud graph intelligence, geospatial intelligence, and citizen safety workflows.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "sentinelai-backend",
        "health": "/health",
        "docs": "/docs",
        "api": settings.api_prefix,
    }


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "sentinelai-backend"}
