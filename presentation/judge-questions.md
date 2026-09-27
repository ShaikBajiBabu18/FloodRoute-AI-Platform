# FloodRoute AI — Technical Judge Q&A Reference

> Direct, grounded, and technically rigorous answers to evaluation questions. No invented accuracy percentages, no unverified statistics, and no inflated claims.

---

### 1. What is innovative about this?
**Answer**:
Most navigation tools optimize exclusively for travel time or distance, with zero awareness of hydrological conditions or submerged road basins. Conversely, weather apps provide regional rain forecasts (e.g., "40 mm today in Chennai") without road-level transit implications. 

FloodRoute AI's innovation is **unifying environmental signals and routing into an explainable decision-support model**: cross-referencing precipitation rates with terrain elevation, drainage catchment proximity, and crowdsourced reports to identify corridors with **lower modeled flood-risk exposure** and direct access to high-ground shelters.

---

### 2. How is flood risk calculated?
**Answer**:
The flood risk score is a deterministic, explainable mathematical formulation normalized from 0 to 100:

$$\text{Risk Score} = 0.35 \times R_{\text{rain}} + 0.25 \times E_{\text{elev}} + 0.20 \times D_{\text{drain}} + 0.15 \times P_{\text{river}} + 0.05 \times C_{\text{crowd}}$$

* **Rainfall ($35\%$)**: Instantaneous rate ($mm/h$) and 24h accumulation.
* **Terrain Elevation ($25\%$)**: Digital Elevation Model relative to surrounding basin topography.
* **Drainage Saturation ($20\%$)**: Municipal runoff threshold capacity.
* **River / Canal Proximity ($15\%$)**: Buffer distance to drainage watercourses.
* **Crowdsourced Ground Truth ($5\%$)**: Verified citizen waterlogging reports within a 1.5 km corridor.

Outputs are classified into 4 standardized tiers: **LOW** ($<30$), **MODERATE** ($30–59$), **HIGH** ($60–79$), and **SEVERE** ($\ge 80$).

---

### 3. What data sources are used?
**Answer**:
We use real, publicly accessible APIs and datasets:
1. **Weather & Radar**: Open-Meteo Weather API (aggregating ECMWF, GFS, and radar numerical forecasts).
2. **Terrain Elevation**: Open-Meteo Elevation API / SRTM (30-meter Shuttle Radar Topography Mission).
3. **Geocoding & Roads**: OpenStreetMap via Nominatim geocoder and OSRM (Open Source Routing Machine).
4. **Relief Shelters & Alerts**: Seeded relational database based on NDMA disaster shelter specifications and IMD alert conventions.
5. **Community Hazard Reports**: Authenticated crowdsourced submissions with photo verification.

---

### 4. Is the prediction official?
**Answer**:
**No. Absolutely not, and we state this prominently across the entire platform.**  
Every score and route is labeled:  
`[MODEL-ESTIMATED RISK — ADVISORY GUIDANCE ONLY]`  
FloodRoute AI is a prototype decision-support tool. It does **not** issue statutory disaster declarations or sovereign civil defense orders. Citizens and emergency workers must always prioritize instructions from the **National Disaster Management Authority (NDMA)**, **State Disaster Management Authorities (SDMA)**, and on-ground traffic police.

---

### 5. How accurate is it?
**Answer**:
**We have not conducted certified hydrological validation trials, and we do not claim a validated percentage accuracy.**  
What the system provides is a **logically consistent, physics-informed deterministic model**: lower-elevation basins with heavy rainfall and saturated drains consistently score higher risk than elevated ridge roads. 

Our prototype achieves internal algorithmic consistency across test coordinates, but formal real-world precision would require empirical benchmarking against historical flood inundation sensors across municipal corporations.

---

### 6. How does route analysis work?
**Answer**:
The routing engine queries the Open Source Routing Machine (OSRM) for candidate transit paths (e.g., fastest direct arterial vs alternative bypasses). 

The system discretizes the candidate route polylines into 250-meter sample waypoints and evaluates each waypoint against the localized flood-risk surface. Routes that pass through low-lying canal depressions or reported submerged underpasses receive risk penalties. The platform then presents the alternative with **lower modeled flood-risk exposure**, comparing distance, estimated time, and road elevation profile.

---

### 7. Why use AI?
**Answer**:
AI is applied where it provides tangible, interpretable utility:
1. **Explainable Hydrological Attribution**: Translating continuous multi-variable physical inputs (rain rate, terrain slope, soil moisture, drainage limits) into an interpretable 0–100 score with factor weights.
2. **Context-Aware Assistance**: An interactive conversational assistant that ingests active environmental telemetry (current rain, elevation, score) to generate clear, plain-language answers for citizens.
3. **Computer Vision Verification**: A lightweight FastAPI OpenCV service to estimate standing water depth in citizen hazard photos.

---

### 8. How does the system scale?
**Answer**:
The system is built on a decoupled, stateless microservice architecture:
* **API Gateway**: Express.js with TypeScript and connection pooling.
* **Database**: Prisma ORM dual-compatible with PostgreSQL + PostGIS for enterprise deployment, and SQLite for zero-dependency local testing.
* **Frontend**: Static React 18 / Vite SPA served via CDN/Nginx with client-side MapLibre GL rendering.
* **Caching**: In-memory and Redis-ready caching layers (10-minute TTL on weather telemetry) prevent API rate-limiting under high concurrency.

---

### 9. What happens when APIs fail?
**Answer**:
Resilience is built into the architecture:
* **Weather API Fails**: The backend trips a 3.5-second circuit breaker and serves cached seasonal monsoon baseline profiles.
* **Routing Server Fails**: The frontend router falls back to pre-calculated topological elevation bypass corridors.
* **Database Fails / Offline**: The platform can run in self-contained demo mode using client-side scenario state.
* **Tile CDN Fails**: MapLibre GL is configured with fallback raster tile endpoints.
We never pretend a failed live API is working; transparent fallback badges appear in the UI.

---

### 10. What is the biggest limitation?
**Answer**:
Our primary limitation is the **30-meter resolution of global Digital Elevation Models (SRTM)**. A 30-meter grid averages terrain over a 900 m² footprint, meaning sub-meter micro-topographical features—such as a 1.5-meter raised flyover ramp, highway median barrier, or localized curb drain—are not captured without high-resolution municipal LiDAR surveys. We address this transparently by incorporating crowdsourced ground truth and conservative safety margins.

---

### 11. How could this be deployed in the real world?
**Answer**:
In a real-world deployment, FloodRoute AI would integrate directly with:
1. **Municipal Smart City Operations Centers**: Greater Chennai Corporation (GCC), BMC Mumbai, or BBMP Bengaluru.
2. **Live Ultrasonic IoT Water Sensors**: Low-cost LoRaWAN stage sensors mounted at urban railway underpasses.
3. **Official Alert Gateways**: Direct automated ingestion of NDMA Common Alerting Protocol (CAP-CP) feeds.
4. **Emergency Services Dispatch**: Shared situational map for first responders, fire services, and NDRF relief teams.

---

### 12. What would you build next?
**Answer**:
With additional engineering time, our next three milestones would be:
1. **Multilingual SMS / USSD Fallback**: Enabling feature-phone users without internet to text their PIN code and receive turn-by-turn high-ground directions in Hindi, Tamil, Telugu, and Bengali.
2. **High-Resolution Municipal LiDAR Ingestion**: Sub-meter elevation mapping for critical urban flyover ramps and culverts.
3. **Automated CAP-CP Alert Ingestion**: Bidirectional synchronization with India's national disaster broadcast network.
