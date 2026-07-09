# SentinelAI Frontend

AI-Powered Digital Public Safety Intelligence Platform — a modern React dashboard for citizens, police, banks, and administrators.

## Tech Stack

- **React 19** + **Vite 8**
- **React Router** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible UI primitives (Radix UI)
- **Lucide React** — icons
- **Recharts** — data visualization
- **React Leaflet** — interactive maps
- **Framer Motion** — animations

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── layout/      # Sidebar, Navbar, DashboardLayout
│   ├── cards/       # StatCard, ChartCard, MapCard
│   ├── charts/      # Recharts visualizations
│   ├── maps/        # Leaflet heat maps, fraud network graph
│   ├── chatbot/     # AI chat widget
│   ├── alerts/      # Alert cards and live feed
│   └── common/      # Shared components (Table, SearchBar, etc.)
├── pages/
│   ├── Landing/     # Marketing landing page
│   ├── Login/       # Role-based authentication
│   ├── Dashboard/   # Command center overview
│   ├── Citizen/     # Citizen safety portal
│   ├── Police/      # Intelligence dashboard
│   ├── Bank/        # Fraud monitoring center
│   └── Admin/       # System administration
├── services/        # Mock API + JSON data
├── context/         # Auth & theme providers
├── hooks/           # Custom React hooks
└── lib/             # Utilities
```

## Demo Login

Select any role on the login page and sign in with any credentials. You'll be routed to the corresponding dashboard.

| Role    | Dashboard Path        |
|---------|-----------------------|
| Citizen | `/dashboard/citizen`  |
| Police  | `/dashboard/police`   |
| Bank    | `/dashboard/bank`     |
| Admin   | `/dashboard/admin`    |

## Theme

| Token      | Color     |
|------------|-----------|
| Primary    | `#2563EB` |
| Dark Blue  | `#0F172A` |
| Background | `#F8FAFC` |
| Success    | `#22C55E` |
| Danger     | `#EF4444` |
| Warning    | `#F59E0B` |
| Accent     | `#38BDF8` |

Toggle dark mode from the dashboard navbar.
