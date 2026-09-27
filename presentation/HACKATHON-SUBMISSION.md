# FloodRoute AI Platform

## One-Line Pitch
FloodRoute AI is an AI-powered flood intelligence and route decision-support platform that synthesizes real-time weather telemetry, digital elevation models, and verified road hazards to calculate explainable risk scores and guide citizens along routes with lower modeled flood-risk exposure.

---

## Problem
During severe monsoon downpours and sudden cloudbursts in Indian urban hubs (such as Chennai, Mumbai, Bengaluru, and Patna), arterial streets turn into impassable torrents within minutes. Conventional navigation apps (such as Google Maps or Waze) optimize almost exclusively for traffic speed and vehicle velocity; they cannot determine whether a congestion-free road is submerged under three to four feet of floodwater. Consequently, commuters unknowingly drive into inundated underpasses, emergency vehicles become trapped, and families lack actionable, verified guidance on safe evacuation corridors.

---

## Solution
FloodRoute AI bridges the critical gap between atmospheric weather telemetry, digital elevation data, and emergency navigation. The platform provides:
- A nationwide interactive GIS command map displaying live precipitation and active hazard markers.
- An explainable, multi-factor flood-risk scoring engine ($0–100$) that transparently attributes risk to rainfall rate, elevation depressions, soil saturation, river proximity, and citizen reports.
- Route decision support comparing direct corridors against elevated bypasses with **lower modeled flood-risk exposure**.
- Direct discovery of nearby high-ground shelters, NDRF liaison outposts, and emergency hospitals with one-touch 112 dialing.
- A context-aware AI Copilot providing conversational transit guidance and pre-travel safety checks.

---

## Key Features
1. **Interactive India-Wide GIS Map:** High-performance Leaflet canvas covering all 28 states and 8 union territories with layer switching (Street, Satellite, Topography).
2. **Municipal Location Geocoding:** Suburb and district search powered by OpenStreetMap Nominatim with automatic viewport centering.
3. **Real-Time Hydrometeorological Telemetry:** Live hourly precipitation rate ($mm/h$), 24-hour accumulation, temperature, and wind speed from Open-Meteo.
4. **Explainable AI Flood Risk Engine:** Transparent 0–100 scoring algorithm detailing exact contributing factors and data sources.
5. **Route Decision Support:** Dual route comparison highlighting elevated bypasses with lower modeled flood-risk exposure.
6. **Emergency Services & High-Ground Shelters:** Verified directory of relief camps, fire stations, and apex hospitals with direct calling.
7. **Citizen Hazard Crowdsourcing:** Mobile-first reporting interface allowing citizens to submit geotagged photos of road waterlogging.
8. **Computer Vision Image Analysis:** Python FastAPI microservice utilizing OpenCV heuristics to estimate surface water coverage and road passability.
9. **Incident Command Admin Console:** Operational triage deck for emergency personnel to verify reports and dispatch disaster bulletins.
10. **Offline Low-Bandwidth SMS Fallback:** Text command parser (`FLOOD [CITY]`, `ROUTE [FROM] TO [TO]`) designed for zero-internet emergency conditions.
11. **Predictable Demo Mode:** Deterministic presentation toggle for reproducible evaluations across key scenario metros.

---

## How It Works

```text
User Location / Search Query
            ↓
Weather & Environmental Telemetry Ingestion (Open-Meteo IMD Grid)
            ↓
Deterministic Flood-Risk Model (Rainfall + Elevation + Soil + Bulletins + Reports)
            ↓
Spatial Risk Visualization (GIS Map Layers & Telemetry Cards)
            ↓
Route Analysis & Hazard Intersection (Direct Corridor vs. Elevated Bypass)
            ↓
Emergency Services Discovery (Nearest Shelters, Hospitals, 112 Hotline)
            ↓
Conversational AI Assistance (Context-Aware Plain-Language Guidance)
```

---

