# Production Setup: Vercel Frontend + FastAPI Backend + MongoDB

Your production frontend is:

```text
https://sentinel-in.vercel.app
```

The browser cannot connect directly to MongoDB. The correct production path is:

```text
Vercel frontend -> /api/v1/auth on Vercel -> MongoDB Atlas
Vercel frontend -> /api/v1 non-auth proxy -> deployed FastAPI backend
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
VITE_API_BASE_URL=/api/v1
MONGODB_URL=<your MongoDB Atlas connection string>
MONGODB_DB_NAME=<your database name>
AUTH_SESSION_SECRET=<strong-random-secret>
BACKEND_API_BASE_URL=https://<your-backend-domain>
```

`MONGODB_DB_NAME` and `AUTH_SESSION_SECRET` must have the same values in both
Render and Vercel. The shared session secret lets the deployed FastAPI API
verify the bearer token issued by the Vercel auth route.

Do not set `VITE_API_BASE_URL` to `http://127.0.0.1:8000` or `localhost` in
Vercel. Those addresses only work during local development and point to each
visitor's device once the frontend is deployed. The production default is the
same-origin Vercel route, `/api/v1`.

Signup, signin, and `/auth/me` are served by Vercel API routes and write to MongoDB directly. Other `/api/v1/*` requests are proxied to `BACKEND_API_BASE_URL`.

Then redeploy the frontend.

## 4. Verification

Open:

```text
https://sentinel-in.vercel.app
```

The frontend should call:

```text
https://sentinel-in.vercel.app/api/v1/dashboard/stats/police
```

Auth endpoints should respond from the Vercel API route:

```text
https://sentinel-in.vercel.app/api/v1/auth/signup
https://sentinel-in.vercel.app/api/v1/auth/signin
```

The backend will read/write MongoDB through the configured `MONGODB_URL`.
