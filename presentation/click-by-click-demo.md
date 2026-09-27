# FloodRoute AI — Click-by-Click Live Demonstration Script

> Complete stage execution guide. For every transition, follow the exact action, verify what appears on screen, and deliver the paired speech.

---

### Step 1: Landing Page & Problem Hook

* **SCREEN**: Citizen Web Portal Home (`http://localhost:8080/`)
* **ACTION**: Presenter has the homepage loaded. Point cursor to hero statement.
* **WHAT THE JUDGE SEES**:
  - High-contrast dark interface with title: *"Travel Safely During Floods"*
  - Live system status ribbon at top: `WS: ONLINE`, `ENGINE: ACTIVE`, `LIVE DATA`
  - Prominent search bar with MapPin icon
  - Primary action buttons: *"Start Demo (Run Flood Risk Analysis)"*, *"Open Live Map"*, *"Find Safe Route"*
* **WHAT THE PRESENTER SAYS**:
  > *"Good morning, judges. During intense monsoon rains and flash flooding, citizens face severe uncertainty. People need to quickly know the local weather, estimated flood risk, nearby emergency shelters, and whether their travel route is exposed to waterlogging. Today, that information is fragmented. This is why we built FloodRoute AI."*

---

### Step 2: Launch Demo Mode & Open Live Map

* **SCREEN**: Interactive Live GIS Map (`/live-map`)
* **ACTION**: Click the prominent **"Start Demo"** button on the hero section or top status bar.
* **WHAT THE JUDGE SEES**:
  - Map smoothly pans and centers on the demo location: **Velachery Basin, Chennai**
  - Glowing amber top badge: `DEMO PRESENTATION MODE • Selected: Velachery Basin, Chennai (Elev: 4.2m MSL)`
  - Sub-meter coordinates and 4-tier risk heatmap overlay (Green / Yellow / Orange / Red)
  - Bottom sheet card displaying local weather, flood risk status, and nearest emergency hospital
* **WHAT THE PRESENTER SAYS**:
  > *"Let's open our Live Map in Demo Mode. The platform supports locations across India. Here we focus on Velachery in Chennai—a low-lying saucer basin vulnerable to monsoon inundation. At a glance, the user sees current weather, a 4-tier risk heatmap, active bulletins, and nearby shelters, all presented in simple, accessible language."*

---

### Step 3: Weather Telemetry Ingestion

* **SCREEN**: Demo Flow Stage 2 (Weather Card) / Bottom Sheet
* **ACTION**: Click **"Next Stage"** on the Demo modal or inspect the Weather drawer.
* **WHAT THE JUDGE SEES**:
  - Weather card marked `FORECAST DATA / OPEN-METEO`
  - Precipitation rate: `34.2 mm/h` (Heavy Cloudburst)
  - 24-hour accumulation: `110.5 mm`
  - Temperature `28.5°C`, wind gusts `42 km/h`, humidity `94%`
* **WHAT THE PRESENTER SAYS**:
  > *"Our meteorological pipeline ingests real-time precipitation forecasts from Open-Meteo. In this scenario, Velachery is experiencing 34 mm per hour rainfall with over 110 mm of 24-hour accumulation. Rather than just reporting numbers, this rainfall data directly feeds our hydrological modeling engine."*

---

### Step 4: Explainable Flood Risk Assessment

* **SCREEN**: Demo Flow Stage 3 (Large Flood Risk Card)
* **ACTION**: Click **"Next Stage"** to display the Flood Risk evaluation.
* **WHAT THE JUDGE SEES**:
  - High-contrast card labeled `FLOOD RISK` with `Model-estimated risk` disclaimer
  - Risk Level: `HIGH` (Orange)
  - Risk Score: `78 / 100` | Confidence: `94%`
  - "Why? Multi-Factor Hydrological Attribution":
    - Factor 1: Heavy Cloudburst Rainfall (35% Weight • 85/100)
    - Factor 2: Low Basin Topography (25% Weight • 4.2m MSL • 90/100)
    - Factor 3: Drainage Canal Saturation (20% Weight • 85% Capacity • 75/100)
    - Factor 4: Basin Proximity (15% Weight • 800m to canal • 65/100)
    - Factor 5: Crowdsourced Ground Truth (5% Weight • 3 verified reports)
* **WHAT THE PRESENTER SAYS**:
  > *"Here is our Explainable Risk Engine. The model calculates a flood risk score of 78 out of 100—HIGH risk. Crucially, we explain why: 35% from heavy rainfall, 25% from the low 4.2-meter elevation, and 20% from stormwater channel saturation. We clearly state: this is a model estimate for decision support, not an official government warning."*

