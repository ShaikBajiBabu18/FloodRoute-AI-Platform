# FloodRoute AI Platform — Final Submission Package

---

### PROJECT NAME
**FloodRoute AI Platform**

---

### TAGLINE
**Smarter Flood Intelligence. Safer Routes.**

---

### SHORT DESCRIPTION (278 Characters)
FloodRoute AI is an AI-powered flood intelligence and route decision-support platform for India. It combines live weather telemetry, 30m digital elevation models, and verified road hazards to compute explainable risk scores and guide commuters along lower flood-risk bypasses.

---

### LONG DESCRIPTION (224 Words)
During severe monsoon downpours and sudden cloudbursts across Indian urban centers, arterial streets turn into impassable torrents within minutes. Conventional navigation platforms optimize almost exclusively for traffic speed and vehicle velocity; they cannot determine whether an empty road is submerged under three to four feet of floodwater in low-lying underpasses.

**FloodRoute AI** bridges the life-critical gap between atmospheric weather data, digital elevation topography, and vehicle navigation. Built with React 18, Leaflet GIS, Node.js/Express, and Python FastAPI, the platform delivers an end-to-end disaster decision-support system.

On an interactive GIS map covering all 36 Indian states and union territories, citizens can search any location to view real-time precipitation from Open-Meteo and an explainable 0 to 100 flood-risk score. The transparent model correlates rainfall rate, 30m SRTM ground elevation, soil saturation, and verified citizen hazard reports into an auditable breakdown.

When planning a trip, FloodRoute AI evaluates candidate road polylines from Open Source Routing Machine (OSRM) and highlights elevated bypasses with **lower modeled flood-risk exposure**, helping drivers avoid submerged choke points. The platform integrates one-tap 112 emergency dialing, high-ground shelter discovery, an offline conversational AI Copilot, and an Incident Command Console with computer-vision flood depth analysis for emergency authorities.

---

### TECH STACK
- **Frontend:** React 18, Vite 5, TypeScript 5.4, Tailwind CSS, Leaflet GIS, Framer Motion, Lucide React, Recharts.
- **Backend:** Node.js v20+, Express.js 4.19 in TypeScript, Helmet, Rate Limiter, Joi validation.
- **Database:** SQLite with Prisma ORM 5.14 (WAL mode enabled; PostgreSQL schema compatible).
- **AI Microservice:** Python 3.10+, FastAPI, Uvicorn, OpenCV, NumPy.

---

### AI IMPLEMENTATION
1. **Computer Vision Flood Classifier:** Python FastAPI service analyzing citizen photos for surface water coverage percentage, turbidity, and vehicle clearance passability.
2. **Context-Aware Copilot:** Natural-language assistant ingesting active coordinates, precipitation rates, and basin elevation to generate actionable transit guidance.

---

### DATA SOURCES
- **Live Meteorology:** Open-Meteo API synced with IMD observation grids (**Live Data**).
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API (**Live Data**).
- **Road Network Graph:** Open Source Routing Machine (OSRM) (**Live Data**).
- **Digital Elevation Models:** NASA SRTM 30m dataset (**Integrated Model**).
- **Disaster Bulletins:** Pre-seeded scenario bulletins explicitly tagged `[DEMO DATA]`.

---

### KEY FEATURES
1. Interactive nationwide Leaflet GIS cartography across all 36 Indian states and union territories.
2. Real-time forward geocoding via OpenStreetMap Nominatim with automated camera flying.
3. Live meteorological telemetry (precipitation $mm/h$, 24h accumulation, hourly forecast, wind).
4. Explainable 0–100 deterministic flood risk engine with factor attribution breakdown table.
5. Route analysis comparing direct paths against elevated bypasses with lower modeled flood-risk exposure.
6. Emergency directory with high-ground shelters, apex hospitals, and one-tap 112 dialing.
7. Citizen hazard crowdsourcing pipeline with water depth categorization and photo upload.
8. Incident Command Admin Console with computer-vision photo triage and alert broadcasting.
9. Context-aware conversational AI Copilot with automatic offline fallbacks.
10. Deterministic Demo Mode for reproducible, offline evaluations across major Indian metros.

---

### LIMITATIONS
- 30m SRTM DEM resolution does not capture micro-barriers like flyover ramps or localized curb drainage blockages.
- Earth observation satellite radar carries a 6–12 hour revisit latency.
- Public OSRM routing servers enforce rate limits during peak traffic.
- Citizen incident reports require moderation before influencing route penalty weights.
