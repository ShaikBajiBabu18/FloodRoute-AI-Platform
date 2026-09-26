# FloodRoute AI — System Architecture Diagram

> End-to-end multi-layer architecture diagram depicting client interfaces, security gateway, microservices, data persistence, and external GIS/weather ingestion pipelines.

---

## 1. Complete Mermaid System Architecture

```mermaid
flowchart TD
    subgraph Clients["1. Client Presentation Layer"]
        CITIZEN["Citizen Web Portal / PWA (Port 8080)<br/>• React 18 + Vite + Tailwind CSS<br/>• MapLibre GL Interactive Spatial Canvas<br/>• Lucide Icons + PWA Offline Service Worker"]
        ADMIN["Authority Command Center (Port 5174)<br/>• React 18 Executive Dashboard<br/>• Live Incident Moderation Deck<br/>• Recharts Analytics & Multi-format Export"]
    end

    subgraph Gateway["2. Central API Gateway & Security (Port 5000)"]
        EXPRESS["Express.js / Node.js Engine (TypeScript)"]
        SECURITY["Security Guardrails<br/>• Helmet.js Header Hardening<br/>• Rate Limiting & CORS Filtering<br/>• Argon2 Password Hashing & Stateless JWT"]
        SOCKET["Socket.IO Telemetry Grid<br/>• Real-time Incident Propagation<br/>• Rooms: live-map, alerts, incident-command"]
        SWAGGER["OpenAPI 3.0 Interactive Docs<br/>• /api/docs Swagger Interface"]
    end

    subgraph Microservices["3. Domain Services & Calculation Engines"]
        WEATHER_SVC["Weather Service<br/>• Open-Meteo Telemetry Ingestion<br/>• In-memory 10m TTL Caching<br/>• Offline Regional Monsoon Baselines"]
        GEO_SVC["Geocoding Service<br/>• OSM Nominatim India Search<br/>• Coordinate Normalization"]
        RISK_SVC["Hydrological Risk Engine<br/>• Multi-Factor Deterministic Formulation<br/>• Rain(35%) + Elev(25%) + Drain(20%) + River(15%) + Crowd(5%)<br/>• Explainable Factor Attribution"]
        ROUTE_SVC["Flood-Aware Routing Engine<br/>• OSRM OpenStreetMap Engine<br/>• Polygon Risk Penalization<br/>• Lower Modeled Risk Corridor Evaluation"]
        AI_SVC["FastAPI Vision Service (Port 8000)<br/>• OpenCV Water Body Segmentation<br/>• Image Depth Estimation in Centimeters"]
    end

    subgraph DataStore["4. Data Persistence & Caching"]
        PRISMA["Prisma ORM (Dual Engine)"]
        POSTGRES["PostgreSQL 16 / SQLite<br/>• 19 Normalized Tables<br/>• Spatial Coordinate Indexes<br/>• Incident & Audit History"]
        MEMORY["In-Memory Operational Cache<br/>• Rate Limits, Sessions, Fallback Baselines"]
    end

    subgraph External["5. External Ingestion & Statutory Feeds"]
        METEO["Open-Meteo Global Radar & Precipitation API"]
        OSM["OpenStreetMap & OSRM Engine"]
        NOMINATIM["Nominatim Spatial Geocoding"]
        NDMA["NDMA / SDMA Disaster Advisory Guidelines"]
        CWC["Central Water Commission River Gauges"]
    end

    %% Client to Gateway
    CITIZEN -->|HTTP / WebSocket| EXPRESS
    ADMIN -->|HTTP / WebSocket| EXPRESS

    %% Gateway to Security & Services
    EXPRESS --> SECURITY
    EXPRESS --> SOCKET
    EXPRESS --> SWAGGER
    EXPRESS --> WEATHER_SVC
    EXPRESS --> GEO_SVC
    EXPRESS --> RISK_SVC
    EXPRESS --> ROUTE_SVC
    EXPRESS -->|HTTP Proxy| AI_SVC

    %% Services to Data
    WEATHER_SVC --> MEMORY
    RISK_SVC --> PRISMA
    ROUTE_SVC --> PRISMA
    EXPRESS --> PRISMA
    PRISMA --> POSTGRES

    %% External Connections
    WEATHER_SVC -.->|REST / JSON| METEO
    GEO_SVC -.->|REST / JSON| NOMINATIM
    ROUTE_SVC -.->|REST / JSON| OSM
    RISK_SVC -.->|Hydrological Data| CWC
    RISK_SVC -.->|Statutory Alerts| NDMA
```

---

## 2. Text-Based Component Pipeline

```text
[Citizen User / Browser]                [Disaster Authority / Command Center]
       │                                                   │
       ▼                                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   API Gateway (Port 5000, Express + TS)                │
│   • JWT Auth / Argon2id   • Helmet Hardening   • Rate Limiting         │
│   • Socket.IO WebSocket Grid                   • OpenAPI / Swagger     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ Weather & Geo    │       │ Hydrological     │       │ Routing Engine   │
│ Service          │       │ Risk Engine      │       │ (OSRM / Spatial) │
│ • Open-Meteo API │       │ • Multi-factor   │       │ • Road Penalties │
│ • Nominatim      │       │   Algorithm      │       │ • Safe Corridor  │
│ • Local Cache    │       │ • Factor Weights │       │   Evaluation     │
└────────┬─────────┘       └─────────┬────────┘       └────────┬─────────┘
         │                           │                         │
         └───────────────────────────┼─────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│            Prisma ORM Layer (PostgreSQL 16 / SQLite Engine)            │
│  • 19 Relational Tables  • Spatial Indexes  • Zero-leak Safe Storage   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│           FastAPI Computer Vision Engine (Port 8000, Python)           │
│  • OpenCV Contour Segmentation  • Flood Depth Estimation (cm)          │
└────────────────────────────────────────────────────────────────────────┘
```
