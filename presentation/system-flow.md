# FloodRoute AI Platform — System Flow & Execution Lifecycle

**Document Purpose:** Complete end-to-end execution flow documenting the 10 core operational stages and corresponding fallback failure paths.

---

## The 10-Step Core System Flow

```text
[1. User Searches Location]
           │
           ▼
[2. Application Resolves Location via Geocoding]
           │
           ▼
[3. Weather & Environmental Telemetry Retrieved]
           │
           ▼
[4. Flood-Risk Engine Correlates Available Factors]
           │
           ▼
[5. Explainable Risk Result & Score Generated]
           │
           ▼
[6. GIS Map Displays Results & Inundation Polygons]
           │
           ▼
[7. Route Service Queries Candidate Trajectories]
           │
           ▼
[8. Evaluates Modeled Flood-Risk Exposure (Direct vs Bypass)]
           │
           ▼
[9. Emergency Services & Shelters Queried & Displayed]
           │
           ▼
[10. AI Assistant Ingests Context & Explains Risks to User]
```

---

## Detailed Step-by-Step Breakdown & Failure Handling

### Step 1: User Searches for a Location
- **Action:** User types an Indian municipal query (e.g., "Patna", "Chennai", "Kurla, Mumbai") into the search bar.
- **Normal Flow:** Debounced query string ($>2$ characters) is sent to `/api/routes/geocode?q=...`.
- **Failure Path:** If input is blank or $<3$ characters, search suggestions remain collapsed. If offline, the UI surfaces pre-seeded quick-location chips (`Chennai (Velachery)`, `Mumbai (Kurla)`, `Bengaluru (Silk Board)`).

### Step 2: Application Resolves Location
- **Action:** API queries OpenStreetMap Nominatim for forward geocoding.
- **Normal Flow:** Resolves latitude, longitude, display name, district, and state bounding box. Map smoothly executes a `flyTo` transition to center on the target coordinates.
- **Failure Path:** If Nominatim times out ($>5$s) or is rate-limited, system returns cached Indian metro coordinates and displays an informative toast notification.

### Step 3: Weather & Environmental Information is Retrieved
- **Action:** Frontend calls `/api/weather/current?lat=...&lng=...` and `/api/weather/forecast?...`.
- **Normal Flow:** Gateway proxies request to Open-Meteo API (synced with IMD grid) returning real-time precipitation rate ($mm/h$), 24h accumulation, hourly forecast, and wind speed.
- **Failure Path:** If Open-Meteo is unreachable, the weather service falls back to pre-compiled meteorological seasonal baselines with an explicit `[MODEL ESTIMATE]` badge.

### Step 4: Flood-Risk Engine Processes Available Factors
- **Action:** Gateway executes the 5-factor mathematical model for the resolved coordinate:
  $$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
- **Normal Flow:** Computes real-time rain intensity ($R$), 30m SRTM digital elevation depression ($E$), drainage soil saturation index ($D$), active disaster advisories ($A$), and verified nearby citizen reports ($C$).
- **Failure Path:** If any single data feed is missing (e.g., no active citizen reports), that factor defaults to nominal zero or baseline weight, ensuring risk evaluation never crashes.

### Step 5: Risk Result is Generated
- **Action:** Risk score ($0–100$) and qualitative tier (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`) are computed alongside a factor-by-factor score breakdown array.
- **Normal Flow:** Returns JSON payload with `score`, `level`, `reasons`, and `factors` attribution.
- **Failure Path:** If calculation throws an unhandled error, default low-risk advisory is returned with safety disclaimer.

### Step 6: Map Displays the Result
- **Action:** Leaflet GIS canvas renders the risk marker, updates the bottom telemetry drawer, and overlays local hazard pins and river status.
- **Normal Flow:** Dynamic color-coding reflects the risk tier (Green for Low, Yellow for Moderate, Red for Critical).
- **Failure Path:** If vector overlay fails to mount, tabular cards display all critical numerical telemetry without blocking user navigation.

### Step 7: Route Service Calculates Routes
- **Action:** User requests directions from origin to destination coordinates.
- **Normal Flow:** Gateway queries Open Source Routing Machine (OSRM) to generate multiple route geometry polylines with turn-by-turn maneuvers.
- **Failure Path:** If OSRM server is busy or unreachable, local topological elevation geometry algorithm calculates alternative road corridor waypoints.

### Step 8: Application Evaluates Modeled Flood-Risk Exposure
- **Action:** Discretizes route polylines and samples spatial buffers against elevation depressions and waterlogged hazard reports.
- **Normal Flow:** Generates comparison: **Direct Corridor (Fastest)** vs. **Elevated Bypass (Safest)**. Safest option is explicitly badged as **"Lower Modeled Flood-Risk Exposure"**.
- **Failure Path:** The system never claims "100% safe" or "guaranteed safe", strictly preserving ethical safety guidelines.

### Step 9: Emergency Services are Displayed Where Available
- **Action:** Queries `/api/resources` for facilities near the active location or along the route.
- **Normal Flow:** Displays categorized cards for Hospitals, Fire Stations, NDRF liaison outposts, and designated relief shelters with direct 112 dialing and distance.
- **Failure Path:** If no facilities exist in immediate radius, displays district-level helpline numbers and national 112 contact card.

### Step 10: AI Assistant Explains Relevant Information
- **Action:** User interacts with Copilot Chat or clicks an explainability pill (*"Why is risk elevated?"*).
- **Normal Flow:** Copilot ingests location, current rainfall ($mm/h$), elevation ($m$ MSL), and computed route risk score into context and returns plain-language safety recommendations.
- **Failure Path:** If the backend AI service is disconnected, the client-side Copilot engine serves structured, deterministic hydrological advisories.
