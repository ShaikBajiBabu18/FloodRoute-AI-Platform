# FloodRoute AI Platform — One-Page Cheat Sheet

### PRODUCT
**FloodRoute AI Platform**

---

### ONE-LINE PITCH
FloodRoute AI is an AI-powered flood-risk decision-support platform that combines location intelligence, real-time meteorological telemetry, modeled flood risk, route analysis, emergency-service discovery, and conversational AI assistance.

---

### CORE FEATURES
- **India-Wide Interactive GIS Map:** Pan, zoom, and layer toggles (Street, Satellite, Topography) across all 36 Indian states and union territories.
- **Explainable Flood Risk Engine:** Transparent 0–100 score breaking down rainfall, ground elevation, soil saturation, official warnings, and crowd reports.
- **Route Analysis:** Highlights elevated bypasses with **"lower modeled flood-risk exposure"** circumventing submerged underpasses.
- **Emergency Hub:** One-tap 112 calling, nearest high-ground relief centers, and hospital discovery.
- **Conversational Copilot:** Real-time contextual assistant providing plain-language pre-travel safety advice.
- **Admin Command Console:** Operational incident triage with computer vision water depth estimates and alert broadcasting.

---

### TECH STACK
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Leaflet GIS, Framer Motion, Lucide React.
- **Gateway Server:** Node.js, Express.js in TypeScript, Helmet, Rate Limiter, Joi validation.
- **Database:** SQLite with Prisma ORM (WAL mode; PostgreSQL compatible).
- **AI Microservice:** Python 3.10+, FastAPI, OpenCV image heuristics.

---

### DATA SOURCES
- **Live Meteorology:** Open-Meteo API synced with IMD observation grid.
- **Cartography & Geocoding:** OpenStreetMap and Nominatim.
- **Routing Engine:** Open Source Routing Machine (OSRM).
- **Elevation Data:** NASA SRTM 30m Digital Elevation Model.
- **Sample Warnings:** Pre-seeded scenario bulletins explicitly tagged `[DEMO DATA]`.

---

### AI IMPLEMENTATION
- **Computer Vision:** Python FastAPI microservice analyzing citizen photos for surface water coverage percentage and vehicle passability.
- **Conversational Copilot:** Context-aware assistant ingesting live coordinates, weather telemetry, and route risk into natural-language advice.

---

### FLOOD MODEL
$$\text{Risk Score} = 0.35(R_{\text{rain}}) + 0.25(E_{\text{elev}}) + 0.20(D_{\text{drain}}) + 0.15(A_{\text{bulletins}}) + 0.05(C_{\text{crowd}})$$
- Heuristic multi-variable scoring model resulting in transparent point-by-point attribution.

---

### SHORT DEMO FLOW (60 SECONDS)
1. **Map (15s):** In `/live-map`, search *"Patna"* or click *"Chennai"*, show nationwide GIS coverage.
2. **Risk (15s):** Open Risk breakdown, show the 0–100 score and explainable factor attribution table.
3. **Route (15s):** In `/route-planner`, calculate *Velachery to Chennai Central*, highlight green **Elevated Bypass**.
4. **Emergency & Copilot (15s):** Show one-tap 112 dialing and ask Copilot *"Why is the risk elevated?"*.

---

### LIMITATIONS
- 30m SRTM DEM resolution does not resolve sub-meter curb blockages.
- Satellite feeds carry 6–12 hour latency.
- Public OSRM endpoints enforce rate limits.

---

### DISCLAIMER
FloodRoute AI provides **model-estimated decision-support guidance** and is not an official statutory emergency warning system. Commuters must always comply with on-ground instructions from police and disaster authorities.

---

### LAUNCH COMMAND
```bash
npm run dev
```
Open **`http://localhost:8080`** in your browser.
