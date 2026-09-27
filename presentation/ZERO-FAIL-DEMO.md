# FloodRoute AI Platform — Zero-Fail Live Demo Guide

**Document Purpose:** Master presentation protocol and zero-friction execution guide for presenting FloodRoute AI to hackathon judges under unpredictable live conditions.

---

## Part 1: Pre-Demo Readiness Checklist (Run 10 Minutes Prior)

### 1. Terminal & Environment Sanity Check
Confirm all 4 microservices are running in separate terminal sessions:
```bash
# 1. API Gateway (Port 5000)
npm run dev --workspace=server

# 2. Citizen Web Application (Port 8080)
npm run dev --workspace=apps/web

# 3. Emergency Operations Admin (Port 5174)
npm run dev --workspace=apps/admin

# 4. Computer Vision AI Engine (Port 8000)
python -m uvicorn app.main:app --app-dir apps/ai-service --port 8000
```

### 2. Microservice Diagnostic Verification
Run a quick automated health probe in PowerShell or curl:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```
*Expected Output:* `status: "healthy"` with all sub-services reporting operational.

### 3. Browser Setup
- Open Chrome or Edge in Incognito/Clean profile.
- Tab 1: `http://localhost:8080` (Citizen Portal & GIS Map)
- Tab 2: `http://localhost:5174` (Admin Command Console)
- Zoom level: Set to **100%** (or 90% if projecting onto 1080p presentation display).
- Open Developer Tools (`F12`), switch to Console tab, confirm zero red uncaught exceptions.

---

## Part 2: Step-by-Step Zero-Fail Click Sequence

### STEP 1: Platform Introduction & Problem Context
- **Action:** Open `http://localhost:8080/`. Land on the Command Center Dashboard.
- **Expected:** Hero banner displays: *"FloodRoute AI — Smarter Flood Intelligence. Safer Routes."* Live telemetry counters and map preview load immediately.
- **Presenter Line:** *"Welcome, judges. In standard mapping apps, a clear green road only means there is no traffic—it doesn't tell you whether that road is submerged under three feet of monsoon floodwater. FloodRoute AI is a real-time geospatial intelligence platform that calculates flood risk and recommends routes with lower modeled risk exposure."*
- **Fallback:** If home page takes longer than 2 seconds to fetch telemetry, immediately click **"Live GIS Map"** in the top navigation bar.

---

### STEP 2: Live India-Wide GIS Map & Layer Switcher
- **Action:** Click **"Live Map"** in the navigation bar. Zoom in slightly and toggle the **"Satellite"** or **"Topographic"** layer button.
- **Expected:** High-performance Leaflet canvas renders nationwide coverage across India. Pre-loaded hazard markers (red/yellow caution pins) appear over key metropolitan basins.
- **Presenter Line:** *"Here is our interactive GIS command map. It covers every state and union territory in India, ingesting live topographical elevation layers and real-time hazard markers."*
- **Fallback:** If external raster map tiles load slowly due to venue Wi-Fi, the built-in cached OpenStreetMap vector grid provides uninterrupted panning.

---

### STEP 3: Location Search & Geocoding
- **Action:** In the top search bar, type `Patna` (or `Chennai`) and click the first suggestion from the dropdown.
- **Expected:** Map smoothly flies to the selected city coordinates. A bottom slide-up card appears displaying current weather and active hazard status.
- **Presenter Line:** *"Let's examine Patna. The system geocodes the query using open geospatial data and instantly queries local atmospheric telemetry."*
- **Fallback:** If Nominatim geocoding times out, select one of the quick-action pills right below the search bar: `[Chennai (Velachery)]`, `[Mumbai (Kurla)]`, or `[Bengaluru (Silk Board)]`.

---

### STEP 4: Live Weather & Explainable Flood Risk Engine
- **Action:** Click **"View Full Risk Analysis"** or navigate to `/weather`.
- **Expected:** 
  1. Real-time temperature, hourly rainfall forecast, and precipitation bar chart.
  2. 0–100 Explainable Risk Score (e.g. `45/100 MODERATE` or `93/100 CRITICAL`).
  3. Factor-by-factor breakdown table with impact values and data sources.
- **Presenter Line:** *"Rather than giving an opaque black-box AI score, FloodRoute AI calculates an explainable 0 to 100 risk score based on 5 discrete parameters: real-time rainfall rate, digital elevation contours, active government advisories, river basin levels, and verified citizen hazard reports."*
- **Fallback:** If live weather API is unreachable, the system automatically pulls cached IMD observation grid data with a `[MODEL ESTIMATE]` badge.

---

