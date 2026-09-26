# FloodRoute AI — Hackathon Judging Q&A Reference Manual

> **Official Project Description**:  
> *"FloodRoute AI is an AI-powered flood intelligence and route decision-support platform that combines weather data, location intelligence, flood-risk analysis, emergency services and route analysis in one interactive platform."*

---

### Q1. What specific problem are you solving?
**Answer**:
During extreme monsoon precipitation events across India, urban streets and underpasses flood within minutes. Commuters drive unknowingly into waterlogged junctions, emergency vehicles get stranded, and families lack actionable guidance on safe transit corridors and high-ground shelters. Weather forecasts provide regional rain totals but zero road-level transit context. FloodRoute AI bridges this gap by translating real-time hydrometeorological signals into explainable, flood-aware transit recommendations and verified emergency shelter navigation.

---

### Q2. What makes this fundamentally different from a normal weather app like AccuWeather or Google Weather?
**Answer**:
A standard weather app informs you: *"It is 29°C with 35 mm/h rain in Chennai."* It cannot tell you whether the Velachery Main Road is submerged, whether your vehicle can safely pass, or which elevated bypass flyover circumvents the inundated basin.  
FloodRoute AI:
1. Cross-references precipitation with 30m Digital Elevation Models (DEM) and drainage runoff capacity.
2. Ingests and verifies crowdsourced citizen waterlogging reports with AI computer vision depth analysis.
3. Computes transit routes specifically optimized for **lower modeled flood-risk exposure**.
4. Provides immediate direct connection to verified 24/7 high-ground emergency shelters and the National 112 helpline.

---

### Q3. Exactly how is the flood risk calculated?
**Answer**:
Our flood risk score is an explainable, deterministic multi-variable mathematical algorithm normalized between $0$ and $100$:

$$\text{Risk Score} = 0.35 \times R_{\text{rain}} + 0.25 \times E_{\text{elev}} + 0.20 \times D_{\text{drain}} + 0.15 \times P_{\text{river}} + 0.05 \times C_{\text{crowd}}$$

* **Rainfall ($35\%$)**: Current precipitation rate ($mm/h$) and 24h accumulation curve from Open-Meteo.
* **Elevation ($25\%$)**: Digital Elevation Model relative to surrounding basin topography (lower elevations score higher risk).
* **Drainage ($20\%$)**: Municipal stormwater threshold saturation index.
* **River Proximity ($15\%$)**: Buffer distance to major rivers, canals, or tidal surge zones.
* **Crowdsourced Ground Truth ($5\%$)**: Verified citizen waterlogging reports within a 1.5 km corridor.

Scores map to 4 standardized tiers: **LOW** ($<30$), **MODERATE** ($30–59$), **HIGH** ($60–79$), and **SEVERE** ($\ge 80$).

---

### Q4. Are your predictions official government warnings?
**Answer**:
**No. Absolutely not, and we strictly enforce this distinction across the entire platform.**  
Every prediction and score is prominently stamped:  
`[AI ESTIMATE — DECISION SUPPORT ADVISORY]`  
All safe route choices are labeled:  
`Lower Modeled Flood-Risk Exposure`  
We explicitly include non-statutory disclaimers stating that FloodRoute AI is a decision-support prototype. Citizens are instructed to prioritize statutory directives issued by the National Disaster Management Authority (NDMA), State Disaster Management Authorities (SDMA), and on-ground traffic police.

---

### Q5. Where does your weather data come from?
**Answer**:
We ingest live, real-time meteorological telemetry from the **Open-Meteo Weather API**, which aggregates high-resolution numerical weather prediction models including the ECMWF, GFS, and regional radar assimilation. The data is ingested via an asynchronous backend pipeline with Redis/in-memory caching (TTL 10 minutes) and automatic fallback to verified historical seasonal baselines if external network connectivity fails.

---

