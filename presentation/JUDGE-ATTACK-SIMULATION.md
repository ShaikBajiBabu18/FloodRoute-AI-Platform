# FloodRoute AI Platform — Judge Attack Simulation (The 10 Hard Questions)

**Context:** Direct, candid, and technically precise answers to the 10 most skeptical questions a technical hackathon judge will ask. Every answer distinguishes between **IMPLEMENTED**, **MODEL ESTIMATE**, **EXTERNAL DATA**, **DEMO DATA**, and **FUTURE WORK**.

---

### Q1: "Why do you need AI here?"
**Answer:**
- **The Misconception:** People assume weather data directly tells you road conditions. It does not.
- **Why AI is Needed:** During cloudbursts, rainfall numbers alone cannot tell an ambulance whether a road underpass is submerged under three feet of stormwater. We use AI in two specific places:
  1. *Correlative Multi-Factor Risk Synthesis:* Rather than raw weather or static topographical maps, our deterministic algorithm correlates dynamic rainfall rate, digital elevation depressions, and ground hazard reports into an explainable 0–100 transit risk score.
  2. *Computer Vision Depth Estimation:* Our Python FastAPI microservice analyzes citizen incident photos to segment surface water coverage and classify vehicle clearance passability (`PASSABLE`, `DIFFICULT`, `IMPASSABLE`).
  3. *Contextual Natural-Language Copilot:* Ingests active GPS coordinates, rainfall rate ($mm/h$), and ground elevation ($m$ MSL) to provide plain-language pre-travel advice.
- **Distinctions:**
  - *IMPLEMENTED:* Python OpenCV image segmentation; 5-factor deterministic risk algorithm; contextual conversational Copilot.
  - *MODEL ESTIMATE:* The 0–100 risk score and vehicle clearance classifications are advisory estimates.
  - *FUTURE WORK:* On-device quantized MobileNet vision inference in the citizen mobile browser.

---

### Q2: "Isn't this just a map with weather data?"
**Answer:**
- **No.** An app that overlays radar tiles onto Google Maps only tells you that it is raining on a road. It does **not** evaluate whether that road is topographically viable or flood-prone.
- **The Core Value:** FloodRoute AI intersects the road routing graph (OSRM) with a 30-meter Digital Elevation Model (DEM) and citizen hazard reports. It calculates candidate trajectories, penalizes submerged underpasses, and actively recommends elevated highway bypasses with **"lower modeled flood-risk exposure"**. Furthermore, it integrates one-tap 112 emergency calling and high-ground shelter routing into a unified workflow.
- **Distinctions:**
  - *IMPLEMENTED:* OSRM waypoint discretization; SRTM 30m elevation integration; route risk comparison; emergency directory.
  - *EXTERNAL DATA:* Open-Meteo weather telemetry; OpenStreetMap cartography.

---

### Q3: "How exactly is flood risk calculated?"
**Answer:**
- **Formula:** We calculate an explainable, multi-variable heuristic index:
  $$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
  - $R$ (Rainfall Intensity - 35%): Normalized instantaneous rain rate ($mm/h$) and 24h accumulation.
  - $E$ (Elevation Depression - 25%): Relative depression depth derived from SRTM 30m DEM (e.g. saucer-shaped basins $<5\text{m}$ MSL receive maximum penalty).
  - $D$ (Soil & Drainage Saturation - 20%): Stormwater conduit capacity exceedance estimated from precipitation duration.
  - $A$ (Official Advisories - 15%): Proximity to active meteorological warning polygons.
  - $C$ (Citizen Ground Reports - 5%): Density of verified citizen waterlogging reports within a 1.5 km radius.
- **Explainability:** Every score output returns a factor-by-factor breakdown table explaining why the score was assigned.
- **Distinctions:**
  - *IMPLEMENTED:* Full mathematical equation in `server/src/services/riskEngine.ts`.
  - *MODEL ESTIMATE:* The score is a heuristic estimation, not an official statutory decree.

---

### Q4: "Where does your flood data come from?"
**Answer:**
- **Live Meteorological Telemetry:** Open-Meteo API synced with Indian Meteorological Department (IMD) observation grids.
- **Topographical Contours:** NASA SRTM 30m Digital Elevation Model.
- **Road Network & Geocoding:** OpenStreetMap and Nominatim forward geocoding.
- **Ground Incidents:** Citizen field submissions uploaded via our public reporting deck.
- **Disaster Bulletins:** Pre-seeded scenario bulletins modeled after NDMA/IMD formats, explicitly tagged `[DEMO DATA]` for judging predictability.
- **Distinctions:**
  - *EXTERNAL DATA:* Open-Meteo, OpenStreetMap, OSRM.
  - *DEMO DATA:* Pre-seeded emergency alerts and historical scenario telemetry.

