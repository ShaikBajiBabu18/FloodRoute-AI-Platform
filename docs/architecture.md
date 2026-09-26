# FloodRoute AI — Enterprise System Architecture Specification

## 1. Executive Summary & Platform Mission
**FloodRoute AI** is India's national-scale AI-powered disaster response, flood-aware route planning, hydrological intelligence, and emergency coordination platform. Built for resilient low-bandwidth operation, real-time spatial awareness, and explainable multi-factor predictive modeling, FloodRoute AI connects citizens, district magistrates, first responders, and emergency command centers during extreme monsoon inundation events.

---

## 2. High-Level Distributed Architecture

```mermaid
flowchart TD
    subgraph Clients["Client Layer"]
        PWA["Citizen Web Portal / PWA (Port 8080)<br/>React 18 + Tailwind + MapLibre GL"]
        ADMIN["Admin Incident Command Center (Port 5174)<br/>Executive GIS + Moderation Deck"]
        EDGE_IOT["IoT Water Level Sensors / Edge Gateways<br/>CWC Ultrasonic Stage Gauges"]
    end

    subgraph Gateway["API Gateway & Real-time Telemetry (Port 5000)"]
        EXPRESS["Node.js / Express Gateway<br/>TypeScript + Helmet + Rate Limiter"]
        WS_HUB["Socket.IO Telemetry Grid<br/>Rooms: live-map, incidents, district-cmd"]
        SWAGGER["OpenAPI 3.0 & Swagger UI<br/>Endpoint: /api/docs"]
    end

    subgraph CoreServices["Domain Microservices (Service / Repository Pattern)"]
        AUTH_SVC["Authentication & RBAC<br/>JWT + Argon2"]
        ROUTING_SVC["Flood-Aware Routing Engine<br/>OSRM Integration + Polygon Penalties"]
        WEATHER_SVC["Hydrometeorological Ingestion<br/>Open-Meteo + IMD Radar Cache"]
        PREDICT_SVC["Explainable AI Risk Engine<br/>Weighted Hydrological Matrix"]
        REPORT_SVC["Community Report Pipeline<br/>Deduplication & Sentinel Moderation"]
        RIVER_SVC["CWC River Telemetry<br/>Discharge & Stage Thresholds"]
    end

    subgraph AIService["AI Computer Vision Microservice (Port 8000)"]
        FASTAPI["FastAPI Neural Server<br/>Uvicorn + PyTorch / OpenCV"]
        FLOOD_CV["Water Surface Detection & Segmentation"]
        DEPTH_EST["Estimated Water Depth & Vehicle Accessibility"]
    end

    subgraph DataStore["Persistence & Storage Layer"]
        PRISMA["Prisma ORM (v5.22)"]
        PG_DB["PostgreSQL / SQLite Storage Engine<br/>19 Normalized Enterprise Tables"]
        IMG_STORE["Encrypted Local & Cloud Storage Pipeline"]
    end

    %% Client communication
    PWA -->|"HTTPS / REST"| EXPRESS
    PWA <-->|"WSS (Socket.IO)"| WS_HUB
    ADMIN -->|"HTTPS / REST"| EXPRESS
    ADMIN <-->|"WSS (Socket.IO)"| WS_HUB
    EDGE_IOT -->|"Telemetry Ingestion"| EXPRESS

    %% Gateway to services
    EXPRESS --> AUTH_SVC
    EXPRESS --> ROUTING_SVC
    EXPRESS --> WEATHER_SVC
    EXPRESS --> PREDICT_SVC
    EXPRESS --> REPORT_SVC
    EXPRESS --> RIVER_SVC

    %% Service to external AI
    REPORT_SVC -->|"Multi-part Image Inspection"| FASTAPI
    FASTAPI --> FLOOD_CV
    FASTAPI --> DEPTH_EST

    %% Data persistence
    AUTH_SVC --> PRISMA
    ROUTING_SVC --> PRISMA
    WEATHER_SVC --> PRISMA
    PREDICT_SVC --> PRISMA
    REPORT_SVC --> PRISMA
    RIVER_SVC --> PRISMA
    PRISMA --> PG_DB
    REPORT_SVC --> IMG_STORE
```

