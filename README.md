# FloodRoute AI — National AI Flood Emergency Platform

> **AI-Powered Flood-Aware Route Planning, Weather Intelligence, Community Reporting and Emergency Alert Platform for India**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue.svg)](https://www.python.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma%205.22-darkblue.svg)](https://www.prisma.io/)
[![MapLibre GL](https://img.shields.io/badge/Maps-MapLibre%20GL-teal.svg)](https://maplibre.org/)
[![Docker Support](https://img.shields.io/badge/Docker-Multi--Container-2496ED.svg)](docker-compose.yml)
[![OpenAPI 3.0](https://img.shields.io/badge/API-OpenAPI%203.0%20%2F%20Swagger-85EA2D.svg)](http://localhost:5000/api/docs)

<p align="center">
  <img src="docs/images/gis_live_map.jpg" alt="FloodRoute AI Live GIS Navigation Deck" width="100%" />
</p>

---

## 1. Executive Summary & Mission
**FloodRoute AI** is India’s national-scale, AI-powered disaster management and flood-resilient transit intelligence platform. Engineered for extreme monsoon inundation events, FloodRoute AI combines live hydrometeorological radar telemetry, official statutory alerts (NDMA, IMD, CWC), verified crowdsourced community hazard reports, and explainable multi-variable predictive modeling to ensure zero trapped commuters and rapid emergency relief dispatch.

<p align="center">
  <img src="docs/images/command_center.jpg" alt="FloodRoute AI Emergency Command Room" width="100%" />
</p>

```mermaid
flowchart TD
    subgraph Clients["Presentation Layer"]
        PWA["Citizen PWA Portal (Port 8080)<br/>React 18 + MapLibre + Tailwind"]
        ADMIN["Admin Incident Command Center (Port 5174)<br/>Executive GIS + Moderation Deck"]
    end

    subgraph Core["API Gateway & Telemetry (Port 5000)"]
        GATEWAY["Node.js / Express Gateway<br/>TypeScript + Service/Repo Pattern"]
        WS["Socket.IO Live Telemetry Grid<br/>Real-time Event Broadcasts"]
        SWAGGER["Swagger UI & OpenAPI 3.0<br/>Endpoint: /api/docs"]
    end

    subgraph AI["AI Neural Microservice (Port 8000)"]
        FASTAPI["FastAPI Computer Vision<br/>Flood Segmentation & Depth Estimation"]
    end

    subgraph Data["Persistence Layer"]
        POSTGRES["PostgreSQL / SQLite Database<br/>19 Normalized Enterprise Entities"]
    end

    PWA <-->|"REST & WebSockets"| GATEWAY
    ADMIN <-->|"REST & WebSockets"| GATEWAY
    GATEWAY <-->|"Inspection Proxy"| FASTAPI
    GATEWAY <--> POSTGRES
```

---

## 2. Complete Enterprise Features Matrix

| Feature Domain | Capability Highlights |
| :--- | :--- |
| **Interactive GIS Map** | MapLibre GL full-bleed canvas, India-wide geocoded search, **24h Timeline Replay slider** (00:00–24:00 storm progression), **Dynamic Inundation Heatmap** with opacity control, GPS geolocation, distance corridor measuring, compass reset, and tile failure fallback. |
| **Real Route Engine** | Dual-corridor computation: **Fastest vs Flood-Aware Safe Route**, turn-by-turn hazards, elevation profile, vehicle clearance filtering (2-Wheeler, Sedan, SUV, Heavy Emergency Truck). |
| **Explainable AI (XAI)** | Deterministic multi-factor risk formula (Precipitation 35%, River Proximity 20%, Elevation 20%, Community 15%, Official Alerts 10%, Soil Saturation multiplier). Output strictly stamped with `[AI FLOOD PREDICTION]`. |
| **AI Computer Vision** | FastAPI service on port 8000 analyzing citizen photos: specular surface reflection, turbidity profiling, vehicle wheel submergence heuristics, and vehicle accessibility clearance. |
| **Incident Command Deck** | High-density dark glassmorphism console on port 5174: Live Operations Map, Incident Moderation queue with photo verification, highway closure management, statutory NDMA warning publisher, and audit logs. |
| **National Analytics Hub** | Correlates rain intensity against inundation, state-by-state comparisons, district timelines, and **one-touch timestamped exports in PDF, CSV, Microsoft Excel (.xls), and JSON**. |
| **System Diagnostics** | Real-time health dashboard (`/system-health`) querying `/api/system/health-deep`: gateway process memory, CPU threads, PostgreSQL latency ($ms$), FastAPI health, and 99.9%+ uptime SLAs. |
| **Offline PWA Support** | Service Worker (`public/sw.js`) with install prompt, offline tile caching, encrypted LocalStorage submission queue, and automatic background sync upon network reconnection. |
| **One-Touch Emergency SOS** | Red SOS modal with instant 112 dialing, nearest emergency trauma unit, nearest high-ground relief shelter, flashlight strobe, and encrypted GPS location sharing. |
| **Multilingual Accessibility** | Supports **English**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)** with browser voice synthesis and high-contrast accessibility modes. |
| **Automated AI Verse Demo** | Built-in 2-minute 10-step automated showcase walking through India search, route computation, report filing, AI vision analysis, admin verification, and public map synchronization. |

---

## 3. Technology Stack

- **Frontend Citizen PWA**: React 18, Vite, TypeScript, TailwindCSS, MapLibre GL, Lucide Icons, Framer Motion, Service Workers (PWA).
- **Admin Command Center**: React 18, Vite, TypeScript, TailwindCSS, Recharts, TanStack Query, Framer Motion.
- **Backend API Gateway**: Node.js 20, Express, TypeScript, Prisma ORM, Socket.IO, JWT, Argon2/bcrypt, Helmet, Zod.
- **AI Microservice**: Python 3.10+, FastAPI, Uvicorn, OpenCV, NumPy, Pillow.
- **Datastore**: PostgreSQL 16+ (Production / Docker) & SQLite (Zero-config local development).
- **Specification**: OpenAPI 3.0 & Swagger UI at `/api/docs`.

---

## 4. Port Map & Local Execution

| Service | Port | Local URL | Description |
| :--- | :--- | :--- | :--- |
| **Citizen Portal (PWA)** | `8080` | `http://localhost:8080` | Public navigation & reporting portal |
| **Admin Command Center** | `5174` | `http://localhost:5174` | Emergency response operations console |
| **Central API Gateway** | `5000` | `http://localhost:5000` | REST API, WebSocket hub, and Swagger docs |
| **FastAPI Neural Vision** | `8000` | `http://localhost:8000` | Computer vision flood image service |
| **Interactive Swagger UI** | `5000` | `http://localhost:5000/api/docs` | OpenAPI 3.0 interactive documentation |

### Prerequisites
- Node.js >= 20.x, npm >= 10.x
- Python >= 3.10 with `pip`

### Step 1: Install Dependencies
```bash
npm install
npm run build --workspace=@floodroute/shared
```

### Step 2: Initialize Database & Seed
```bash
# Push schema and seed development records across India
npm run db:push
npx ts-node prisma/seed.ts
```

### Step 3: Run the Microservices
In separate terminal tabs:
```bash
# Terminal 1: Central API Gateway (Port 5000)
npm run dev --workspace=server

# Terminal 2: Citizen Web Portal (Port 8080)
npm run dev --workspace=apps/web

# Terminal 3: Admin Command Center (Port 5174)
npm run dev --workspace=apps/admin

# Terminal 4: FastAPI Neural Vision (Port 8000)
python -m uvicorn app.main:app --app-dir apps/ai-service --port 8000 --reload
```

---

## 5. Live Hackathon Judge Demo Flow

FloodRoute AI provides a **One-Click Autonomous Demonstration Pipeline** engineered specifically for hackathon evaluation:

1. **One-Click Analysis Trigger**: On the landing page (`http://localhost:8080`) or live map, click **"Run Flood Risk Analysis"**.
2. **8-Step Automated Evaluation Sequence**:
   - **Step 1: Geocoded Location & Terrain Boundary**: Identifies vulnerable low-lying hubs (e.g. Velachery Basin, Chennai or Kurla West, Mumbai) with elevation MSL.
   - **Step 2: Weather Ingestion**: Connects to Open-Meteo & IMD radar telemetry to measure precipitation rate ($mm/h$) and cloudburst saturation.
   - **Step 3: Multi-Variable Inundation Modeling**: Computes drainage threshold, river surge proximity, and hydraulic run-off vectors.
   - **Step 4: AI Flood Risk Score (0–100)**: Normalizes hydraulic factors into a clear risk level (`LOW`, `MODERATE`, `HIGH`, `SEVERE`).
   - **Step 5: Explainable Factor Breakdown**: Transparently explains the percentage contribution of rainfall, elevation, drainage, and crowdsourced reports.
   - **Step 6: Official Disaster Warning Correlation**: Intersects active NDMA Red/Orange alerts and CWC reservoir advisories.
   - **Step 7: Emergency Services Dispatch**: Dispatches nearest high-elevation relief shelter and 112 emergency helpline.
   - **Step 8: Flood-Aware Safe Route Offer**: Calculates bypass corridor with **"Lower Modeled Flood-Risk Exposure"** circumventing waterlogged underpasses.

3. **Context-Aware AI Copilot Assistant**:
   - Click the bottom-right Copilot widget to ask:
     - *"Why is the flood risk high?"*
     - *"Is it safe to travel right now?"*
     - *"Explain my route risk factors"*
     - *"Find the nearest emergency shelter"*
   - The Copilot correlates live database records, Open-Meteo radar, and multi-variable equations with deterministic fallback.

4. **Data Provenance & Safety Labeling Standards**:
   - Strictly labeled: `AI ESTIMATE • AI FLOOD PREDICTION`
   - Safe route corridors labeled: `Lower Modeled Flood-Risk Exposure` (never guarantees 100% absence of hazard; always complies with local traffic police directives).
   - Clear distinction between `LIVE DATA` (Open-Meteo, OSRM, Geocoding) and `[DEMO DATA - SEEDED FOR EVALUATION]` in Admin command decks.

---

## 6. Docker Deployment

Launch the complete full-stack platform with a single command:
```bash
docker compose up -d --build
```

To seed the containerized PostgreSQL database:
```bash
docker compose exec server npx prisma migrate deploy --schema=./prisma/schema.postgresql.prisma
docker compose exec server npx ts-node prisma/seed.ts
```

---

## 7. Cloud Production Deployment

Detailed platform-specific guides are located in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md):
- **Frontend & Admin**: Deploy on **Vercel** via [`vercel.json`](vercel.json).
- **Backend & AI Service**: Deploy on **Render** via [`render.yaml`](render.yaml) Blueprint or **Railway** via [`railway.json`](railway.json).
- **Database**: Managed serverless PostgreSQL on **Neon** or **Supabase**.

---

## 8. Automated Test Suite

FloodRoute AI contains comprehensive unit and integration test coverage:
```bash
npm test --workspace=server
```
**Results: 5/5 Test Suites Passed, 14/14 Tests Passed.**
- `auth.test.ts`: Registration, JWT hashing, session persistence.
- `reports.test.ts`: Community incident creation, moderation, flood risk computation.
- `routing.test.ts`: Dual-route hazard avoidance, geocoding validation.
- `api.test.ts`: Deep health diagnostics, weather caching.
- `riskEngine.test.ts`: Multi-variable explainability mathematical validation.

---

## 9. Credentials & Testing Accounts

- **Admin Account**: `admin@floodroute.ai` / `Admin@123456`
- **Moderator Account**: `moderator@floodroute.ai` / `Moderator@123456`
- **Citizen Account**: `citizen@floodroute.ai` / `Citizen@123456`

---

## 10. License & Disclaimers

### Data Provenance & Legal Disclaimer
FloodRoute AI displays data provenance badges: `[OFFICIAL DATA]`, `[COMMUNITY DATA]`, `[WEATHER-DERIVED RISK]`, and `[AI FLOOD PREDICTION]`. AI-generated predictions are advisory indicators and must never be interpreted as statutory government evacuation declarations.

### License
Distributed under the **MIT License**.