---

### Step 5: Active Disaster Warnings & Emergency Shelters

* **SCREEN**: Demo Flow Stage 4 & 5 (Alerts & Emergency Resources)
* **ACTION**: Click **"Next Stage"** through Alerts and High-Ground Shelters.
* **WHAT THE JUDGE SEES**:
  - NDMA/SDMA Inundation Advisory card with affected radius and civil defense guidance
  - Verified relief shelters indexed by elevation:
    - *Guru Nanak College Relief Camp* (1.2 km away, Elevation: 14.5m MSL, Capacity: 450)
    - *Velachery Municipal Health Post* (0.8 km away, Elevation: 9.8m MSL)
  - Direct `Call 112` button and `Safe Route` navigation shortcut
* **WHAT THE PRESENTER SAYS**:
  > *"The platform immediately surfaces contextual disaster advisories alongside verified high-ground relief centers. For example, the Guru Nanak College shelter sits on high ground at 14.5 meters elevation with power and supplies active, with one-touch dialing to India's National 112 helpline."*

---

### Step 6: Flood-Resilient Route Analysis

* **SCREEN**: Route Planner (`/route-planner`)
* **ACTION**: Click **"Next Stage"** to route view or navigate to `/route-planner`.
* **WHAT THE JUDGE SEES**:
  - Origin: *Velachery Basin* | Destination: *Chennai Central*
  - Dual route comparison cards:
    - **🟢 Elevated Bypass (Safest)**: 19.4 km • 26 min • `Lower Modeled Flood-Risk Exposure` via elevated flyover
    - **🔵 Direct Corridor (Fastest)**: 18.0 km • 20 min • `High Water Ingress Hazard` (45 cm water near canal underpass)
  - Interactive map rendering both paths with colored risk segments
  - Clear disclaimer: *"Lower modeled flood-risk exposure rather than guaranteed safe."*
* **WHAT THE PRESENTER SAYS**:
  > *"When a user plans a trip, our routing engine evaluates candidate corridors against the flood-risk surface. Here, the direct route through Mount Road is 6 minutes faster but passes through low-lying submerged underpasses. FloodRoute AI recommends the OMR Elevated Bypass flyover—providing lower modeled flood-risk exposure. We emphasize that this supports transit decisions rather than guaranteeing road safety."*

---

### Step 7: Context-Aware AI Copilot

* **SCREEN**: Copilot Assistant Drawer (Stage 7 / Floating Widget)
* **ACTION**: Click **"Next Stage"** (AI Explanation) or tap inquiry chip: *"Why is the flood risk elevated?"*
* **WHAT THE JUDGE SEES**:
  - Copilot modal with pre-loaded situational context: Location (Velachery), Weather (34 mm/h), Risk (78/100 HIGH), Factors
  - Chat response generated explaining the 34 mm/h rainfall, 4.2m basin elevation, drainage overload, and actionable vehicle travel advice
* **WHAT THE PRESENTER SAYS**:
  > *"Our AI Copilot automatically ingests the active situational context. When a citizen asks 'Why is the flood risk elevated?', the assistant translates the engineering metrics into plain-language guidance, explaining which roads are vulnerable and what precautions to take."*

---

### Step 8: Incident Command Center (Admin)

* **SCREEN**: Authority Command Deck (`http://localhost:5174/`)
* **ACTION**: Switch to the open Admin browser tab at port 5174.
* **WHAT THE JUDGE SEES**:
  - Executive incident management overview with active flood reports, dispatched teams, and alert feed
  - Real-time moderation queue for citizen-submitted hazard reports
  - District vulnerability distribution charts
  - One-click export options: `Export CSV`, `Export Excel (.xls)`, `Export JSON`
* **WHAT THE PRESENTER SAYS**:
  > *"Finally, for disaster authorities and municipal teams, our Incident Command Center offers real-time situational awareness, incident triage, and audit-ready data exports to coordinate emergency dispatch."*

---

### Step 9: Closing & Non-Destructive Reset

* **SCREEN**: Main portal or Presentation slide
* **ACTION**: Click **"Reset Demo"** on the floating control panel.
* **WHAT THE JUDGE SEES**:
  - Platform smoothly returns to clean live monitoring state without removing real database records or user reports
  - Floating badge returns to `LIVE DATA`
* **WHAT THE PRESENTER SAYS**:
  > *"FloodRoute AI brings weather intelligence, flood-risk analysis, emergency mapping and route decision support together in one platform.*
  >
  > ***Smarter Flood Intelligence. Safer Decisions.***
  >
  > *Thank you. We look forward to your questions."*
