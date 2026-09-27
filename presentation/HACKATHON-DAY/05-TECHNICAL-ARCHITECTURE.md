# FloodRoute AI Platform — Technical Architecture

## 30-Second Technical Overview
The platform operates as a resilient multi-tier microservices architecture:
- **Frontend Layer:** React 18, Vite, and Tailwind CSS serving the Citizen Portal (Port 8080) and Admin Incident Console (Port 5174).
- **API Gateway:** Node.js/Express in TypeScript (Port 5000) providing Helmet security, rate limiting, and Joi input validation.
- **Flood-Risk Core:** 5-factor mathematical engine correlating real-time weather, SRTM 30m digital elevation, and hazard reports.
- **Routing Engine:** OSRM integration evaluating candidate road polylines against hazard risk buffers.
- **AI Microservice:** Python FastAPI (Port 8000) analyzing citizen disaster photos via OpenCV.
- **Persistence:** SQLite with Prisma ORM in development (with PostgreSQL compatibility for production).

---

## Clean System Architecture Diagram

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
