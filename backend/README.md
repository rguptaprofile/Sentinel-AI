# SentinelAI Backend

FastAPI backend for SentinelAI. Runtime persistence uses MongoDB.

## Requirements

- Python 3.11+
- MongoDB running locally or a reachable MongoDB URI

## Environment

Copy `backend/.env.example` to `.env` at the repo root or export the same variables:

```powershell
APP_ENV=development
API_PREFIX=/api/v1
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=sentinelai
MONGODB_TIMEOUT_MS=5000
```

## Install

```powershell
cd E:\Sentinel-AI
python -m pip install -r backend\requirements.txt
```

## Run

```powershell
cd E:\Sentinel-AI
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Backend will run at:

- API root: `http://127.0.0.1:8000`
- Health: `http://127.0.0.1:8000/health`
- API docs: `http://127.0.0.1:8000/docs`
- Versioned API: `http://127.0.0.1:8000/api/v1`

On startup the app pings MongoDB, creates indexes, and inserts demo data if collections are empty.
