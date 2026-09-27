# FloodRoute AI Platform — Codebase Repository Map

**Guide for Judges:** Exact file and directory paths mapping each conceptual component to its actual source code implementation.

---

### 1. Frontend (Citizen Web Portal)
- **Root Path:** `apps/web/`
- **Application Entry:** `apps/web/src/main.tsx` & `apps/web/src/App.tsx`
- **Pages:** `apps/web/src/pages/`
  - `LandingPage.tsx` (Dashboard & mission)
  - `LiveMapPage.tsx` (Interactive GIS deck)
  - `RoutePlannerPage.tsx` (Route comparison & lower modeled risk)
  - `EmergencyResourcesPage.tsx` (Shelters & 112 hotline)
  - `WeatherPage.tsx` (Precipitation telemetry & forecast)
  - `ReportHazardPage.tsx` (Citizen hazard crowdsourcing)

### 2. Backend Gateway
- **Root Path:** `server/`
- **Server Entry:** `server/src/index.ts` & `server/src/app.ts`
- **Middleware:** `server/src/middleware/` (`auth.ts`, `errorHandler.ts`, `rateLimiter.ts`)

### 3. API Routes & Controllers
- **Modular Routes:** `server/src/`
  - Auth: `server/src/auth/auth.routes.ts`
  - Weather: `server/src/weather/weather.routes.ts`
  - Flood: `server/src/flood/flood.routes.ts`
  - Routing: `server/src/routing/routing.routes.ts`
  - Reports: `server/src/reports/reports.routes.ts`
  - Alerts: `server/src/alerts/alerts.routes.ts`
  - Copilot: `server/src/copilot/copilot.routes.ts`
  - Emergency Resources: `server/src/routes/resourceRoutes.ts`

### 4. Database & ORM
- **Schema:** `prisma/schema.prisma` (19 relational entities)
- **Seed Data:** `prisma/seed.ts` (Realistic scenario data)
- **Local Database File:** `server/dev.db` (SQLite in WAL mode)

### 5. Flood-Risk Engine
- **Core Implementation:** `server/src/services/riskEngine.ts` & `server/src/flood/flood.service.ts`
- **Unit Test:** `server/tests/riskEngine.test.ts`

### 6. AI Microservice & Computer Vision
- **Root Path:** `apps/ai-service/`
- **Service Entry:** `apps/ai-service/app/main.py`
- **OpenCV Models:** `apps/ai-service/app/models/`

### 7. Interactive Map System
- **Map Component:** `apps/web/src/components/map/InteractiveMap.tsx`
- **GIS Layers:** OpenStreetMap, Topography, Satellite tiles via Leaflet 1.9

### 8. Authentication & RBAC
- **Middleware:** `server/src/middleware/auth.ts`
- **Controller:** `server/src/auth/auth.controller.ts`
- **Integration Test:** `server/tests/auth.test.ts`

### 9. Admin Incident Command Console
- **Root Path:** `apps/admin/`
- **Entry Point:** `apps/admin/src/main.tsx` & `apps/admin/src/App.tsx`
- **Dashboard:** `apps/admin/src/pages/AdminDashboard.tsx`
- **Moderation:** `apps/admin/src/pages/IncidentsPage.tsx`

### 10. Automated Tests
- **Directory:** `server/tests/`
  - `routing.test.ts` (Routing & hazard buffer intersection)
  - `api.test.ts` (Gateway health & geocoding integration)
  - `auth.test.ts` (User registration & JWT login)
  - `reports.test.ts` (Citizen reporting & upvoting)
  - `riskEngine.test.ts` (Mathematical flood risk formula tests)

### 11. Documentation & Presentation Decks
- **Submission Dossier:** `presentation/HACKATHON-DAY/`
- **Engineering Docs:** `docs/`
