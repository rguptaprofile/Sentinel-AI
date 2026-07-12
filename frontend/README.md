# SentinelAI Frontend

AI-Powered Digital Public Safety Intelligence Platform: a React dashboard for citizens, police, banks, and administrators.

## Tech Stack

- React 19 + Vite 8
- React Router
- Tailwind CSS v4
- shadcn/ui primitives
- Lucide React icons
- Recharts
- React Leaflet
- Framer Motion

## Backend/API Setup

The frontend reads live data from the FastAPI backend. In local development it defaults to:

```text
http://127.0.0.1:8000/api/v1
```

You can override this with `VITE_API_BASE_URL` from the root `.env` or from your hosting provider:

```powershell
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Production frontend runs at:

```text
https://sentinel-in.vercel.app
```

In Vercel, set `VITE_API_BASE_URL` to your deployed backend API, for example:

```text
https://<your-backend-domain>/api/v1
```

MongoDB-backed API data includes dashboard stats, fraud reports, alerts, transactions, heatmap, chart data, network graph, users, citizen reports, scam classification, counterfeit scans, and intelligence fusion analysis.

## Getting Started

```powershell
cd E:\Sentinel-AI\frontend
npm install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Open:

```text
http://127.0.0.1:5173
```

## Build

```powershell
npm.cmd run build
npm.cmd run preview
```

## Project Structure

```text
src/
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── layout/      # Sidebar, Navbar, DashboardLayout
│   ├── cards/       # StatCard, ChartCard, MapCard
│   ├── charts/      # Recharts visualizations
│   ├── maps/        # Leaflet heat maps, fraud network graph
│   ├── chatbot/     # AI chat widget
│   ├── alerts/      # Alert cards and live feed
│   └── common/      # Shared components
├── pages/
│   ├── Landing/
│   ├── Login/
│   ├── Dashboard/
│   ├── Citizen/
│   ├── Police/
│   ├── Bank/
│   └── Admin/
├── services/        # Backend API client + local fallback data
├── context/         # Auth and theme providers
├── hooks/           # Custom React hooks
└── lib/             # Utilities
```

## Demo Login

Select any role on the login page and sign in with any credentials.

| Role | Dashboard Path |
| --- | --- |
| Citizen | `/dashboard/citizen` |
| Police | `/dashboard/police` |
| Bank | `/dashboard/bank` |
| Admin | `/dashboard/admin` |
