# FloodRoute AI — Live Hackathon Demonstration Guide

> **Official Live Presentation Manual**  
> Operational handbook for presenting FloodRoute AI seamlessly in front of technical judges, domain evaluators, and grand finale audiences.

---

## 1. How to Start the Application

### One-Command Unified Startup
From the project root directory:
```bash
# 1. Ensure dependencies and database are initialized
npm install
npm run db:setup --workspace=server

# 2. Launch all microservices concurrently
npm run dev
```

### Services Endpoints Verification
Confirm all four services are active:
* **Citizen Web Portal**: [http://localhost:8080](http://localhost:8080)
* **Incident Command Center**: [http://localhost:5174](http://localhost:5174)
* **Backend API Gateway & Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
* **FastAPI Computer Vision Engine**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 2. How to Enter Demo Mode

FloodRoute AI provides two instant methods to activate Demo Mode:

1. **Floating Demo Control Panel (Bottom-Right)**:
   - Click the prominent **"Start Demo"** button on the bottom control panel docked on any screen.
2. **Hero Section on Homepage**:
   - Click the large gradient **"Start Demo (Run Flood Risk Analysis)"** button in the hero section at `http://localhost:8080`.
3. **Telemetry Ribbon**:
   - Click the animated **"Start Demo"** button in the top navigation status bar.

*Visual Confirmation*: A glowing amber badge displaying `DEMO PRESENTATION MODE` appears at the top of the screen, and the control panel toggles to `DEMO MODE` with step-by-step navigation controls.

---

## 3. Recommended Demo Location

* **Target Location**: **Velachery Basin, Chennai, Tamil Nadu**
* **Coordinates**: `12.9805° N, 80.2195° E`
* **Digital Elevation**: `4.2m MSL` (Saucer-shaped low-lying basin)
* **Drainage Catchment**: Pallikaranai Marshland overflow corridor
* **Why this location?**:
  Velachery is nationally recognized for severe monsoon waterlogging during cyclone events. Its 4.2m elevation relative to surrounding 12m plateaus provides a compelling, realistic ground-truth scenario for demonstrating topographical vulnerability, drainage saturation, and elevated bypass route planning.
* **Configuration Override**:
  You can customize the demo location at any time in `.env`:
  ```ini
  VITE_DEMO_LOCATION_NAME="Kurla West, Mumbai"
  VITE_DEMO_LATITUDE=19.0726
  VITE_DEMO_LONGITUDE=72.8845
  ```

---

## 4. Exact Clicks for the 3-Minute Presentation

Follow this exact click journey during your 3 minutes on stage:

| Timestamp | Screen / URL | Action / Click | What Happens on Screen |
| :---: | :--- | :--- | :--- |
| **0:00** | `localhost:8080/` | Open landing page | High-contrast dark hero appears with crisis stats |
| **0:20** | `localhost:8080/` | Click **"Start Demo"** | Demo Mode launches; Stage 1 opens with Velachery Basin |
| **0:40** | Demo Modal | Click **"Next Stage"** (Weather) | Open-Meteo telemetry loads: 34.2 mm/h rain, 110mm accumulation |
| **1:00** | Demo Modal | Click **"Next Stage"** (Flood Risk) | Large Risk Card appears: 78/100 (HIGH), 94% confidence, 5 factors |
| **1:30** | Demo Modal | Click **"Next Stage"** (Alerts) | NDMA Orange Inundation Alert surfaces with civil defense directives |
| **1:50** | Demo Modal | Click **"Next Stage"** (Emergency) | High-ground shelters appear (Guru Nanak College Camp, Elev 14.5m MSL) |
| **2:10** | Demo Modal | Click **"Next Stage"** (Route Analysis) | Route comparison appears: OMR Elevated Bypass vs Direct Corridor |
| **2:35** | Demo Modal | Click **"Next Stage"** (AI Explanation) | Copilot context loads; click sample question: *"Why is the risk elevated?"* |
| **2:50** | `localhost:5174` | Switch to Admin Tab (Command Center) | Show real-time incident triage and one-click data export |
| **2:58** | Global | Click **"Reset Demo"** | Application instantly returns to clean live state |

---

## 5. What to Say at Each Stage

### Stage 1: The Problem & Demo Location (0:00 – 0:35)
> *"Judges, during intense cloudbursts across India, low-lying city streets become death traps in minutes. In Velachery, Chennai—a basin sitting just 4.2 meters above sea level—water accumulates faster than stormwater channels can discharge. Standard navigation apps blindly route vehicles directly into flooded subways. FloodRoute AI translates live hydrometeorological signals into actionable, life-saving transit intelligence."*

### Stage 2: Weather Ingestion (0:35 – 0:55)
> *"Here in Stage 2, our ingestion pipeline assimilates real-time precipitation radar from Open-Meteo. Notice the localized rainfall rate: 34.2 mm/h with 110 mm antecedent 24-hour rainfall. Rather than presenting static numbers, this telemetry directly feeds our hydrological physics model."*

### Stage 3: Explainable Flood Risk Modeling (0:55 – 1:25)
> *"Stage 3 showcases our Explainable Risk Engine. The calculated score is 78 out of 100—HIGH RISK. Unlike black-box machine learning, every point is accountable: rainfall accounts for 35%, terrain depression adds 25%, municipal canal saturation adds 20%, and river proximity adds 15%. Every output is clearly labeled as a model estimate—transparent and verifiable."*

### Stage 4 & 5: Alerts & High-Ground Shelters (1:25 – 1:55)
> *"Stages 4 and 5 connect atmospheric risk to community survival. We surface official NDMA disaster bulletins alongside verified high-ground emergency shelters—like the Guru Nanak College Camp sitting at 14.5 meters elevation with 450 bed capacity and one-touch 112 calling."*

### Stage 6: Flood-Resilient Routing (1:55 – 2:25)
> *"Here is our core routing innovation: comparing candidate corridors between Velachery and Chennai Central. While standard routing selects the direct path right through a submerged underpass, FloodRoute AI calculates the OMR Elevated Bypass. We explicitly label this corridor as having 'Lower modeled flood-risk exposure', guiding families away from high-hazard choke points."*

### Stage 7: Context-Aware AI Copilot & Wrap-Up (2:25 – 3:00)
> *"Finally, our AI Copilot automatically ingests the active situational context—location, rainfall, risk score, and factor breakdown. In one click, citizens and first responders receive instant answers on why risk is elevated and how to travel safely. FloodRoute AI: Smarter Flood Intelligence. Safer Decisions. Thank you!"*

---

## 6. What to Do if Weather API Fails

* **Automatic Safeguard**: The Express weather service (`server/src/services/weather.service.ts`) features an integrated 3.5-second circuit breaker. If the external Open-Meteo API is unreachable, the system automatically serves pre-compiled seasonal monsoon baseline values.
* **What to Say**:
  > *"Notice our built-in offline resilience: when external satellite radar feeds experience network latency, FloodRoute AI seamlessly transitions to cached hydrological baselines, ensuring emergency guidance is never interrupted."*

---

## 7. What to Do if Routing Fails

* **Automatic Safeguard**: The client router (`apps/web/src/pages/RoutePlannerPage.tsx`) contains automatic topological fallback geometry. If the external OSRM machine encounters network timeouts, the platform immediately constructs the comparative bypass polylines and displays:
  `Local Routing Corridor Active: Loaded topological elevation corridors.`
* **What to Say**:
  > *"Our routing engine incorporates local topological graph caching, computing lower-risk corridors even when remote routing servers are temporarily unreachable."*

---

## 8. What to Do if AI Fails

* **Automatic Safeguard**: `CopilotChat.tsx` includes local contextual intelligence. If the `/api/copilot/chat` endpoint is unreachable or delayed, the local assistant immediately processes inquiries using the in-memory scenario data, generating complete multi-factor explanations and 112 emergency phone links.
* **What to Say**:
  > *"Our neural assistant is designed with client-side edge resilience. Even during complete server disconnection, local situational context answers citizen questions accurately."*

---

## 9. How to Reset the Demo

1. Click the **"Reset Demo"** button on the floating control panel (circular counter-clockwise arrow icon).
2. Or click the reset icon inside the Demo Modal header.
3. *System Action*:
   - Clears `isDemoMode` state and localStorage flag.
   - Resets active step to 0.
   - Clears demo overlays while **preserving all real database records, user profiles, and submitted reports**.

---

## 10. How to Exit Demo Mode

1. Click the **"✕"** close button on the top-right of the Demo Modal.
2. Toggle the data badge on the floating control panel back to `LIVE DATA`.
3. The platform immediately transitions back to live production monitoring with real-time Open-Meteo radar and live OpenStreetMap data feeds.
