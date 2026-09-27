# FloodRoute AI — Judge Cheat Sheet

> **One-Page Technical & Architectural Summary for Hackathon Evaluators**

---

### PROJECT
**FloodRoute AI**  
*Repository*: [https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform](https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform)  
*Team Lead*: Shaik Baji Babu

---

### CORE IDEA
**AI + Weather + Flood Risk + GIS + Route Decision Support**  
Translating real-time atmospheric and geospatial signals into explainable flood risk metrics and transit decision support, helping citizens identify routes with lower modeled flood-risk exposure and navigate to verified high-ground relief centers.

---

### MAIN FEATURES
* **Map**: India-wide interactive GIS map via MapLibre GL with sub-meter search, GPS centering, and 4-tier risk heatmap overlay.
* **Weather**: Real-time precipitation rate ($mm/h$), 24h accumulation, humidity, and wind speed.
* **Flood Risk**: Deterministic explainable score (0–100) with granular factor attribution (Rainfall, Elevation, Drainage, River Proximity, Crowdsourcing).
* **Alerts**: Contextual disaster warning banners modeled after NDMA/SDMA emergency bulletins.
* **Emergency Services**: High-ground relief shelters indexed by elevation above MSL, capacity, and direct 112 calling.
* **Routing**: Dual corridor evaluation comparing direct routes against elevated bypasses for lower modeled flood-risk exposure.
* **AI (Copilot)**: Context-aware conversational assistant explaining localized risk factors and pre-travel precautions.
* **Admin**: Incident Command Center dashboard with citizen report triage, alert broadcasts, and system monitoring.
* **Analytics**: District vulnerability distribution and rainfall-versus-depth correlation charts.

---

### TECH STACK (Actually Implemented & Running)
* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
* **Mapping & GIS**: MapLibre GL JS, OpenStreetMap raster/vector tiles
* **Backend Gateway**: Node.js, Express.js, TypeScript (Port 5000)
* **Real-time Events**: Socket.IO WebSockets
* **Database & ORM**: Prisma ORM with SQLite (local development) / PostgreSQL 16 (production target)
* **AI & Computer Vision**: Python 3.10, FastAPI, OpenCV, PyTorch (Port 8000)
* **Routing Engine**: Open Source Routing Machine (OSRM) integration
* **Security & Auth**: Argon2id password hashing, Stateless JWT, Helmet.js

---

### DATA (Actual Sources Used)
* **Weather & Precipitation**: Open-Meteo Weather API (ECMWF / GFS numerical models)
* **Digital Elevation**: Open-Meteo Elevation API / SRTM 30m Digital Elevation Model
* **Geocoding & Addresses**: OpenStreetMap Nominatim forward & reverse geocoder
* **Road Network Topology**: OpenStreetMap street graph via OSRM
* **Disaster Conventions**: National Disaster Management Authority (NDMA) & IMD alert classification standards

---

### LIMITATION
* **Model-Estimated Decision Support**: FloodRoute AI provides decision support based on available remote sensing and topological data. It is **not** an official emergency-warning system and does not issue statutory declarations.
* **Elevation Resolution**: 30-meter DEM averages terrain contours and cannot resolve sub-meter micro-barriers like flyover ramps without municipal LiDAR surveys.

---

### FUTURE
1. **Authoritative Warning Feeds**: Direct automated webhook integration with NDMA Common Alerting Protocol (CAP-CP).
2. **Sensors**: Low-power LoRaWAN ultrasonic water-level stage sensors installed at urban underpasses.
3. **Satellite / Radar Data**: Direct ingestion of Indian Doppler Weather Radar (DWR) precipitation reflectivity scans.
4. **Road Closures**: Real-time crowd-verified barrier reporting synchronized with municipal traffic police.
5. **Multilingual Support**: Expanded UI and SMS/USSD routing in Hindi, Tamil, Telugu, and Bengali.
6. **Mobile Notifications**: Push notification broadcasts for geo-fenced flash flood risk corridors.
