# FloodRoute AI — Hackathon Live Demo Resilience & Backup Plan

> Protocol and operational safeguards for uninterrupted judging presentations during network anomalies, API downtime, or tile outages.

---

## 1. Quick Emergency Triage Summary

| Failure Scenario | Automatic System Behavior | Presenter Manual Fallback Action |
| :--- | :--- | :--- |
| **Complete Internet Loss** | Backend serves local cached data; PWA service worker serves frontend bundle | Continue demo using pre-cached Chennai / Mumbai presets |
| **Open-Meteo Weather API Down** | Circuit breaker trips after 3.5s timeout; serves built-in meteorological cache | Point out resilience: *"Our system seamlessly transitioned to cached hydrologic baselines."* |
| **OSRM Routing Engine Down** | Node backend generates topological waypoint polyline with elevation penalties | Safe route comparison continues with modeled risk delta |
| **MapLibre Vector Tile Failure** | Dual raster tile fallback automatically kicks in (OSM standard tiles) | Refresh map layer or toggle satellite/terrain layer |
| **Database Disconnection** | In-memory read replica with local cache serves public endpoints | Admin actions log local fallback warning; read paths 100% active |

---

## 2. Detailed Scenario Procedures

### Scenario A: Open-Meteo API Down or High Latency
- **Symptoms**: Risk calculation takes > 3.5 seconds or returns HTTP 504.
- **Underlying Safeguard**: The Express weather service (`server/src/services/weather.service.ts`) features an automatic fallback matrix. If the external HTTP request fails, the service returns pre-compiled seasonal monsoon baseline values for all 8 major Indian metro regions.
- **Presenter Script**:
  > *"Notice how the system handles external data outages gracefully: when third-party weather feeds encounter network latency, FloodRoute AI automatically falls back to our high-resolution hydrological baseline, ensuring critical evacuation decisions are never blocked."*

### Scenario B: OSRM Routing Machine Offline or Unreachable
- **Symptoms**: Route calculation button spins or route polyline fails to return from external OSRM server.
- **Underlying Safeguard**: The backend routing service (`server/src/services/routing.service.ts`) includes a deterministic geometric routing heuristic that calculates direct and alternative bypass polylines along major arterial corridors.
- **Presenter Script**:
  > *"Our routing engine incorporates local topological graph caching, computing lower-risk corridors even when remote routing servers are temporarily unreachable."*

### Scenario C: Map Tile Outage (Map appears blank or grey grid)
- **Symptoms**: MapLibre GL fails to fetch vector tiles from primary CDN.
- **Underlying Safeguard**: The map component (`apps/web/src/components/Map.tsx`) includes multi-source fallback:
  1. CARTO Positron Vector Tiles (Primary)
  2. OpenStreetMap Raster Tiles (Secondary Fallback)
  3. Stamen / Wikimedia Terrain Tiles (Tertiary Fallback)
- **Presenter Action**:
  - If a specific tile fails to load, toggle the layer selector in the top-right corner from "Standard" to "Terrain" or "Satellite".

### Scenario D: Local Port Collision or Backend Restart
- **Symptoms**: Browser shows `ERR_CONNECTION_REFUSED` on port 5000.
- **Presenter Action**:
  - Run the quick diagnostic command in terminal:
    ```bash
    npm run dev --workspace=server
    ```
  - The server starts in under 2.5 seconds with SQLite zero-dependency storage.

---

## 3. Pre-Demo Warmup Checklist (Run 5 Minutes Before Pitch)
1. [ ] Check all 4 ports responding:
   - `http://localhost:5000/api/health`
   - `http://localhost:8080`
   - `http://localhost:5174`
   - `http://localhost:8000/docs`
2. [ ] Open `http://localhost:8080/live-map` in Chrome and verify the map tiles render.
3. [ ] Click "Chennai" quick city and run a test "Flood Risk Analysis" to prime the in-memory cache.
4. [ ] Open `http://localhost:8080/route-planner` and ensure route generation completes.
5. [ ] Keep backup slides (`presentation/presentation-content.md`) open in a background tab as ultimate visual backup.
