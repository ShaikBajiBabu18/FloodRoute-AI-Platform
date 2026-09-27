# FloodRoute AI Platform — Technical Deep Dive

**Document Purpose:** Architectural and component-by-component engineering specification detailing purpose, actual implementation, external dependencies, and failure behavior.

---

### 1. Frontend Architecture
- **Purpose:** Serve high-performance, accessible, responsive citizen and administrative interfaces.
- **Actual Implementation:** React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion animations, Lucide React icons.
- **External Dependency:** None (bundled locally).
- **Failure Behavior:** Protected by React Error Boundaries (`ErrorBoundary.tsx`); component failures render contextual fallback cards rather than blank screens.

### 2. Backend & API Architecture
- **Purpose:** Central API gateway orchestrating telemetry ingestion, authentication, risk computation, and routing.
- **Actual Implementation:** Node.js, Express.js in TypeScript with modular domain routes (`auth`, `weather`, `flood`, `routes`, `reports`, `alerts`, `copilot`, `resources`).
- **External Dependency:** Node.js runtime.
- **Failure Behavior:** Centralized error handler middleware (`errorHandler.ts`) catches exceptions, logs stack traces locally, and returns sanitized JSON error objects without exposing system internals.

### 3. Database
- **Purpose:** Persist user accounts, citizen hazard reports, active disaster bulletins, emergency resources, and audit logs.
- **Actual Implementation:** SQLite in local development with Prisma ORM 5.x; WAL mode enabled for concurrent reads; schema fully compatible with PostgreSQL for production.
- **External Dependency:** Local disk storage.
- **Failure Behavior:** If the database file is temporarily locked, Prisma retries connection; read operations gracefully degrade to in-memory cached demonstration scenarios.

### 4. Map System
- **Purpose:** Provide hardware-accelerated GIS cartography across the Indian subcontinent.
- **Actual Implementation:** Leaflet 1.9 rendering OpenStreetMap raster and vector tile layers with dynamic SVG marker layers and polyline decorators.
- **External Dependency:** Public OpenStreetMap tile servers (`tile.openstreetmap.org`).
- **Failure Behavior:** If external raster tile servers are slow or unreachable, pre-cached base tiles render immediately without breaking marker overlays or navigation controls.

### 5. Weather Integration
- **Purpose:** Retrieve high-resolution meteorological telemetry for any given coordinate in India.
- **Actual Implementation:** Express service querying Open-Meteo API (synced with IMD numerical observation grids) with a 10-minute in-memory cache.
- **External Dependency:** Open-Meteo REST API (`api.open-meteo.com`).
- **Failure Behavior:** If the API times out or rate limits, the service falls back to pre-compiled seasonal monsoon profiles with an explicit `[MODEL ESTIMATE]` badge.

### 6. Geocoding
- **Purpose:** Convert natural-language search queries into latitude and longitude coordinates.
- **Actual Implementation:** OpenStreetMap Nominatim forward geocoding with bounding-box extraction.
- **External Dependency:** Nominatim API (`nominatim.openstreetmap.org`).
- **Failure Behavior:** If Nominatim is unreachable, the frontend automatically surfaces quick-suggestion chips for major Indian metropolitan basins.

### 7. Routing
- **Purpose:** Calculate candidate transit trajectories and cross-reference them against flood risk buffers.
- **Actual Implementation:** OSRM integration evaluating shortest vs. safest corridors; calculates risk penalty scores along route polylines.
- **External Dependency:** Public OSRM routing server (`router.project-osrm.org`).
- **Failure Behavior:** If OSRM times out ($>7$s), the service generates a geodesic topological elevation bypass using local vector mathematics.

### 8. Flood-Risk Engine
- **Purpose:** Compute explainable 0–100 risk score with granular factor attribution.
- **Actual Implementation:** 5-factor weighted mathematical equation executed in Express (`riskEngine.ts`).
- **External Dependency:** Ingests local weather, DEM elevation, and hazard report data.
- **Failure Behavior:** If individual input factors are missing, nominal baseline weights are applied; calculation never throws an uncaught exception.

### 9. Emergency-Service Data
- **Purpose:** Provide verified contact information and routing to high-ground relief centers, fire stations, and apex hospitals.
- **Actual Implementation:** Indexed relational records in Prisma ORM with category filtering and click-to-call dialing.
- **External Dependency:** None (stored locally in database).
- **Failure Behavior:** Always operational from local database cache.

### 10. AI Architecture
- **Purpose:** Provide computer-vision flood depth classification and conversational transit guidance.
- **Actual Implementation:**
  - Python FastAPI microservice (Port 8000) using OpenCV for image analysis.
  - Conversational Copilot in Express ingesting live location and weather telemetry.
- **External Dependency:** Python 3.10+ runtime and OpenCV libraries.
- **Failure Behavior:** If the Python microservice is offline, the client-side Copilot engine serves structured, deterministic hydrological advisories.

### 11. Authentication
- **Purpose:** Secure citizen accounts and protect administrative actions.
- **Actual Implementation:** Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256; password hashing via `bcryptjs` with salt rounds.
- **External Dependency:** None.
- **Failure Behavior:** Invalid or expired tokens return HTTP 401 Unauthorized; public citizen pages do not require authentication.

### 12. Admin Console
- **Purpose:** Equip emergency authorities with real-time incident triage and alert dispatch tools.
- **Actual Implementation:** Dedicated React 18 application at Port 5174 with moderation queue, status update controls, and alert broadcaster.
- **External Dependency:** Express Gateway API.
- **Failure Behavior:** Retries failed administrative network requests and displays toast alerts.

### 13. Analytics Deck
- **Purpose:** Present high-level vulnerability metrics and historical incident distributions.
- **Actual Implementation:** Recharts responsive SVG data visualizations.
- **External Dependency:** Express Gateway API.
- **Failure Behavior:** Renders empty state indicators with retry buttons if analytics queries fail.

### 14. Fallback & Demo Architecture
- **Purpose:** Ensure 100% demo reliability under adverse live hackathon conditions (e.g., zero internet).
- **Actual Implementation:** Built-in **Demo Mode** (`demoConfig.ts` & `OneClickJudgeDemo.tsx`) providing deterministic presentation scenarios.
- **External Dependency:** Zero external network dependencies.
- **Failure Behavior:** Works completely offline in airplane mode.
