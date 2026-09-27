# FloodRoute AI Platform — System Architecture

**Document Purpose:** Architectural specification of the FloodRoute AI Platform for hackathon submission and technical evaluation.

---

## 1. High-Level Text Architecture Diagram

```text
                                  USER
                                    │
                                    ▼
                         WEB APPLICATION (Port 8080)
                         [React 18 + Vite + Tailwind]
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
          GIS MAP / UI CORE                     AI ASSISTANT (Copilot)
        [Leaflet Canvas + Controls]             [Contextual Natural Language]
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    │ HTTP / REST / JSON
                                    ▼
                     CENTRAL APPLICATION API GATEWAY (Port 5000)
                     [Express.js + TypeScript + Helmet + Joi]
                                    │
        ┌───────────────────┬───────┴───────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼
   WEATHER ADAPTER     FLOOD-RISK ENGINE   ROUTING SERVICE     EMERGENCY DATA
   [Open-Meteo API]    [5-Factor Model]    [OSRM Routing]      [Shelters & Hospitals]
        │                   │                   │                   │
        │                   │                   │                   │
        └───────────────────┼───────────────────┼───────────────────┘
                            │                   │
                            ▼                   ▼
                     PYTHON AI SERVICE       DATABASE (SQLite / Prisma)
                     [FastAPI Port 8000]     [Incident Reports, Users,
                     [Computer Vision CV]     Disaster Bulletins, Resources]
                                                        │
                                                        ▼
                                            ADMIN / ANALYTICS (Port 5174)
                                            [Incident Triage, Alert Dispatch,
                                             Vulnerability Metrics, Audit Logs]
```

---

## 2. Component Descriptions

### Client Layer (`apps/web` & `apps/admin`)
- **Citizen Web Portal (Port 8080):** Mobile-first React application providing interactive Leaflet GIS mapping, real-time weather cards, turn-by-turn route planning, one-tap emergency calling, citizen hazard crowdsourcing, and the conversational AI Copilot.
- **Incident Command Center (Port 5174):** Administrative dashboard allowing disaster response personnel to triage citizen-submitted road hazards, review computer-vision water depth estimates, and dispatch geo-targeted disaster bulletins.

### Application API Gateway (`server` on Port 5000)
- **Framework:** Express.js in TypeScript with strict request validation via Joi.
- **Security:** HTTP header hardening via Helmet, Cross-Origin Resource Sharing (CORS), and global/per-route rate limiting.
- **Service Modules:**
  - **Weather Adapter:** Queries the Open-Meteo meteorological observation grid for precipitation ($mm/h$), temperature, and wind.
  - **Flood-Risk Engine:** Evaluates coordinates against rain intensity, topographic elevation, soil saturation, river proximity, and citizen hazard reports.
  - **Routing Service:** Coordinates with Open Source Routing Machine (OSRM) to calculate candidate trajectories, samples road waypoints against flood risk buffers, and recommends elevated bypasses with lower modeled flood-risk exposure.
  - **Emergency Service:** Queries nearby high-ground shelters, NDRF liaison camps, and hospitals indexed with contact information.

### Computer Vision AI Engine (`apps/ai-service` on Port 8000)
- **Framework:** FastAPI Python microservice.
- **Functionality:** Ingests citizen-uploaded photos of flooded roads, processes surface reflectivity and water coverage percentage via OpenCV, and estimates vehicle clearance passability.

### Persistence Layer (`prisma`)
- **ORM:** Prisma ORM connected to SQLite in development (with PostgreSQL schema compatibility for production).
- **Entities:** Normalized data models for Users, FloodReports, DisasterAlerts, EmergencyResources, and RoadConditions.