---

## 3. Network Architecture & Port Topology

| Service / Workload | Port | Protocol | Technology Stack | High Availability Role |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen PWA Portal** | `8080` | HTTP/HTTPS | React 18, Vite, MapLibre GL, TailwindCSS | Installable Service Worker with offline report buffer |
| **Admin Command Center** | `5174` | HTTP/HTTPS | React 18, Vite, Recharts, Framer Motion | High-density GIS command deck for district magistrates |
| **Central Node.js Gateway** | `5000` | HTTP/REST, WSS | Express, TypeScript, Socket.IO, Prisma | Service/Repository pattern, JWT auth, Swagger docs |
| **AI Computer Vision Service**| `8000` | HTTP/REST | Python 3.11, FastAPI, Uvicorn, Torch, OpenCV | Convolutional flood segmentation and vehicle clearance |
| **Database Engine** | `5432` / Local | TCP / IPC | PostgreSQL 16+ or SQLite with Prisma ORM | 19 relational entities with audit trail and GIS coords |

---

## 4. Key Design Patterns & Engineering Principles

### 4.1. Service / Repository Separation
All backend domain modules (`server/src/*`) strictly decouple database access from business logic:
- **Routes / Controllers (`*.controller.ts`, `*.routes.ts`)**: HTTP transport handling, request validation, response serialization.
- **Services (`*.service.ts`)**: Pure business logic, hydrological weight computations, external API coordination, WebSocket broadcasts.
- **Repositories (`*.repository.ts`)**: Direct Prisma ORM invocations, query filtering, pagination, and transactional atomicity.

### 4.2. Explainable AI (XAI) Hydrometeorological Model
Unlike black-box neural networks, FloodRoute AI's predictive flood risk engine (`@floodroute/shared/src/predictionEngine.ts`) implements an **explainable, deterministic hydrological formula**:
1. **Precipitation Intensity & Forecast (35% weight)**: Current rain gauge rate ($mm/h$) and 24-hour predictive accumulation.
2. **Hydrological & River Proximity (20% weight)**: Distance to major perennial/seasonal waterbodies (CWC stations, Adyar, Yamuna, Brahmaputra).
3. **Topography & Elevation (20% weight)**: Mean Sea Level (MSL) elevation and urban drainage capacity index.
4. **Community Sentinel Reports (15% weight)**: Spatial density of citizen-verified waterlogging points within 1.5 km.
5. **Official Statutory Alerts (10% weight)**: Active NDMA / IMD warnings acting as dynamic risk multipliers.

Every prediction produces a factor contribution percentage breakdown and is strictly labeled with:
`[AI FLOOD PREDICTION] — Advisory guidance only; not a substitute for statutory government declarations.`

### 4.3. Resilient Offline PWA & Sync Architecture
During severe monsoon storms, mobile cell towers frequently lose power. FloodRoute AI guarantees continuity through:
- **Service Worker (`public/sw.js`)**: Network-first caching for tile layers, styles, and UI bundles.
- **Local Storage Queue (`floodroute_offline_queue`)**: When `navigator.onLine === false`, incident submissions are encrypted and serialized locally.
- **Background Synchronization**: Listens for the browser `online` event or WebSocket reconnection, flushing queued reports with original GPS timestamps.

---

## 5. Security & RBAC Governance
- **Role-Based Access Control**:
  - `CITIZEN`: Submit reports, plan routes, query weather and shelters.
  - `COMMUNITY_SENTINEL`: Elevated credibility weight for submitted reports.
  - `DISASTER_MODERATOR`: Approve, modify severity, or invalidate community reports.
  - `STATE_ADMIN`: Issue statutory NDMA warning polygons and road blockages.
  - `SUPER_ADMIN`: Audit logs, user permissions, and API key management.
- **Cryptographic Security**: Passwords hashed using `Argon2id` or `bcrypt` with salt rounds. Tokens issued via standard `RS256/HS256 JWT` with nonces (`crypto.randomUUID()`) to prevent millisecond collision.
