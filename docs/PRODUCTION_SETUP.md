# Production Setup: Vercel Frontend + FastAPI Backend + MongoDB

Your production frontend is:

```text
https://sentinel-in.vercel.app
```

The browser cannot connect directly to MongoDB. The correct production path is:

```text
Vercel frontend -> VITE_API_BASE_URL -> deployed FastAPI backend -> MongoDB Atlas
```

## 1. MongoDB

Store the MongoDB Atlas connection string only in the root `.env` locally and in backend deployment secrets in production.

Required backend variables:

```text
APP_ENV=production
API_PREFIX=/api/v1
MONGODB_URL=<your MongoDB Atlas connection string>
MONGODB_DB_NAME=sentinel-ai
MONGODB_TIMEOUT_MS=10000
CORS_ORIGINS=["https://sentinel-in.vercel.app"]
AUTH_SESSION_SECRET=<strong-random-secret>
```

Do not commit `.env`.

## 2. Backend

Deploy the FastAPI backend to a public HTTPS host such as Render, Railway, Fly.io, Azure, AWS, or another Vercel-compatible Python backend deployment.

Backend command:

```text
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Backend health URL should work after deployment:

```text
https://<your-backend-domain>/health
```

API docs should work at:

```text
https://<your-backend-domain>/docs
```

## 3. Vercel Frontend

In Vercel Project Settings > Environment Variables, set:

```text
VITE_API_BASE_URL=https://<your-backend-domain>/api/v1
```

Do not set `VITE_API_BASE_URL` to `/api/v1` in production. That makes the browser call Vercel instead of the FastAPI backend and causes 404 errors for signup/signin.

Then redeploy the frontend.

## 4. Verification

Open:

```text
https://sentinel-in.vercel.app
```

The frontend should call:

```text
https://<your-backend-domain>/api/v1/dashboard/stats/police
```

Auth endpoints should respond from the backend, not Vercel:

```text
https://<your-backend-domain>/api/v1/auth/signup
https://<your-backend-domain>/api/v1/auth/signin
```

The backend will read/write MongoDB through the configured `MONGODB_URL`.
