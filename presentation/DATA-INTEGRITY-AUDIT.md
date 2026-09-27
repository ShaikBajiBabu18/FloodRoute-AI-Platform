# FloodRoute AI Platform — Data Integrity Audit Register

**Audit Standard:** Rigorous transparency distinguishing live external API streams, static baselines, and demonstration data.

---

### 1. Open-Meteo Weather API
- **SOURCE:** Open-Meteo REST API (`api.open-meteo.com`) synced with IMD numerical observation grids.
- **PURPOSE:** Ingest instantaneous rain rate ($mm/h$), 24h accumulation, hourly temperature, precipitation probability, and wind speed.
- **ACTUAL OR DEMO:** **ACTUAL (LIVE DATA & FORECAST DATA)**
- **FRESHNESS:** Live HTTP query with 10-minute in-memory caching.
- **FAILURE BEHAVIOR:** Automated fallback to pre-compiled seasonal monsoon profiles marked with `[MODEL ESTIMATE]`.
- **LIMITATIONS:** 0.1° (~11 km) spatial grid resolution; localized micro-convective storms may show slight temporal delay.

---

### 2. OpenStreetMap & Nominatim Geocoding API
- **SOURCE:** OpenStreetMap Foundation & Nominatim API (`nominatim.openstreetmap.org`).
- **PURPOSE:** Convert text city/district queries into coordinate bounding boxes and render base cartographic map tiles.
- **ACTUAL OR DEMO:** **ACTUAL (LIVE DATA)**
- **FRESHNESS:** Real-time forward geocoding query per user search.
- **FAILURE BEHAVIOR:** Surfaces pre-seeded municipal quick chips for major Indian metropolitan hubs.
- **LIMITATIONS:** Public Nominatim endpoint enforces a 1 request/second rate limit.

---

### 3. Open Source Routing Machine (OSRM)
- **SOURCE:** OSRM Routing Engine (`router.project-osrm.org`).
- **PURPOSE:** Provide driving trajectory polylines, distances, and duration.
- **ACTUAL OR DEMO:** **ACTUAL (LIVE DATA)**
- **FRESHNESS:** Real-time road network graph query.
- **FAILURE BEHAVIOR:** 7-second timeout triggers geodesic elevation contour bypass generation.
- **LIMITATIONS:** Public demo server does not account for real-time temporary barricades unless logged by citizen reports.

---

### 4. NASA SRTM 30m Digital Elevation Model
- **SOURCE:** NASA Shuttle Radar Topography Mission (SRTM) 1 arc-second dataset.
- **PURPOSE:** Evaluate ground elevation above Mean Sea Level ($m$ MSL) and identify natural runoff depressions.
- **ACTUAL OR DEMO:** **ACTUAL (STATIC DATA / INTEGRATED MODEL)**
- **FRESHNESS:** Static global elevation grid.
- **FAILURE BEHAVIOR:** Embedded fallback baseline elevations per district.
- **LIMITATIONS:** 30m spatial resolution does not resolve sub-meter curb elevations or flyover ramps.

---

### 5. Citizen Hazard Reports
- **SOURCE:** Public citizen incident reporting form on `/report-hazard`.
- **PURPOSE:** Provide crowdsourced ground corroboration of waterlogging, stalled vehicles, and road closures.
- **ACTUAL OR DEMO:** **ACTUAL (LIVE DATA)**
- **FRESHNESS:** Persisted immediately to SQLite database.
- **FAILURE BEHAVIOR:** If database connection is interrupted, returns empty array without breaking map display.
- **LIMITATIONS:** Requires automated or human moderator approval in the Admin Console to prevent false reporting.

---

### 6. Disaster Warning Bulletins
- **SOURCE:** Seeded scenario disaster advisories in `prisma/seed.ts`.
- **PURPOSE:** Provide predictable scenario data for testing and hackathon judging demonstrations.
- **ACTUAL OR DEMO:** **DEMO DATA**
- **FRESHNESS:** Pre-seeded scenario timestamps.
- **FAILURE BEHAVIOR:** Static in SQLite database.
- **LIMITATIONS:** Explicitly tagged with `[DEMO DATA]` badges to ensure judges never mistake them for live statutory government declarations.
