# FloodRoute AI Platform — Final Handoff Judge Q&A

**Fact-Based Reference:** Concise, factual answers to the 10 most critical evaluation questions.

---

### 1. What did you build?
**Answer:** FloodRoute AI — an AI-powered flood-risk decision-support platform designed for Indian urban monsoons. It bridges meteorological observations, 30m digital elevation models, and open routing to compute explainable flood risk and recommend routes with lower modeled flood-risk exposure.

### 2. Why AI?
**Answer:** Weather apps only provide regional millimeter totals without road elevation context. We use AI to correlate dynamic rainfall with topographical ground depressions, execute OpenCV computer vision to classify water depth and vehicle passability from citizen photos, and provide conversational transit advice via our context-aware Copilot.

### 3. How is risk calculated?
**Answer:** An explainable 5-factor deterministic formula:
$$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
Where $R$ is real-time rain intensity, $E$ is topographic ground elevation depression, $D$ is soil saturation index, $A$ is active meteorological warnings, and $C$ is verified citizen hazard reports.

### 4. What data is used?
**Answer:**
- **Live Meteorology:** Open-Meteo API synced with IMD observation grids.
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API.
- **Road Network Graph:** Open Source Routing Machine (OSRM).
- **Elevation Contours:** NASA SRTM 30m Digital Elevation Model.
- **Disaster Bulletins:** Pre-seeded scenario alerts explicitly tagged `[DEMO DATA]`.

### 5. How does routing work?
**Answer:** The routing service queries candidate driving trajectories from OSRM, discretizes waypoints at ~250m intervals, samples coordinates against spatial flood risk buffers, and penalizes waterlogged underpasses to recommend elevated arterial bypasses with lower modeled flood-risk exposure.

### 6. Is it guaranteed safe?
**Answer:** **No, and we strictly never claim it is.** Monsoon weather and flash flooding can change rapidly. Our platform explicitly labels recommendations as **"Lower modeled flood-risk exposure"** and reminds users that it is an advisory decision-support estimate.

### 7. What happens when APIs fail?
**Answer:**
- Geocoding failure $\to$ pre-seeded municipal quick chips appear.
- Weather failure $\to$ cached meteorological baselines load with a `[MODEL ESTIMATE]` badge.
- Routing failure $\to$ geodesic topological elevation bypass geometry renders locally.
- Network outage $\to$ **Demo Mode** runs the complete showcase offline from local cache.

### 8. How is security handled?
**Answer:** Stateless JSON Web Tokens (JWT), salted `bcryptjs` password hashing, Role-Based Access Control (`CITIZEN`, `ADMIN`), Joi schema validation, Helmet security headers, rate limiting, and zero secrets/credentials tracked in Git.

### 9. What are the limitations?
**Answer:** 30m SRTM DEM resolution does not capture sub-meter curb drainage blockages; satellite radar carries 6–12h revisit cycles; public OSRM servers enforce rate limits; crowdsourced reports require moderation to prevent false reports.

### 10. What would you build next?
**Answer:** Direct IoT ultrasonic river gauge integration with Central Water Commission (CWC) telemetry; on-device edge vision inference in mobile browsers via WebAssembly / TensorFlow.js; and official NDMA / Sachet CAP-XML alert feed synchronization.
