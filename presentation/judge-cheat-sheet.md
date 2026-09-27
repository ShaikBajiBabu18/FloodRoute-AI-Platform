# FloodRoute AI Platform — One-Page Judge Cheat Sheet

### PRODUCT
**FloodRoute AI Platform** — AI-Powered Geospatial Flood Intelligence & Route Decision Support for India.

---

### CORE VALUE PROPOSITION
Traditional navigation platforms optimize solely for traffic speed, inadvertently directing motorists and emergency vehicles into submerged underpasses and flash-flooded basins. FloodRoute AI combines real-time precipitation, topographical elevation contours, and verified hazard data to calculate transparent risk scores and recommend routes with **lower modeled flood-risk exposure**.

---

### TECH STACK
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Leaflet GIS, Framer Motion, Lucide Icons.
- **Backend Gateway:** Node.js, Express, TypeScript, Joi validation, Helmet, CORS, Rate-Limiting.
- **Database:** SQLite with Prisma ORM (WAL mode enabled for concurrent reads).
- **Vision Engine:** Python 3.10+, FastAPI, Uvicorn, OpenCV image analysis.
- **Testing & Tooling:** Jest, Supertest, TypeScript strict mode compiler.

---

### DATA INTEGRATIONS
- **Meteorology:** Open-Meteo API synced with Indian Meteorological Department (IMD) observation grid (**Live Data**).
- **Cartography & Geocoding:** OpenStreetMap & Nominatim forward/reverse geocoding API (**Live Data**).
- **Road Network Graph:** Open Source Routing Machine (OSRM) highway network (**Live Data**).
- **Topography:** NASA SRTM 30m Digital Elevation Model (**Integrated Model**).
- **Emergency Bulletins:** Seeded NDMA / IMD emergency disaster bulletins (**Explicitly Tagged Demo Data**).

---

### WHERE AI IS ACTUALLY USED
1. **Explainable Deterministic Risk Engine:** Correlates real-time rain intensity, ground elevation depression, soil saturation index, and hazard reports into a transparent 0–100 score.
2. **Computer Vision Flood Depth Classifier:** Analyzes citizen-submitted road photos for water reflectivity, surface coverage percentage, and vehicle clearance passability.
3. **Conversational Copilot:** Ingests live user location, weather telemetry, and route risk into natural-language safety recommendations.

---

### FLOOD RISK CALCULATION
$$\text{Risk Score} = 0.35(\text{Rain Rate}) + 0.25(\text{Elevation Depression}) + 0.20(\text{Soil Saturation}) + 0.15(\text{Official Bulletins}) + 0.05(\text{Crowd Reports})$$
- Scores: $0–30$ (LOW), $31–60$ (MODERATE), $61–80$ (HIGH), $81–100$ (CRITICAL).
- Every score output provides a factor-by-factor breakdown table explaining why the score was assigned.

---

### ROUTING IMPLEMENTATION
- Generates dual route options: **Direct Corridor (Fastest)** vs. **Elevated Bypass (Safest)**.
- Samples polyline coordinates against spatial flood risk buffers and citizen hazard pins.
- **Data Honesty:** Strictly labeled as *"Lower modeled flood-risk exposure"*; never claims "guaranteed safe".

---

### SECURITY & PRIVACY CONTROLS
- Stateless JSON Web Tokens (JWT) with salted bcrypt password hashing.
- Role-Based Access Control (RBAC): `CITIZEN`, `RESPONDER`, `ADMIN`, `SUPER_ADMIN`.
- Joi schema validation on all inputs; Express rate limiting on public endpoints.
- Clean `.gitignore`; zero secrets, keys, or SQLite binaries tracked in Git.

---

### PHYSICAL & SYSTEM LIMITATIONS
- **30m Topographic Resolution:** Does not resolve micro-features like blocked curb drainage or individual speed bumps.
- **Satellite Latency:** Optical/radar satellite revisit cycle is 6–12 hours.
- **Public OSRM Rate Limits:** Production deployments require self-hosted OSRM instances.
- **Crowdsource Verification:** Requires automated or human moderation to filter false submissions.

---

### SHORTEST SUCCESSFUL DEMO SEQUENCE (60 SECONDS)
1. **Map (15s):** Open `/live-map`, type *Patna* or *Chennai*, demonstrate nationwide GIS coverage.
2. **Risk (15s):** Open Risk Analysis, show the 0–100 score and explainable 5-factor breakdown.
3. **Route (15s):** Open `/route-planner`, calculate *Velachery to Chennai Central*, highlight the green **Elevated Bypass** with lower modeled risk.
4. **Emergency & Copilot (15s):** Show one-tap 112 calling and ask the AI Copilot: *"Why is the risk elevated?"*
