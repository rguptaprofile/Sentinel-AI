# SentinelAI

SentinelAI is an AI-powered Digital Public Safety Intelligence platform for fraud detection, counterfeit currency screening, graph intelligence, geospatial crime analysis, and citizen fraud protection.

Production frontend:

```text
https://sentinel-in.vercel.app
```

## Architecture

```text
Vercel React frontend
  |
  | deployed FastAPI backend /api/v1/*
  v
MongoDB-backed auth and FastAPI backend APIs
  |
  | MONGODB_URL from root .env or deployment secrets
  v
MongoDB Atlas
  |
  +-- citizen_reports
  +-- transaction_events
  +-- alerts
  +-- counterfeit_scans
  +-- fraud_graph_nodes
  +-- fraud_graph_edges
  +-- geo_incidents
  +-- model_runs
  +-- users
```

The frontend never connects directly to MongoDB. All data flows through the backend API.

## Main Features

- MongoDB-backed signup/signin with hashed passwords and unique user email checks.
- Real API-first dashboard data with local JSON fallbacks removed.
- MongoDB persistence for reports, alerts, scans, fraud graph, geospatial incidents, model runs, transactions, and users.
- AI model status endpoint with trained artifact tracking.
- Real data-source readiness endpoint for telecom, MHA/NCRB, WhatsApp, speech, geocoding, bank fraud, and currency-image APIs.
- Synthetic baseline generator for unavailable real datasets, clearly marked as synthetic.

## Project Structure

```text
backend/              FastAPI backend
frontend/             React + Vite frontend
ai_models/            Training scripts, artifacts, and synthetic datasets
docs/                 Production setup and project guidance
```

## Environment

Create one root `.env` file. Do not commit it.

Required production values:

```env
APP_ENV=production
API_PREFIX=/api/v1
MONGODB_URL=<mongodb-atlas-connection-string>
MONGODB_DB_NAME=sentinel-ai
MONGODB_TIMEOUT_MS=10000
CORS_ORIGINS=["https://sentinel-in.vercel.app"]
VITE_API_BASE_URL=https://sentinel-ai-backend-qw3h.onrender.com
AUTH_SESSION_SECRET=<strong-random-secret>
```

Optional real-data API keys:

```env
TELECOM_API_BASE_URL=
TELECOM_API_KEY=
MHA_ALERT_API_BASE_URL=
MHA_ALERT_API_KEY=
NCRB_API_BASE_URL=
NCRB_API_KEY=
WHATSAPP_API_BASE_URL=
WHATSAPP_API_KEY=
SPEECH_AI_API_BASE_URL=
SPEECH_AI_API_KEY=
GEOCODING_API_BASE_URL=
GEOCODING_API_KEY=
BANK_FRAUD_API_BASE_URL=
BANK_FRAUD_API_KEY=
CURRENCY_IMAGE_API_BASE_URL=
CURRENCY_IMAGE_API_KEY=
```

MongoDB passwords inside `MONGODB_URL` must be URL encoded. Example: `#` becomes `%23`, `@` becomes `%40`.

## Backend Setup

```powershell
cd E:\Sentinel-AI
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Useful backend URLs:

```text
https://sentinel-ai-backend-qw3h.onrender.com/health
https://sentinel-ai-backend-qw3h.onrender.com/docs
https://sentinel-ai-backend-qw3h.onrender.com/api/v1
```

## Frontend Setup

```powershell
cd E:\Sentinel-AI\frontend
npm install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Local frontend:

```text
http://127.0.0.1:5173
```

Build:

```powershell
npm.cmd run build
```

## Auth Flow

Signup:

```text
POST /api/v1/auth/signup
```

Signin:

```text
POST /api/v1/auth/signin
```

Users are stored in MongoDB in the `users` collection. Passwords are stored as PBKDF2 hashes, not plain text.

## AI Models

The platform tracks five core AI capability areas:

- Digital Arrest Scam Detection and Alerting
- Counterfeit Currency Identification Agent
- Fraud Network Graph Intelligence
- Geospatial Crime Pattern Intelligence
- Citizen Fraud Shield

Model status:

```text
GET /api/v1/intelligence/models/status
```

Data-source readiness:

```text
GET /api/v1/intelligence/data-sources/status
GET /api/v1/intelligence/training/readiness
```

## Real Training

Real training requires licensed datasets. See:

```text
ai_models/training/DATASETS.md
```

Install optional AI dependencies:

```powershell
python -m pip install -r requirements-ai.txt
```

Train with real datasets:

```powershell
python ai_models\training\train_all.py `
  --digital-arrest-data E:\datasets\digital_arrest.csv `
  --counterfeit-data E:\datasets\counterfeit_notes\data.yaml `
  --fraud-graph-data E:\datasets\fraud_graph_edges.csv `
  --geospatial-data E:\datasets\geo_incidents.csv `
  --citizen-shield-data E:\datasets\citizen_shield.csv
```

## Synthetic Baselines

When real datasets/API feeds are unavailable, the repo can generate 500 synthetic records per model for workflow testing only:

```powershell
python ai_models\training\train_synthetic_baselines.py
```

These artifacts are marked as `synthetic: true` and must not be represented as real-world trained models.

## Production Deployment

1. Deploy backend to a public HTTPS host.
2. Set backend secrets:

```text
MONGODB_URL=<mongodb-atlas-connection-string>
MONGODB_DB_NAME=sentinel-ai
CORS_ORIGINS=["https://sentinel-in.vercel.app"]
```

3. Set Vercel frontend env:

```text
VITE_API_BASE_URL=https://sentinel-ai-backend-qw3h.onrender.com
MONGODB_URL=<mongodb-atlas-connection-string>
MONGODB_DB_NAME=sentinel-ai
AUTH_SESSION_SECRET=<strong-random-secret>
```

Signup, signin, `/auth/me`, and all other API calls use the deployed FastAPI backend directly.

4. Redeploy Vercel frontend.

5. Verify:

```text
https://<backend-domain>/health
https://sentinel-in.vercel.app/api/v1/auth/signin
https://sentinel-in.vercel.app
```

## Presentation Deck

Suggested deck outline:

1. Problem: digital arrest scams, counterfeit currency, fraud networks, cybercrime hotspots.
2. Solution: SentinelAI unified intelligence platform.
3. Architecture: Vercel frontend, FastAPI backend, MongoDB Atlas, AI model artifacts.
4. Core modules: scam detection, counterfeit detection, fraud graph, geospatial intelligence, citizen shield.
5. Data governance: real API keys, MongoDB persistence, no fake fallback data.
6. Deployment: frontend on Vercel, backend on HTTPS host, MongoDB Atlas.
7. Roadmap: real agency integrations, production ML training, audit evidence workflows.

## Security Notes

- Keep `.env` out of git.
- Rotate any API keys that were ever committed or pasted into shared files.
- Do not expose MongoDB credentials to frontend code.
- Restrict MongoDB Atlas network access to trusted backend hosts.
