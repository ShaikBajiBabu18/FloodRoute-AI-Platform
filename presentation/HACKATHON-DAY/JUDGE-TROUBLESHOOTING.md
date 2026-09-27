# FloodRoute AI Platform — Judge Demo Troubleshooting Guide

**Presenter Rules:**
1. Never panic. The platform has automated fallbacks for every core component.
2. Never pretend simulated data is live. State fallbacks clearly and factually.

---

### 1. Map Tiles Fail to Load
- **SYMPTOM:** Map container appears gray or base tiles render slowly.
- **QUICK FIX:** Switch map layer to **"Topography"** or **"Satellite"** using the layer toggle in the top-right of the map.
- **BACKUP:** The underlying vector grid and marker pins remain fully interactive; zoom in one level to force tile re-render.
- **WHAT TO SAY:** *"The public OpenStreetMap tile server is experiencing latency, but our local geospatial vector overlay and active hazard markers remain completely operational."*

---

### 2. Live Weather API Fails / Times Out
- **SYMPTOM:** Weather card shows spinning loader or fallback indicator.
- **QUICK FIX:** Click the **"Refresh Weather"** button or select a quick-city pill (*"Chennai"*).
- **BACKUP:** The service automatically pulls cached meteorological observation baselines marked with a `[MODEL ESTIMATE]` badge.
- **WHAT TO SAY:** *"External weather API connection timed out; our architecture automatically fell back to cached meteorological observation grids with zero downtime."*

---

### 3. Route Calculation Fails / OSRM Times Out
- **SYMPTOM:** Route planner displays: *"Remote server busy; loaded topological elevation corridors."*
- **QUICK FIX:** Ensure coordinates are set to *Velachery to Chennai Central*.
- **BACKUP:** The client automatically renders geodesic topological elevation polylines comparing the direct path with the elevated bypass.
- **WHAT TO SAY:** *"Public routing server latency triggered our geodesic elevation fallback, calculating alternative corridors from local topological contours."*

---

### 4. AI Assistant / Copilot Fails to Respond
- **SYMPTOM:** Copilot chat displays network error or takes $>3$ seconds.
- **QUICK FIX:** Click one of the pre-built suggestion pills: *"Why is the flood risk elevated?"*.
- **BACKUP:** Client-side rule-based knowledge engine generates structured hydrological reasoning.
- **WHAT TO SAY:** *"The Python AI microservice is disconnected; the system seamlessly served a deterministic hydrological advisory from our built-in rule base."*

---

### 5. Database Temporarily Locked / Fails
- **SYMPTOM:** Reports or alerts table fails to load.
- **QUICK FIX:** Refresh the page (`Ctrl + R`). SQLite WAL mode automatically recovers read locks.
- **BACKUP:** In-memory fallback dataset renders all primary demonstration items.
- **WHAT TO SAY:** *"Database read locks triggered in-memory cache delivery, keeping citizen-facing emergency views responsive."*

---

### 6. Emergency Resource Data Fails
- **SYMPTOM:** Emergency resource list appears empty.
- **QUICK FIX:** Click the category filter pill (e.g. *"HOSPITAL"* or *"SHELTER"*).
- **BACKUP:** The permanent 112 emergency dialer and national helpline cards remain visible.
- **WHAT TO SAY:** *"Local resource queries are refreshing; our primary life-safety dialer (112) is permanently active."*

---

### 7. Venue Wi-Fi Drops / Extremely Slow Network
- **SYMPTOM:** All external network requests stall or fail.
- **QUICK FIX:** Click the bright amber **"Demo Mode"** button in the header (or press `Ctrl + Shift + D`).
- **BACKUP:** Entire platform runs 100% offline using deterministic, verified scenario data for Velachery Basin, Chennai.
- **WHAT TO SAY:** *"We have activated our offline Demo Mode, which runs entirely from local cache without needing an active internet connection."*

---

### 8. Missing API Keys
- **SYMPTOM:** Open-Meteo or Nominatim prompts for key.
- **QUICK FIX:** FloodRoute AI uses open, keyless endpoints (`api.open-meteo.com` and `nominatim.openstreetmap.org`) by default.
- **BACKUP:** Zero external API keys are required for judging.
- **WHAT TO SAY:** *"Our platform is built strictly on open data protocols; zero proprietary API keys are needed to evaluate the system."*

---

### 9. Authentication Fails on Admin Console
- **SYMPTOM:** Admin login at Port 5174 rejects credentials.
- **QUICK FIX:** Enter verified demo credentials: `admin@floodroute.ai` / `Admin@123456` (or click *"Quick Demo Admin"*).
- **BACKUP:** The citizen web application at Port 8080 requires zero authentication and demonstrates the complete user journey.
- **WHAT TO SAY:** *"Public citizen tools require zero login; administrative controls use role-based token authentication."*