### STEP 5: Route Decision Support & Safer Bypass Comparison
- **Action:** Click **"Plan Route"** in the navigation bar. Click **"Calculate Route"** with the default pre-filled coordinates (e.g. *Velachery to Chennai Central*).
- **Expected:** The routing engine renders two distinct polyline paths on the map:
  1. **Direct Corridor (Fastest - Red/Blue):** Shortest distance, but passes through high-risk waterlogged depressions.
  2. **Elevated Bypass (Safest - Green):** Slightly longer distance, but stays on elevated highways and flyovers with **"Lower Modeled Flood-Risk Exposure"**.
- **Presenter Line:** *"Here is our core routing differentiator. The direct route is 2 minutes shorter, but intersects high flood-risk underpasses. FloodRoute AI recommends the elevated arterial bypass, giving responders and families a lower modeled flood-risk exposure."*
- **Fallback:** If OSRM routing server takes >3 seconds, click the **Demo Mode** button in the header; the system instantly renders pre-computed elevation contour polylines.

---

### STEP 6: Emergency Services Discovery (One-Tap Help)
- **Action:** Click **"Emergency"** in the navigation bar.
- **Expected:** Dedicated emergency portal loads with:
  - Massive red `☎ Call 112 (National Emergency)` button.
  - Category filters: `Hospitals`, `Fire Stations`, `Police`, `Relief Shelters`.
  - Click-to-call direct phone numbers and one-tap routing to the nearest facility.
- **Presenter Line:** *"In high-stress crises, usability must be immediate. Our Emergency Portal provides high-contrast, one-tap access to national helplines, SDRF rescue outposts, and designated relief shelters."*
- **Fallback:** Works 100% offline from local database cache.

---

### STEP 7: Conversational AI Copilot
- **Action:** Click the floating **Copilot** chat icon in the bottom-right corner. Click the quick suggestion pill: *"Why is the flood risk elevated?"* (or type *"Is it safe to drive right now?"*).
- **Expected:** AI Copilot responds within 1 second with a structured, empathetic answer detailing the precipitation rate, basin elevation, and recommending elevated bypasses.
- **Presenter Line:** *"Our AI Copilot answers natural-language transit questions with real-time geospatial context, guiding citizens toward safe decision-making."*
- **Fallback:** If Python AI microservice is disconnected, the frontend Copilot engine serves a deterministic hydrological advisory from built-in knowledge templates.

---

### STEP 8: Emergency Operations Admin Console
- **Action:** Switch to Tab 2 (`http://localhost:5174/`) or click **"Admin"** in the navigation.
- **Expected:** Real-time triage dashboard shows incoming citizen hazard submissions, image classification confidence scores, verification approve/reject buttons, and an active alert broadcast tool.
- **Presenter Line:** *"For disaster management authorities like NDMA or district collectors, our Admin Command Console provides live citizen report triage, computer-vision flood severity tagging, and targeted alert broadcasting."*

---

## Part 3: The 30-Second Emergency Backup Demo (Zero-Network Mode)

If the presentation venue loses internet connectivity entirely:

1. **Activate Demo Mode:** Click the bright yellow **"Demo Mode"** button in the top navigation bar.
2. **Select Scenario:** Click **"Chennai (Velachery Inundation)"**.
3. **Walk Through the Cards (5 Seconds Each):**
   - *Weather Card:* Show 42 mm/h heavy cloudburst telemetry.
   - *Risk Gauge:* Show 93/100 CRITICAL risk score with elevation depression factor.
   - *Route Comparison:* Show the green elevated bypass circumventing the flooded underpass.
   - *AI Copilot:* Click *"Nearest shelter"* to display SDRF camp directions.
4. **Closing Statement:** *"All data in Demo Mode is clearly tagged as `[DEMO DATA]` for ethical transparency, demonstrating our full decision-support pipeline offline."*

---

## Part 4: API & Network Failure Handling Matrix

| Scenario | System Behavior | Presenter Handling |
|---|---|---|
| **Weather API Fails / Rate-Limited** | System falls back to cached meteorological grid; displays `[MODEL ESTIMATE]` | Point out the resilient fallback badge |
| **Geocoding API Unreachable** | System provides instant pre-seeded city suggestion chips | Click one of the pre-seeded chips |
| **OSRM Routing Server Down** | System calculates topological elevation bypass using local Euclidean DEM vector geometry | Explain that topological bypass routes work offline |
| **Python AI Engine Offline** | System serves rule-based explainability text from server repository | Seamlessly proceed with copilot interaction |
| **Database Connection Interrupted** | SQLite WAL mode provides instant read locks without corruption | Zero downtime; read operations persist |

---

## Part 5: Final Demo State Reset Procedure

To return the application to a pristine state for the next round of judges:
1. Click the **"Demo Mode"** toggle in the header and click **"Reset Demo State"** (or press `Ctrl + Shift + R`).
2. Clears temporary route waypoints and active suggestions.
3. Resets Copilot conversation history to default welcome message.
4. Re-centers GIS map over national overview of India.
