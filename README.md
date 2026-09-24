# FloodRoute AI

> **AI-Powered Flood-Aware Route Planning, Weather Intelligence, Community Reporting and Emergency Alert Platform for India**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue.svg)](https://www.python.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-darkblue.svg)](https://www.prisma.io/)
[![MapLibre GL](https://img.shields.io/badge/Maps-MapLibre%20GL-teal.svg)](https://maplibre.org/)

---

## 1. Project Overview

**FloodRoute AI** is a full-stack disaster-response and flood-resilient transit intelligence platform engineered specifically for the Indian subcontinent. It aggregates live weather telemetry, official disaster bulletins from government authorities (NDMA/SACHET, IMD, CWC), verified crowdsourced hazard observations, and computer-vision-analyzed imagery to calculate safer travel routes and coordinate emergency relief.

### The Problem It Solves
During severe monsoon cloudbursts and urban inundation events in cities such as Chennai, Mumbai, Bengaluru, and Hyderabad, standard turn-by-turn navigation applications continue routing commuters through submerged underpasses, stalled arterial bridges, and overflowing water channels. This results in trapped vehicles, engine hydrolocking, and hindered emergency responder transit.

FloodRoute AI addresses this by evaluating transit corridors against:
- High-intensity precipitation rates (mm/hr)
- Verified road closures and water levels
- Proximity to active statutory flash flood warnings
- Multi-band computer vision estimates of ground submergence

---

## 2. Key Capabilities & Features

1. **Real Interactive Map (MapLibre GL JS)**:
   - India-wide zoom, pan, and geocoded location search.
   - 11 configurable data layers: Roads, Flood Risk, Road Conditions, Community Reports, Official Alerts, Rainfall, Emergency Resources, Shelters, Hospitals, Police, and Fire Stations.
   - Standardized visual risk legend (Safe, Caution, High Risk, Flooded, Blocked, Emergency Resource, Official Alert).

2. **Dynamic Explainable Route Scoring Engine**:
   - Computes driving routes via Open Source Routing Machine (OSRM) with fallback geometry.
   - Evaluates risk score (0–100) and risk level (LOW, MODERATE, HIGH, CRITICAL).
   - Provides plain-English explanations: *"HIGH RISK because: Heavy rainfall forecast, Verified flooding 2.1 km ahead, Active official warning"*.

3. **Weather Intelligence**:
   - 10 atmospheric parameters (Temperature, Feels Like, Humidity, Wind Speed, Wind Direction, Barometric Pressure, Cloud Cover, Rainfall Rate, Ground Visibility, Weather Condition).
   - Recharts 24-hour hourly and 7-day synoptic forecast horizons.

4. **Flood Intelligence Matrix**:
   - Strict source segregation: `OFFICIAL DATA`, `COMMUNITY DATA`, `WEATHER-DERIVED RISK`, and `AI ESTIMATE`.
   - Continuous verification ensuring no synthetic data is labeled official.

5. **Community Hazard Reporting**:
   - Field submission form covering 8 hazard categories, severity rankings, water levels, and photo attachments.
   - Generates standardized tracking codes (e.g. `FR-2026-000182`).

6. **AI-Assisted Computer Vision (OpenCV + FastAPI)**:
   - Automated water segmentation, HSV mud and reflection classification, Laplacian texture variance checks, and road axle clearance estimates.
   - Clear disclaimers stating AI results are auxiliary estimates.

7. **Emergency Facilities Directory**:
   - Live distance calculation for hospitals, trauma units, police cells, fire stations, and municipal relief shelters.
   - One-touch "Navigate Here" routing.

8. **Incident Command Admin Console**:
   - Independent dashboard with role-based access control (SUPER_ADMIN, ADMIN, MODERATOR, ANALYST).
   - Full-screen operations map with rapid dispatch drawer (Approve, Reject, Resolve, Change Severity).
   - Road condition manager, alert broadcast publisher, AI analytics, user management, and audit logs.

9. **Real-Time WebSocket Mesh (Socket.IO)**:
   - Instant bi-directional broadcasts across admin and citizen clients when reports are verified or road statuses change.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Citizen Web App** | React 18, Vite, TypeScript, Tailwind CSS, MapLibre GL, Recharts, TanStack Query, Lucide Icons |
| **Admin Dashboard** | React 18, Vite, TypeScript, Tailwind CSS, Dark Navy Theme, MapLibre GL, Recharts |
| **Backend Gateway** | Node.js, Express, TypeScript, Prisma ORM, Socket.IO, JWT, bcryptjs, Zod, Helmet, CORS, Multer |
| **AI Microservice** | Python 3.8+, FastAPI, OpenCV (`opencv-python-headless`), NumPy, Pillow, Uvicorn |
| **Database** | PostgreSQL (Production / Docker) & SQLite (Local zero-config dev mode) |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles |

---

## 4. Architecture & Monorepo Structure

```
floodroute-ai/
├── apps/
│   ├── web/            # Citizen Web Application (Port 5173)
│   ├── admin/          # Incident Command Dashboard (Port 5174)
│   └── ai-service/     # Python FastAPI OpenCV Vision Service (Port 8000)
├── server/             # Express & Socket.IO Central API Gateway (Port 5000)
├── packages/
│   └── shared/         # Common TypeScript types, risk engine, constants, Zod schemas
├── prisma/             # Database schema (SQLite & PostgreSQL) and seed scripts
├── docs/               # In-depth architectural, database, API and deployment specifications
├── docker-compose.yml  # Multi-container orchestration
├── package.json        # Workspace orchestrator
└── .env.example        # Environment variable template
```

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js >= 20.x and npm >= 10.x
- Python >= 3.8 with `pip`

### Step 1: Install Dependencies
```bash
# In the project root
npm install

# Build shared package
npm run build --workspace=@floodroute/shared
```

### Step 2: Set Up Database & Seed Realistic Records
```bash
# Push schema to local database
npm run db:push

# Seed development admin, sample cities, and incident records
npm run db:seed
```

### Step 3: Run the Microservices
You can run all services concurrently:
```bash
# Starts backend server (5000), web app (5173), and admin app (5174)
npm run dev
```

To run the Python AI Vision Service alongside:
```bash
# In a separate terminal or via dev:all
python -m uvicorn app.main:app --app-dir apps/ai-service --port 8000 --reload
```

---

## 6. Accessing the Applications

- **Citizen Web App**: [http://localhost:5173](http://localhost:5173)
- **Incident Command Admin**: [http://localhost:5174](http://localhost:5174)
- **Backend API Gateway**: [http://localhost:5000](http://localhost:5000)
- **AI Microservice**: [http://localhost:8000](http://localhost:8000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### Development Credentials
- **Admin Email**: `admin@floodroute.ai`
- **Admin Password**: `ChangeMe123!`
- **Citizen Email**: `citizen@floodroute.ai`
- **Citizen Password**: `Citizen123!`

---

## 7. Running Tests
```bash
npm test
```

---

## 8. Data Source Integrity Policy
FloodRoute AI enforces an absolute zero-fake-data policy. If an external API is down or throttled, the application shows an explicit **"Data temporarily unavailable"** state. All seeded records are visibly stamped with `[DEMO DATA]`.