## Technology Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Leaflet GIS, Framer Motion, Lucide Icons.
- **Backend Gateway:** Node.js, Express.js, TypeScript, Joi validation, Helmet, CORS, Rate-Limiting.
- **AI Microservice:** Python 3.10+, FastAPI, Uvicorn, OpenCV, NumPy.
- **Database & ORM:** Prisma ORM with SQLite (development) and PostgreSQL compatibility (production).
- **Testing & Quality:** Jest, Supertest, TypeScript strict compiler.

---

## Data Sources
- **Meteorology:** Open-Meteo API synced with Indian Meteorological Department (IMD) observation grid (**Live Data**).
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API (**Live Data**).
- **Road Network Graph:** Open Source Routing Machine (OSRM) highway network (**Live Data**).
- **Elevation Data:** NASA SRTM 30m Digital Elevation Model (**Integrated Model**).
- **Emergency Bulletins:** Seeded NDMA / IMD emergency disaster bulletins (**Explicitly Tagged Demo Data**).

---

## AI Usage
1. **Explainable Correlative Risk Engine:** Rather than an uninterpretable black box, the platform uses a 5-factor deterministic formulation that correlates multi-source signals into an explainable 0–100 score with factor-by-factor attribution.
2. **Computer Vision Flood Depth Classifier:** Python OpenCV microservice evaluating road images for water surface reflectivity, muddy water coverage percentage, and vehicle wheel clearance.
3. **Conversational Copilot:** Ingests live coordinates, current precipitation rate, elevation, and route risk into natural-language safety guidance.

---

## Flood-Risk Method
The platform calculates an explainable risk index:
$$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
- **$R$ (Rainfall Intensity - 35%):** Instantaneous precipitation ($mm/h$) and 24h accumulation.
- **$E$ (Topographical Elevation - 25%):** Relative depression depth derived from SRTM 30m DEM.
- **$D$ (Soil Saturation - 20%):** Estimated drainage capacity exceedance index.
- **$A$ (Official Advisories - 15%):** Proximity to active meteorological warning polygons.
- **$C$ (Crowdsourced Ground Corroboration - 5%):** Verified citizen waterlogging reports within a 1.5 km corridor.

---

## Routing
The routing engine samples road waypoints generated via OSRM against spatial flood risk buffers and citizen hazard pins. It presents a clear comparison between the shortest direct path and an elevated arterial bypass. Recommendations are strictly labeled as **"Lower modeled flood-risk exposure"** rather than claiming guaranteed safety, reminding commuters to always obey on-ground traffic authorities.

---

## Security
- **Authentication:** Stateless JSON Web Tokens (JWT) signed with secure secrets; password hashing via `bcryptjs` with salt rounds.
- **Access Control:** Strict Role-Based Access Control (`CITIZEN`, `RESPONDER`, `ADMIN`, `SUPER_ADMIN`).
- **Input Sanitization:** Joi validation schemas enforced across all API endpoints.
- **DDoS & Abuse Mitigation:** Helmet HTTP security headers and Express rate limiting on public routes.
- **Repository Cleanliness:** Zero credentials, API keys, `.env` files, or SQLite binaries committed to Git.

---

## Limitations
- **Topographic Resolution:** 30m SRTM digital elevation data does not capture sub-meter urban features like elevated curbs or localized storm gutter blockages.
- **Satellite Refresh Interval:** Remote sensing radar and optical satellite feeds carry a 6–12 hour revisit latency.
- **Public OSRM Rate Limits:** Production deployments require a dedicated self-hosted OSRM container with contraction hierarchies.
- **Citizen Report Verification:** Public reports require algorithmic or moderator approval before influencing route penalty weights.

---

## Future Improvements
1. **IoT River Gauge Integration:** Direct ingestion of Central Water Commission (CWC) water-level sensor telemetry at major river bridges.
2. **On-Device Edge AI:** Deploying lightweight quantized vision models in citizen mobile browsers using WebAssembly / TensorFlow.js for offline flood depth detection.
3. **Common Alerting Protocol (CAP):** Native XML ingestion from the national Sachet / NDMA CAP broadcast feeds.
4. **Expanded Regional Languages:** SMS and UI localization into Hindi, Tamil, Telugu, and Bengali.
