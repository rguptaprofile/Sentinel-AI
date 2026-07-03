from fastapi import FastAPI

from backend.routes import api_router


app = FastAPI(
    title="SentinelAI Public Safety Intelligence API",
    version="0.1.0",
    description="Backend scaffold for scam detection, counterfeit analysis, fraud graph intelligence, geospatial intelligence, and citizen safety workflows.",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "sentinelai-backend"}
