# SentinelAI Backend

FastAPI backend for SentinelAI. Runtime persistence uses MongoDB.

## Requirements

- Python 3.11+
- MongoDB running locally or a reachable MongoDB URI

## Environment

Store backend secrets in the root `.env` file. Do not commit `.env`.

```powershell
APP_ENV=production
API_PREFIX=/api/v1
MONGODB_URL=mongodb+srv://<username>:<url-encoded-password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
MONGODB_DB_NAME=sentinel-ai
MONGODB_TIMEOUT_MS=10000
CORS_ORIGINS=["https://sentinel-in.vercel.app"]
```

For local development you can use `MONGODB_URL=mongodb://localhost:27017` and add `http://127.0.0.1:5173` to `CORS_ORIGINS`.

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
