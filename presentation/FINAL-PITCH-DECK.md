# FloodRoute AI Platform — Final Pitch Deck (10 Slides)

---

## SLIDE 1 — TITLE

# FloodRoute AI Platform
### AI-Powered Flood-Risk Decision Support and Route Awareness

**One-Line Value Proposition:**  
FloodRoute AI synthesizes real-time meteorological observations, digital elevation models, and verified road hazards to calculate transparent flood-risk scores and recommend routes with lower modeled flood-risk exposure.

*Visual Suggestion:*  
Split layout with interactive Leaflet GIS map on the left showing active hazard markers across India, and an explainable 0–100 risk gauge with factor breakdown on the right.

---

## SLIDE 2 — THE PROBLEM

### Urban Flooding & Fragmented Information
During severe monsoon storms across Indian urban hubs, conditions change rapidly, creating critical decision-making challenges:
- **Rapidly Changing Conditions:** Sudden cloudbursts drop intense precipitation over micro-catchment zones in 20 minutes, submerging roads before alerts circulate.
- **Fragmented Information:** Rainfall totals live on meteorological portals, road conditions on social media, and shelter locations in static PDF circulars.
- **Difficult Transit Decisions:** Conventional navigation apps only monitor traffic velocity; an empty green road can be submerged under three feet of water in an underpass.
- **Disconnected Emergency Services:** Commuters and responders lack a single unified interface to discover verified high-ground relief centers and hospitals during flash floods.
- **Lack of Integrated Decision Support:** Existing platforms offer either raw weather numbers or traffic routing, with zero hydrological context connecting the two.

---

## SLIDE 3 — OUR SOLUTION

### An End-to-End Decision-Support Pipeline

```text
Location Search / GPS
          ↓
Weather & Environmental Context (Real-Time Rain Rate, 24h Accumulation, Wind)
          ↓
Flood-Risk Estimate (0–100 Deterministic Multi-Factor Scoring)
          ↓
Map Visualization (Interactive GIS Cartography & Hazard Overlays)
          ↓
Route Analysis (Direct Corridors vs. Elevated Arterial Bypasses)
          ↓
Emergency Services (One-Tap 112 Dialing & High-Ground Shelter Discovery)
          ↓
AI Assistance (Conversational Context-Aware Transit Guidance)
```

- Translates complex hydrometeorological signals into plain-language actionable decisions.
- Integrates both citizen transit safety and emergency authority incident command into one platform.

---

## SLIDE 4 — LIVE PRODUCT

