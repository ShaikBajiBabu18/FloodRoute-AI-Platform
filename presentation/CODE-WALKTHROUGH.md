# FloodRoute AI Platform — Codebase Walkthrough Guide

**Prompt:** *"Show me the code."*  
**Standard:** Exact repository paths, concrete engineering purpose, and technical significance.

---

### 1. Main User Interface
- **FILE/PATH:** `apps/web/src/App.tsx` & `apps/web/src/pages/LandingPage.tsx`
- **PURPOSE:** Defines client-side routing, high-contrast UI theme, active telemetry cards, and the command center dashboard.
- **WHY IT MATTERS:** Renders the central entry point in React 18, setting up global error boundaries and state contexts (`DemoContext`, `ToastContext`, `AccessibilityContext`).

---

### 2. Interactive Map System
- **FILE/PATH:** `apps/web/src/components/map/InteractiveMap.tsx` & `apps/web/src/pages/LiveMapPage.tsx`
- **PURPOSE:** Manages Leaflet 1.9 cartographic deck, dynamic vector/raster tile rendering, layer switching (Street, Satellite, Topography), and hazard pin clustering.
- **WHY IT MATTERS:** Visualizes multi-source spatial data across India with hardware-accelerated 60 FPS performance and smooth camera flying.

---

### 3. Explainable Flood-Risk Engine
- **FILE/PATH:** `server/src/services/riskEngine.ts` & `server/src/flood/flood.service.ts`
- **PURPOSE:** Implements the 5-factor mathematical model:
  $$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
- **WHY IT MATTERS:** Solves the black-box opacity problem of machine learning by decomposing the 0–100 score into auditable point contributions and clear data sources.

---

### 4. Routing & Hazard Intersections
- **FILE/PATH:** `server/src/routing/routing.service.ts` & `apps/web/src/pages/RoutePlannerPage.tsx`
- **PURPOSE:** Queries OSRM road graphs, discretizes candidate trajectories, calculates flood risk penalties for each waypoint, and suggests elevated bypasses.
- **WHY IT MATTERS:** The core transit differentiator that evaluates routes for **lower modeled flood-risk exposure** circumventing submerged underpasses.

---

### 5. Weather Telemetry Adapter
- **FILE/PATH:** `server/src/weather/weather.service.ts`
- **PURPOSE:** Fetches real-time precipitation ($mm/h$), 24h accumulation, hourly temperature, and wind speed from Open-Meteo synced with IMD observation grids.
- **WHY IT MATTERS:** Implements an in-memory 10-minute caching layer and automated fallback to seasonal monsoon baselines if external connectivity degrades.

---

### 6. Computer Vision AI Engine
- **FILE/PATH:** `apps/ai-service/app/main.py` & `apps/ai-service/app/models/`
- **PURPOSE:** Python FastAPI microservice evaluating citizen photos for surface water coverage percentage, turbidity, and vehicle passability.
- **WHY IT MATTERS:** Offloads compute-heavy image analysis to a dedicated Python runtime, keeping the main Node.js API gateway non-blocking and responsive.

---

### 7. Emergency Services & Shelter Directory
- **FILE/PATH:** `server/src/controllers/resourceController.ts` & `apps/web/src/pages/EmergencyResourcesPage.tsx`
- **PURPOSE:** Manages relief centers, fire stations, and apex hospitals indexed with elevation above sea level, capacity, and direct 112 dialing.
- **WHY IT MATTERS:** Provides high-contrast, one-tap access to life-safety resources during sudden flash flooding.

---

### 8. Database Persistence Layer
- **FILE/PATH:** `prisma/schema.prisma` & `prisma/seed.ts`
- **PURPOSE:** 19 normalized relational entities (Users, FloodReports, DisasterAlerts, EmergencyResources, RoadConditions) managed via Prisma ORM.
- **WHY IT MATTERS:** Operates on SQLite with WAL mode in local development for concurrent read performance, with immediate schema compatibility for PostgreSQL in production.

---

### 9. Authentication & Security
- **FILE/PATH:** `server/src/middleware/auth.ts` & `server/src/auth/auth.controller.ts`
- **PURPOSE:** Implements stateless JSON Web Tokens (JWT) signed via HMAC-SHA256 and salted `bcryptjs` password hashing with Role-Based Access Control (`CITIZEN`, `ADMIN`).
- **WHY IT MATTERS:** Protects incident moderation and alert broadcasting endpoints from unauthorized tampering.

---

### 10. Admin Command Console
- **FILE/PATH:** `apps/admin/src/pages/AdminDashboard.tsx` & `apps/admin/src/pages/IncidentsPage.tsx`
- **PURPOSE:** Dedicated executive console (Port 5174) for emergency authorities to triage citizen hazard submissions, approve alerts, and inspect district vulnerability charts.
- **WHY IT MATTERS:** Bridges the gap between citizen reporting and statutory disaster management coordination.

---

### 11. Central API Gateway Routing
- **FILE/PATH:** `server/src/app.ts`
- **PURPOSE:** Central Express application mounting security middleware (Helmet, CORS, Rate Limiter) and modular feature routes.
- **WHY IT MATTERS:** Enforces consistent error handling, rate limiting, and input sanitization across all microservices.
