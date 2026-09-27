# FloodRoute AI Platform — Route Intelligence Technical Audit

**Implementation Source:** `server/src/routing/routing.service.ts` & `apps/web/src/pages/RoutePlannerPage.tsx`

---

## 1. Routing Provider & Graph Network
- **Routing Engine:** Open Source Routing Machine (OSRM) driving profile.
- **Cartographic Graph:** OpenStreetMap street and highway network covering all 28 states and 8 union territories of India.
- **Protocol:** REST API queries returning route geometry polylines (GeoJSON LineString format), total distance in kilometers, estimated duration in minutes, and turn-by-turn navigation steps.

---

## 2. Flood-Risk Intersection & Scoring Algorithm
- When candidate routes are received from OSRM:
  1. The routing service discretizes the polyline into equidistant waypoints (spaced at ~250m intervals).
  2. Each waypoint coordinate is evaluated against local topographical depression and active citizen waterlogging hazard polygons.
  3. A cumulative risk penalty score is computed for each candidate path.
  4. If a route intersects active critical waterlogging (e.g. submerged underpasses), a high cost penalty is applied to that corridor.

---

## 3. Dual Corridor Route Comparison
- The platform presents two distinct alternatives to the user:
  - **Direct Corridor (Fastest):** Minimum travel time, but passes through low-lying basins and flood-prone arterial underpasses.
  - **Elevated Bypass (Safest):** Slightly longer travel distance, but deflects onto elevated arterial flyovers and ridges.
- **Strict Terminology Standard:**  
  The safer route is consistently badged as **"Lower Modeled Flood-Risk Exposure"**.  
  *The system NEVER claims "guaranteed safe", "100% safe", or "flood-free".*

---

## 4. Missing-Data & Failure Behavior
- If the public OSRM server times out ($>7$s) or is unreachable:
  - The service automatically logs a warning and generates geodesic topological elevation polylines comparing direct paths with elevated bypasses using local vector geometry.
  - An informative toast notifies the user: *"Remote server busy; loaded topological elevation corridors."*
  - The UI remains completely functional and interactive.

---

## 5. Limitations (Honest Disclosure)
- Relies on OpenStreetMap road classifications and public OSRM demo endpoints in local development.
- Does not monitor dynamic traffic police manual barricades in real time unless reported by verified citizen incident submissions.