### Q6. How does the routing engine work?
**Answer**:
Our routing engine interfaces with the **Open Source Routing Machine (OSRM)** via OpenStreetMap topological graph data. When a user requests a route:
1. The engine retrieves candidate route polylines (fastest direct path vs alternative corridors).
2. The route polyline is sampled at 250m intervals.
3. Each waypoint is evaluated against our localized flood-risk surface and active hazard polygons.
4. Segments intersecting severe risk zones ($>80$) or confirmed deep-water reports ($>45$ cm) receive heavy cost penalties.
5. The system recommends the path with **Lower Modeled Flood-Risk Exposure**, comparing distance, elevation profile, and transit risk delta.

---

### Q7. How do you handle unavailable APIs, rate limits, or network failures?
**Answer**:
Resilience is a primary design tenet:
* **Circuit Breakers & Timeouts**: External calls to Open-Meteo, OSRM, or Nominatim geocoding enforce a 3.5-second hard timeout.
* **Tiered Fallbacks**: If external APIs fail, the backend serves pre-computed topological baselines for 8 major Indian flood-prone metropolitan regions.
* **Tile Fallbacks**: MapLibre GL is configured with fallback raster tile endpoints if the primary vector tile server experiences downtime.
* **PWA Offline Mode**: The frontend caches static assets and essential emergency directory data via service workers for zero-connectivity triage.

---

### Q8. What specific role does AI play in this platform?
**Answer**:
AI is applied across two targeted, practical domains:
1. **Explainable Hydrological Risk Modeling**: A multi-factor mathematical inference engine that translates 5 continuous spatial and atmospheric variables into an interpretable flood probability with granular factor attribution.
2. **Computer Vision Depth Estimation**: A lightweight Python FastAPI microservice utilizing OpenCV and PyTorch deep learning contour models to detect water bodies and estimate standing water depth in citizen-submitted photos.

---

### Q9. Can this platform scale across all of India?
**Answer**:
Yes. The platform is architected for national scale:
* The geographic coordinate system, Nominatim geocoder, and Open-Meteo API support every latitude/longitude coordinate across the Indian subcontinent.
* The modular microservice architecture cleanly decouples the Express API Gateway, FastAPI Vision engine, and Vite React frontend, allowing independent horizontal autoscaling on Kubernetes or cloud container platforms.
* Relational data is indexed on spatial coordinates, with Prisma dual-compatibility supporting enterprise PostgreSQL + PostGIS.

---

### Q10. What would you improve or add with more time?
**Answer**:
With additional development time, our top engineering priorities are:
1. Direct integration with **Central Water Commission (CWC)** ultrasonic river basin telemetry sensors via MQTT.
2. Ingestion of official **NDMA Common Alerting Protocol (CAP-CP)** webhooks for automated siren validation.
3. Offline SMS/USSD routing fallback for low-connectivity rural populations with feature phones.
4. High-resolution 1-meter LiDAR elevation integration with municipal stormwater GIS maps.

---

### Q11. How is user data and privacy protected?
**Answer**:
* **Zero Location Tracking**: Citizen route queries and GPS lookups are processed in memory and are never persisted with user identity identifiers.
* **Secure Authentication**: Passwords hashed with Argon2id; secure stateless JWTs with HTTP-only cookies.
* **Role-Based Access Control (RBAC)**: Strict segregation between citizen accounts and administrative incident management tokens.
* **Redaction of Metadata**: Citizen report photos are stripped of EXIF metadata before public display.

---

### Q12. What is the single biggest limitation of the current prototype?
**Answer**:
The single biggest limitation is our reliance on 30-meter global Digital Elevation Models (SRTM). While 30m resolution accurately models general urban basins and river floodplains, it cannot capture micro-topographical barriers like 1.5-meter raised highway flyover medians, curbs, or localized street-level stormwater inlets without municipal high-resolution LiDAR surveys. We address this transparently by displaying confidence scores and incorporating ground-level crowdsourced citizen reports.
