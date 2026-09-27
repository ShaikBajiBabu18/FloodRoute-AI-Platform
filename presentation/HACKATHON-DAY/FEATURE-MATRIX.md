# FloodRoute AI Platform — Product Feature Matrix

**Verification Basis:** Evaluated directly against the actual codebase and running microservices.

---

| Feature | Implemented | Data / API | Demo Available | Notes |
|---|:---:|---|:---:|---|
| **Interactive Map** | **YES** | Leaflet 1.9 + OpenStreetMap Raster/Vector Tiles | **YES** | Pan, zoom, layer switching (Street, Satellite, Topography), hazard pins. |
| **Location Search** | **YES** | OpenStreetMap Nominatim Geocoding API | **YES** | Forward geocoding across Indian cities and districts with automated camera `flyTo`. |
| **Weather Integration** | **YES** | Open-Meteo API synced with IMD observation grid | **YES** | Real-time precipitation rate ($mm/h$), 24h accumulation, hourly temperature, and wind. |
| **Flood Risk Engine** | **YES** | 5-factor deterministic mathematical formulation | **YES** | Computes 0–100 risk score based on rainfall, elevation depression, soil saturation, advisories, reports. |
| **Risk Explanation** | **YES** | Internal factor-attribution decomposition | **YES** | Transparent factor-by-factor breakdown table with impact values and data sources. |
| **Route Analysis** | **YES** | Open Source Routing Machine (OSRM) highway network | **YES** | Compares direct path against elevated bypass with lower modeled flood-risk exposure. |
| **Emergency Services** | **YES** | SQLite local database + Overpass API integration | **YES** | Curated directory of hospitals, fire stations, and shelters with direct 112 calling. |
| **AI Assistant (Copilot)** | **YES** | Contextual conversational engine + offline fallback | **YES** | Ingests live telemetry into plain-language advice; works online and offline. |
| **Admin Dashboard** | **YES** | React 18 administrative portal (Port 5174) | **YES** | Real-time citizen hazard report triage queue, alert broadcaster, and system health status. |
| **Analytics** | **YES** | Recharts telemetry visualization library | **YES** | District vulnerability distribution, rainfall-vs-waterlogging correlation charts. |
| **Demo Mode** | **YES** | Built-in scenario state engine (`demoConfig.ts`) | **YES** | Instant one-click toggle for reproducible, offline-ready presentation scenarios. |