---

### Q5: "What happens if the external APIs go down?"
**Answer:**
- **The Platform Never Crashes to a Blank Screen:**
  - If geocoding fails $\to$ pre-seeded municipal quick chips appear.
  - If weather API times out $\to$ system falls back to cached meteorological observation baselines with an explicit `[MODEL ESTIMATE]` badge.
  - If OSRM routing server times out $\to$ client generates geodesic topological elevation bypass geometry locally.
  - If venue Wi-Fi fails entirely $\to$ **Demo Mode** runs the complete showcase offline from local cache.
- **Distinctions:**
  - *IMPLEMENTED:* Try/catch resilience fallbacks in `apps/web/src/pages/` and `server/src/routing/`.

---

### Q6: "How do you know the route is safer?"
**Answer:**
- **We Never Claim It Is Guaranteed Safe:** Flash flooding and monsoon waters can change unpredictably.
- **What We Actually Calculate:** The platform discretizes route polylines and samples spatial buffers against elevation depressions and verified hazard reports. Corridors that remain on elevated flyovers and arterial highways have **lower modeled flood-risk exposure** compared to low-lying basin underpasses.
- **Distinctions:**
  - *IMPLEMENTED:* Route risk sampling and corridor comparison.
  - *MODEL ESTIMATE:* Labeled strictly as *"Lower modeled flood-risk exposure. Not a guarantee of road safety."*

---

### Q7: "Can I trust this during an actual flood?"
**Answer:**
- **Honest Truth:** You can trust it as an **intelligent decision-support tool**, but **never as a replacement for statutory emergency directives**.
- **Boundaries Disclosed:**
  - 30-meter elevation data cannot detect sub-meter street blockages (e.g. a localized clogged storm drain).
  - Satellite radar carries a 6–12 hour revisit latency.
  - Commuters must always comply with on-ground traffic police and disaster management personnel.
- **Distinctions:**
  - *IMPLEMENTED:* Prominent disclaimers across all risk cards and routing outputs.

---

### Q8: "What prevents someone from misunderstanding your risk score?"
**Answer:**
- **Three Strict Guardrails:**
  1. *Clear Attribution Breakdown:* Instead of a single number, the user sees: *"42 mm/h rain (+35 pts), 4m basin depression (+25 pts)"*.
  2. *Explicit Badging:* Outputs are badged as `[MODEL ESTIMATE]` to prevent confusion with official statutory emergency decrees.
  3. *No "Guaranteed Safe" Language:* Routes are explicitly labeled *"Lower modeled flood-risk exposure"*.

---

### Q9: "What is technically difficult about this project?"
**Answer:**
- **Asynchronous Spatial Correlation:** Harmonizing heterogeneous data layers across different spatial and temporal resolutions:
  - 0.1° (~11 km) meteorological sensor grids.
  - 30-meter raster digital elevation contours.
  - High-precision OpenStreetMap vector road graphs.
  - Point-based citizen incident coordinates.
- **Zero Single-Point-of-Failure Resilience:** Engineering fallback pipelines for weather, geocoding, routing, and AI so that an offline user or disconnected microservice never breaks the application.

---

### Q10: "What would you need to change before real emergency deployment?"
**Answer:**
- **Production Hardening Requirements:**
  1. *Self-Hosted OSRM:* Deploy dedicated OSRM Docker containers with contraction hierarchies instead of using public demo servers.
  2. *IoT River Sensor Telemetry:* Direct API ingestion of Central Water Commission (CWC) stage gauges.
  3. *Statutory CAP Protocol:* Ingest NDMA / Sachet Common Alerting Protocol XML feeds.
  4. *Commercial SMS Gateway:* Contract carrier aggregator bindings (e.g. CDAC Mobile Seva or Twilio) for the offline SMS parser.
- **Distinctions:**
  - *IMPLEMENTED:* SMS parser logic, REST contracts, and Docker compose definitions.
  - *FUTURE WORK:* Production telecom carrier and CWC gauge hardware integration.
