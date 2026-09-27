# FloodRoute AI — Judge Quickstart (Under 60 Seconds)

**Welcome, Judge!** Here is what you need to know in under one minute:

---

## 1. WHAT TO LOOK AT
- **Interactive GIS Map:** Nationwide Indian coverage with layer toggles (Street, Satellite, Topography).
- **Explainable Risk Engine:** Deterministic 0–100 score breaking down rainfall, ground elevation, and hazard reports.
- **Route Analysis:** Dual corridor comparison highlighting elevated bypasses with **lower modeled flood-risk exposure**.
- **Emergency Services:** Curated high-ground relief centers, hospitals, and one-tap 112 dialing.
- **AI Copilot:** Conversational assistant answering transit safety queries with real-time location context.
- **Admin Command Console:** Operational dashboard at `http://localhost:5174` for report triage and alert dispatch.

---

## 2. WHAT TO TEST
- **Search:** In `/live-map`, search *"Patna"* or click *"Chennai"* to verify smooth geocoding and map flying.
- **Risk:** Open the Risk breakdown to inspect the factor attribution table.
- **Route:** In `/route-planner`, calculate directions and observe the safer bypass geometry circumventing underpasses.
- **AI:** Open Copilot chat in the bottom right; ask *"Why is the risk elevated?"*.
- **Responsive UI:** Resize your browser to mobile width (<768px); check the sticky bottom navigation bar (`MobileNav.tsx`).

---

## 3. WHAT IS AI
- **Explainable Correlative Risk Engine:** Deterministic multi-variable algorithm translating disparate signals into an explainable 0–100 score.
- **Computer Vision Model:** Python FastAPI service analyzing citizen photos for surface water coverage percentage and vehicle clearance passability.
- **Conversational Copilot:** Ingests live telemetry context into natural-language safety advice.

---

## 4. WHAT IS MODELING
- A weighted mathematical formula:
  $$\text{Risk Score} = 0.35(\text{Rain}) + 0.25(\text{Elevation Depression}) + 0.20(\text{Soil Saturation}) + 0.15(\text{Bulletins}) + 0.05(\text{Crowd Reports})$$
- Scores: $0–30$ (LOW), $31–60$ (MODERATE), $61–80$ (HIGH), $81–100$ (CRITICAL).

---

## 5. WHAT IS EXTERNAL DATA
- **Live Weather:** Open-Meteo API synced with IMD meteorological observation grid.
- **Geocoding & Maps:** OpenStreetMap & Nominatim.
- **Road Routing:** Open Source Routing Machine (OSRM).
- **Elevation Contours:** NASA SRTM 30m Digital Elevation Model.
- **Disaster Bulletins:** Pre-seeded scenario bulletins explicitly labeled `[DEMO DATA]`.
