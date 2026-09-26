# FloodRoute AI — Hackathon Judging Notes & Technical Q&A

> Rigorous, technically honest, and evidence-based answers to critical evaluation questions from technical, GIS, and domain judges.

---

### Q1. What specific problem are you solving?
**Answer**:
During extreme monsoon precipitation events in India, localized street flooding and underpass submergence occur within minutes. Commuters drive unknowingly into waterlogged junctions, ambulances get immobilized, and citizens lack real-time clarity on safe evacuation corridors. Weather forecasts provide regional rain totals but zero road-level transit context. FloodRoute AI bridges this critical gap by translating atmospheric and hydrological signals into explainable, flood-aware transit recommendations and verified emergency shelter navigation.

---

### Q2. What makes this fundamentally different from a normal weather app like AccuWeather or Google Weather?
**Answer**:
A standard weather app informs you: *"It is 29°C with 35 mm/h rain in Chennai."* It cannot tell you whether the Velachery 100 Feet Main Road is flooded, whether your hatchback can safely pass, or which elevated bypass flyover circumvents the inundated basin. 

FloodRoute AI:
1. Cross-references precipitation with digital terrain elevation ($m$ MSL) and drainage saturation.
2. Ingests and displays verified crowdsourced waterlogging reports with AI computer vision depth analysis.
3. Computes transit routes specifically optimized for **lower modeled flood-risk exposure**.
4. Provides immediate direct connection to verified 24/7 high-ground emergency shelters and the National 112 helpline.

---

### Q3. Exactly how is the flood risk calculated?
**Answer**:
Our flood risk score is a deterministic, explainable multi-variable mathematical algorithm normalized between $0$ and $100$:

$$\text{Risk Score} = 0.35 \times R_{\text{rain}} + 0.25 \times E_{\text{elevation}} + 0.20 \times D_{\text{drainage}} + 0.15 \times P_{\text{river}} + 0.05 \times C_{\text{crowd}}$$

* **Rainfall ($35\%$)**: Current rate ($mm/h$) and 24h accumulation curve.
* **Elevation ($25\%$)**: Digital Elevation Model relative to surrounding basin topography (lower elevations score higher risk).
* **Drainage ($20\%$)**: Municipal runoff threshold saturation index.
* **River Proximity ($15\%$)**: Buffer distance to major rivers, canals, or tidal surge zones.
* **Crowdsourced Ground Truth ($5\%$)**: Verified citizen waterlogging reports within a 1.5 km corridor.

Scores are mapped to 4 national standardized tiers: **LOW** ($<30$), **MODERATE** ($30–59$), **HIGH** ($60–79$), and **SEVERE** ($\ge 80$).

---

### Q4. Are your predictions official government warnings?
**Answer**:
**No. Absolutely not, and we strictly enforce this distinction across the entire platform.**  
Every prediction and score is prominently stamped:  
`AI ESTIMATE • AI FLOOD PREDICTION`  
All safe route choices are labeled:  
`Lower Modeled Flood-Risk Exposure`  
We explicitly include non-statutory disclaimers stating that FloodRoute AI is a decision-support prototype. Citizens are instructed to prioritize statutory directives issued by the National Disaster Management Authority (NDMA), State Disaster Management Authorities (SDMA), and on-ground traffic police.

---

### Q5. Where does your weather data come from?
**Answer**:
We ingest live meteorological telemetry via the **Open-Meteo Weather API**, which aggregates high-resolution numerical weather prediction models including the Global Forecast System (GFS) and European Centre for Medium-Range Weather Forecasts (ECMWF), with specific localized data points for India. In-memory TTL caching (10 minutes) is maintained on the API gateway to prevent external rate-limiting while providing near-real-time updates.

---

### Q6. How does the routing engine work?
**Answer**:
The platform utilizes the **Open Source Routing Machine (OSRM)** running via our backend proxy. When origin and destination coordinates are provided:
1. OSRM computes primary driving corridors and step-by-step road polylines.
2. Our backend spatial service generates a bounding corridor buffer and intersects the route geometry with active flood hazard points and low-elevation depressions.
3. The system generates 3 comparative choices:
   * **🟢 Elevated Bypass (Safest)**: Uses arterial flyovers with lowest modeled flood-risk exposure.
   * **🔵 Direct Corridor (Fastest)**: Shortest transit duration, but flagged with high water ingress hazard.
   * **🟡 Balanced Arterial**: Moderate detour avoiding major canal bottlenecks.

