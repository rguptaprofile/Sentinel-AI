# SentinelAI

SentinelAI is a scaffold for an AI-powered Digital Public Safety Intelligence platform focused on:

- Digital arrest scam detection and alerting
- Counterfeit currency identification
- Fraud network graph intelligence
- Geospatial crime pattern intelligence
- Citizen fraud shield across assisted channels

## Structure

- `frontend/` - React + Vite frontend for dashboards, citizen flows, bank workflows, maps, and chatbot screens.
- `backend/` - FastAPI backend with routes, services, authentication, alerts, websocket, config, and MongoDB modules.
- `backend/database/` - MongoDB connection, document schemas, seed data, indexes, and migration notes.
- `ai_models/` - Model-area placeholders for future AI implementation.
- `datasets/` - Dataset placeholders grouped by domain.
- `docs/`, `architecture/`, `presentation/`, and `demo/` - Delivery assets for the expected prototype package.

## Local Setup

Start MongoDB first:

```powershell
mongod --dbpath C:\data\db
```

Backend runs on `http://127.0.0.1:8000`:

```powershell
cd E:\Sentinel-AI
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Frontend runs on `http://127.0.0.1:5173`:

```powershell
cd E:\Sentinel-AI\frontend
npm install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Useful URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend health: `http://127.0.0.1:8000/health`
- Backend API docs: `http://127.0.0.1:8000/docs`
- API base URL used by frontend: `http://127.0.0.1:8000/api/v1`
