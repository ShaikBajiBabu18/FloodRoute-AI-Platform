# FloodRoute AI — Technical Architecture Specification

## 1. System Topology & Architectural Overview

FloodRoute AI is structured as a decoupled, microservice-ready monorepo combining high-concurrency event ingestion, geometric corridor calculations, computer vision segmentation, and dual frontends.

```
+-------------------------------------------------------------------------+
|                              CITIZEN WEB APP                            |
|             (React 18 + Vite + MapLibre GL + Tailwind + Recharts)       |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP / REST & WebSockets
                                     v
+-------------------------------------------------------------------------+
|                       CENTRAL API GATEWAY (Port 5000)                   |
|                   Express + TypeScript + Socket.IO + Zod                |
+---------+-------------------+--------------------+----------------------+
          |                   |                    |
          | Prisma ORM        | REST (Multipart)   | GeoJSON / OSRM
          v                   v                    v
+------------------+  +------------------+  +-------------------------------+
|   STORAGE LAYER  |  |    AI SERVICE    |  |  EXTERNAL ROUTING & WEATHER   |
|   PostgreSQL /   |  |   FastAPI + CV2  |  |   OSRM Grid + Open-Meteo +    |
|   SQLite DB      |  |   (Port 8000)    |  |   Nominatim Geocoder          |
+------------------+  +------------------+  +-------------------------------+
          ^                                                ^
          | HTTP / REST & WebSockets                       |
+---------+------------------------------------------------+--------------+
|                         INCIDENT COMMAND DASHBOARD                      |
|                  (React 18 + Vite + Operations Map + RBAC)              |
+-------------------------------------------------------------------------+
```

---

## 2. Core Subsystems

### A. Explainable Risk Scoring Engine (`packages/shared/src/riskEngine.ts`)
The calculation engine aggregates 6 distinct environmental vectors into a 0–100 score:
$$\text{Score} = w_{\text{rain}} \cdot S_{\text{rain}} + w_{\text{forecast}} \cdot S_{\text{forecast}} + w_{\text{alert}} \cdot S_{\text{alert}} + w_{\text{verified}} \cdot S_{\text{verified}} + w_{\text{closure}} \cdot S_{\text{closure}} + w_{\text{pending}} \cdot S_{\text{pending}}$$

Where:
- $w_{\text{rain}} = 0.25$: Current rainfall rate (mm/hr)
- $w_{\text{forecast}} = 0.15$: 24-hour predictive accumulation (mm)
- $w_{\text{alert}} = 0.30$: Statutory warnings (NDMA / IMD / CWC)
- $w_{\text{verified}} = 0.20$: Ground reports within 3.5 km corridor
- $w_{\text{closure}} = 0.25$: Municipal road closures and impassable barricades
- $w_{\text{pending}} = 0.05$: Citizen reports awaiting verification

### B. Computer Vision Microservice (`apps/ai-service`)
- **FastAPI Core**: Asynchronous Python server handling uploaded image buffers.
- **OpenCV Pipeline**:
  1. HSV color space transformation: Segregates muddy brown water (`H: 10-35, S: 40-255`) and dark reflective standing water.
  2. Ground ROI Masking: Concentrates on the bottom 65% of the frame (road surface).
  3. Laplacian Texture Filter: Water surfaces have low Laplacian variance compared to asphalt.
  4. Axle Clearance Heuristic: Translates water coverage percentage into PASSABLE, DIFFICULT, or IMPASSABLE determinations.

### C. Real-Time Incident Broadcast Mesh (`server/src/services/socketService.ts`)
Socket.IO enables real-time synchronization between citizen submissions and incident command moderators. When an analyst verifies an incident:
1. Database status transitions to `VERIFIED`.
2. Socket event `report.approved` is broadcast to all active map instances.
3. Connected route planning engines recalculate any affected corridors.
4. Push notifications are delivered to saved location subscribers.