### Verified Operational Capabilities
The platform is fully implemented and running across four coordinated services:
- **Interactive GIS Map (`apps/web`):** Leaflet 1.9 canvas supporting smooth pan, zoom, layer switching (Street, Satellite, Topography), and live hazard pins across all 36 Indian states and union territories.
- **Location Geocoding:** Real-time city and suburb forward geocoding via OpenStreetMap Nominatim with camera fly-to animation.
- **Weather Telemetry:** Real-time hourly precipitation ($mm/h$), temperature, and wind speed from Open-Meteo synced with the IMD observation grid.
- **Flood-Risk Results:** Real-time 0–100 scoring with qualitative risk categorization (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Route Analysis:** Multi-route corridor calculation with elevation profiles, waypoint risk sampling, and bypass recommendations.

---

## SLIDE 5 — FLOOD-RISK ENGINE

### Explainable Multi-Factor Methodology

```text
INPUTS
(Rainfall mm/h, SRTM 30m Elevation, Soil Saturation, Active Advisories, Citizen Reports)
          ↓
PROCESSING & NORMALIZATION
(Raw sensor and spatial data mapped to [0, 100] sub-scores)
          ↓
RISK FACTORS
(Rain 35% + Elevation 25% + Saturation 20% + Advisories 15% + Citizen Reports 5%)
          ↓
MODEL / SCORE
(Deterministic weighted sum yielding 0–100 Risk Index)
          ↓
RISK LEVEL
(LOW [0–30] • MODERATE [31–60] • HIGH [61–80] • CRITICAL [81–100])
```

> **Data Honesty Standard:**  
> The score is an auditable **MODEL ESTIMATE** providing advisory guidance; it is explicitly distinguished from statutory **OFFICIAL WARNINGS** issued by government agencies.

---

## SLIDE 6 — ROUTE INTELLIGENCE

### Evaluating Hazard Exposure Along Transit Corridors
- **Candidate Path Generation:** Ingests highway geometry via Open Source Routing Machine (OSRM).
- **Spatial Risk Intersections:** Samples route coordinates at 250-meter intervals against localized elevation depressions and active waterlogging reports.
- **Dual Corridor Comparison:**
  - *Direct Corridor (Fastest):* Shortest travel time, but passes through low-lying basins and flood-prone underpasses.
  - *Elevated Bypass (Safest):* Deflects via elevated arterials and flyovers.
- **Standardized Safety Phrasing:**  
  The platform highlights alternative corridors for **"Lower modeled flood-risk exposure"**.  
  *Important Note: Not a guarantee of road safety. Commuters must always comply with on-ground traffic police and emergency personnel.*

---

## SLIDE 7 — CONTEXT-AWARE AI ASSISTANT

### Conversational Hydrological Guidance (Copilot)
- **Context Ingested:** User GPS coordinates, municipal name, current precipitation rate ($mm/h$), ground elevation ($m$ MSL), and route risk score.
- **Sample Query:** *"Why is the flood risk elevated?"*  
  **Actual AI Response:**  
  *"The modeled flood risk for Velachery Basin is 93/100 (CRITICAL). Contributing factors include heavy precipitation (42 mm/h) and a low-lying saucer elevation (4.2m MSL) near Pallikaranai marshland. We recommend avoiding low-clearance underpasses and taking the elevated OMR bypass."*
- **Offline Resilience:** If the Python AI microservice is disconnected, client-side deterministic rule templates generate structured hydrological advice.
- **Limitations:** The assistant does not predict flash-flood timing to the exact minute and strictly advises against attempting to ford standing water.

---

## SLIDE 8 — TECHNICAL ARCHITECTURE

### Clean Multi-Tier Microservice Topology

```text
                                USER
                                 │
                                 ▼
                        WEB APPLICATION (Port 8080)
                        [React 18 + Vite + Tailwind]
                                 │
                                 ▼
                     APPLICATION / API GATEWAY (Port 5000)
                     [Express.js + TypeScript + Helmet + Joi]
                                 │
            ┌────────────────────┼────────────────────┬────────────────────┐
            ▼                    ▼                    ▼                    ▼
     WEATHER SERVICE      FLOOD-RISK ENGINE     ROUTING SERVICE      EMERGENCY DATA
     [Open-Meteo API]     [5-Factor Model]      [OSRM Engine]        [Shelter Index]
            │                    │                    │                    │
            └────────────────────┼────────────────────┴────────────────────┘
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   PYTHON AI ENGINE (Port 8000)              DATABASE (SQLite / Prisma)
   [FastAPI + OpenCV Vision]                 [Relational Persistence]
                                                      │
                                                      ▼
                                           ADMIN / ANALYTICS (Port 5174)
                                           [Triage Queue & Recharts Deck]
```

---

## SLIDE 9 — RESPONSIBLE DESIGN & FUTURE ROADMAP

### Current Implementation (Verified Today)
- **Decision-Support Estimates:** Clearly labeled model estimates with factor attribution.
- **Resilient Fallback Handling:** Cached observation baselines, topological bypass calculations, and offline Demo Mode.
- **Data Integrity:** Strict badges for `LIVE DATA`, `MODEL ESTIMATE`, `FORECAST DATA`, and `DEMO DATA`.

### Future Roadmap (Explicitly Labeled as FUTURE)
- **IoT River Sensor Ingestion (FUTURE):** Direct telemetry feeds from Central Water Commission (CWC) stage gauges.
- **Authoritative Warning Synchronization (FUTURE):** Automated CAP-XML integration with NDMA / Sachet feeds.
- **On-Device Edge Vision (FUTURE):** Lightweight in-browser model execution via WebAssembly / TensorFlow.js.
- **Multilingual Support (FUTURE):** Regional language UI and SMS command localization in Hindi, Tamil, Telugu, and Bengali.

---

## SLIDE 10 — CLOSING

### Smarter Flood Intelligence. Safer Routes.

> **"FloodRoute turns fragmented flood-related information into a single decision-support experience for understanding risk, exploring routes, and finding nearby emergency services."**

- **Map:** Nationwide interactive GIS cartography across India.
- **Risk:** Explainable 0–100 multi-variable flood-risk modeling.
- **Route:** Decision support prioritizing lower modeled flood-risk exposure.
- **Emergency:** One-tap 112 calling and verified high-ground shelter discovery.
- **AI:** Context-aware plain-language guidance and computer-vision depth analysis.

*GitHub Repository:* [https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform](https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform)  
*Evaluator Entry Point:* `http://localhost:8080/`