---

### Q7. How do you handle unavailable APIs, rate limits, or network failures?
**Answer**:
The architecture is engineered with multi-tier graceful degradation:
* **Weather API Offline**: Gateway falls back to cached telemetry; if empty, it applies historical seasonal monsoon averages and clearly displays an `[OFFLINE / ESTIMATED]` badge.
* **OSRM Offline**: Gateway falls back to a multi-point spatial interpolation line with caution advisories.
* **Network Disconnection on Mobile**: Our Service Worker (`public/sw.js`) caches map tiles and application assets offline. Incident reports submitted while offline are stored in encrypted LocalStorage and queued for automatic background synchronization once connectivity resumes.
* **Database Fallback**: SQLite provides instant zero-dependency local development, while PostgreSQL powers scalable production environments.

---

### Q8. What specific role does AI play in this platform?
**Answer**:
AI is applied in three concrete, functional areas rather than as a marketing buzzword:
1. **Explainable Hydrological Risk Modeling**: Synthesizes disparate multi-variable inputs into a calibrated, explainable 0–100 score with explicit factor attribution weights.
2. **Computer Vision Flood Segmentation (FastAPI + OpenCV)**: Analyzes citizen-submitted road photos, segmenting specular water reflections, computing water coverage percentages, and providing vehicle clearance heuristics (e.g. *"Water depth exceeds sedan axle height"*).
3. **Context-Aware Conversational Copilot**: A semantic assistant that injects the active map coordinates, current weather, and active alerts into queries, providing intelligible plain-language transit guidance.

---

### Q9. Can this platform scale across all of India?
**Answer**:
**Yes.**  
* The geospatial mapping (MapLibre GL / OpenStreetMap) and geocoding services cover all 28 states and 8 union territories.
* Open-Meteo provides continuous coordinate-based weather coverage across the entire Indian subcontinent.
* The backend is built on a stateless Express/Node.js architecture that can be horizontally scaled across container clusters (Docker / Kubernetes) with a PostgreSQL connection pool.
* We have already seeded and demonstrated monitored basins across **Chennai, Mumbai, Delhi, Guwahati, and Bengaluru**.

---

### Q10. What would you improve or add with more time?
**Answer**:
With additional development time and municipal partnerships:
1. **Physical IoT Sensor Ingestion**: Connecting ultrasonic water-level sensors installed under bridges and inside stormwater drains for ground-truth telemetry.
2. **Direct NDMA CAP Integration**: Ingesting the Common Alerting Protocol XML feeds directly from government disaster portals.
3. **Satellite SAR Imagery**: Processing Sentinel-1 Synthetic Aperture Radar imagery to detect wide-area floodplain boundaries through heavy cloud cover.
4. **Multilingual Speech Recognition**: Expanding voice input from English, Hindi, and Tamil to all 22 scheduled Indian languages.

---

### Q11. How is user data and privacy protected?
**Answer**:
* Location data is only processed ephemerally during active routing requests; citizen coordinates are never stored without consent.
* All passwords use Argon2 / bcrypt cryptographic hashing.
* Inbound requests are sanitized through strict Zod schema validation.
* No personal contact details are publicly visible on community flood reports.
* The platform maintains a strict zero-secret policy: API keys and credentials are completely excluded from source control.

---

### Q12. What is the single biggest limitation of the current prototype?
**Answer**:
**The absence of real-time municipal stormwater pump telemetry and authoritative live road-closure sensor feeds.**  
Currently, our drainage saturation is calculated algorithmically from rainfall volume and topography rather than reading directly from smart-city SCADA sensors on municipal pumps. In a production deployment, partnering with municipal corporations (e.g. Greater Chennai Corporation or BMC Mumbai) to stream physical pump station status would make our predictive model even more precise.
