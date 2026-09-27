# FloodRoute AI Platform
# FINAL RELEASE

## Build
**PASS (Exit Code 0)** — Strict production build across all workspaces (`@floodroute/shared`, `@floodroute/server`, `apps/web`, `apps/admin`). Assets bundled into `dist/`.

## Tests
**PASS (Exit Code 0)** — 14 of 14 automated tests passing across 5 test suites (`routing.test.ts`, `api.test.ts`, `auth.test.ts`, `reports.test.ts`, `riskEngine.test.ts`).

## Demo
**PASS** — Full 12-step live presentation journey verified across Dashboard, GIS Map, Weather Telemetry, Explainable Risk Analysis, Route Comparison, Emergency Services, AI Copilot, and Admin Console.

## Security
**PASS** — Zero secrets, API tokens, passwords, or `.env` files tracked in Git. `.gitignore` strictly protects environment and database files. Stateless JWT authentication with salted `bcryptjs` password hashing and Joi validation schemas.

## Mobile
**PASS** — Verified responsive `<lg` mobile layout with sticky bottom navigation bar (`MobileNav.tsx`) and touch targets $\ge 48\text{px}$.

## GitHub
**VERIFIED** — Remote repository configured at `https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform.git` on branch `main`.

---

## Implemented Features
1. **Interactive GIS Map:** India-wide Leaflet 1.9 canvas with layer toggles (Street, Satellite, Topography) and active hazard markers across all 36 Indian states and union territories.
2. **Location Geocoding:** Suburb and district search powered by OpenStreetMap Nominatim with automated camera flying.
3. **Live Weather Telemetry:** Real-time precipitation rate ($mm/h$), 24h accumulation, hourly forecast, and wind speed from Open-Meteo synced with IMD observation grids.
4. **Explainable Flood-Risk Engine:** Transparent 0–100 deterministic scoring algorithm detailing exact contributing factors (rainfall 35%, elevation depression 25%, soil saturation 20%, official warnings 15%, citizen reports 5%).
5. **Route Decision Support:** Multi-corridor calculation via Open Source Routing Machine (OSRM) recommending elevated bypasses with **"lower modeled flood-risk exposure"**.
6. **Emergency Directory:** Curated directory of relief shelters, fire stations, and apex hospitals with one-tap 112 calling.
7. **Citizen Hazard Crowdsourcing:** Public reporting interface allowing citizens to submit geotagged photos of road waterlogging.
8. **Computer Vision Flood Depth Classifier:** Python FastAPI microservice (Port 8000) using OpenCV heuristics to estimate surface water coverage and vehicle clearance passability.
9. **Incident Command Admin Console:** Operational triage deck (Port 5174) for emergency personnel to verify reports and dispatch disaster alerts.
10. **Conversational AI Copilot:** Context-aware assistant translating live coordinates, rainfall rates, and basin elevation into plain-language pre-travel advice with offline fallbacks.
11. **Predictable Demo Mode:** Instant toggle providing deterministic, reproducible presentation scenarios for Chennai, Mumbai, and Bengaluru.

---

## Known Limitations
- **Topographic Resolution:** 30m SRTM digital elevation data does not resolve sub-meter urban features like flyover ramps or localized curb drainage blockages.
- **Satellite Latency:** Earth observation radar and optical satellite feeds carry a 6–12 hour revisit latency.
- **Public OSRM Rate Limits:** Production deployments require a dedicated self-hosted OSRM container with contraction hierarchies.
- **Crowdsource Verification:** Public incident reports require algorithmic or moderator approval before influencing route penalty weights.

---

## Launch Command
```bash
npm run dev
```

---

## Demo Flow
1. **Dashboard:** Open `http://localhost:8080/` to show real-time weather and disaster overview.
2. **Map & Search:** Click **Live Map**; search *"Patna"* or select *"Chennai (Velachery)"*.
3. **Risk Analysis:** Open Risk Breakdown to show the model-estimated 93/100 CRITICAL score and 5-factor breakdown table.
4. **Route Planner:** In `/route-planner`, calculate Velachery to Chennai Central; show green **Elevated Bypass** with lower modeled flood-risk exposure.
5. **Emergency & Copilot:** Show one-tap 112 calling, relief shelters, and ask Copilot *"Why is the flood risk elevated?"*.
6. **Admin Console:** Switch to Port 5174 to show citizen disaster photo triage and alert dispatching.

---

## Final Commit
- Pushed and verified on GitHub `origin/main`.
