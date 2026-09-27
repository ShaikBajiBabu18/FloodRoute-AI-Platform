# FloodRoute AI Platform — Tech Stack Summary

**Verified Implementation Details:** All technologies listed below are directly implemented and verified in the codebase.

---

### Frontend
- **Framework:** React 18.3
- **Build Tool:** Vite 5.4
- **Language:** TypeScript 5.4
- **Styling:** Tailwind CSS 3.4
- **Animation:** Framer Motion 11.x
- **Icons:** Lucide React
- **Data Visualization:** Recharts

### Backend
- **Runtime:** Node.js v20.x
- **Framework:** Express.js 4.19 in TypeScript
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Validation:** Joi schema validation

### Database
- **ORM:** Prisma ORM 5.14
- **Engines:** SQLite (local development with WAL mode) / PostgreSQL 16 compatible schema
- **Data Models:** 19 relational entities (Users, FloodReports, DisasterAlerts, EmergencyResources, RoadConditions)

### Maps
- **GIS Canvas:** Leaflet 1.9
- **Cartography:** OpenStreetMap Raster & Vector Tile Grids

### Weather
- **Telemetry Provider:** Open-Meteo Weather API (synced with IMD numerical weather prediction grid)
- **Parameters:** Instantaneous rain rate ($mm/h$), 24h accumulation, hourly temperature, precipitation probability, wind speed

### Geocoding
- **Provider:** OpenStreetMap Nominatim forward & reverse geocoding API

### Routing
- **Routing Engine:** Open Source Routing Machine (OSRM) driving profile
- **Geometric Analysis:** LineString waypoint discretization and spatial risk buffer intersection

### AI & Machine Learning
- **Computer Vision Service:** Python 3.10+, FastAPI, Uvicorn, OpenCV, NumPy (analyzes road photos for water coverage percentage, turbidity, and vehicle passability)
- **Conversational Copilot:** Express.js context-aware natural-language assistant with deterministic offline rule fallbacks

### Authentication
- **Token Security:** Stateless JSON Web Tokens (JWT) signed via HMAC-SHA256
- **Password Hashing:** Salted `bcryptjs` with salt rounds

### Deployment
- **Local Dev Server:** Multi-workspace orchestration via `concurrently` (Ports 5000, 8080, 5174, 8000)
- **Production Bundle:** Node.js compiled TypeScript (`tsc`) + Vite production minified assets (`dist/`)
