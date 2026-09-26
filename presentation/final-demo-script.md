# FloodRoute AI — 3-Minute Hackathon Final Demo Script

> **Target Duration**: Exactly 3 minutes (180 seconds)  
> **Presenter Persona**: Confident, articulate, engineering-led disaster tech presenter  
> **Core Mandate**: Keep remarks crisp, follow exact timeline markers, and highlight "Lower modeled flood-risk exposure".

---

## Stage Timeline & Screen Progression

| Exact Timestamp | Stage Phase | Active Screen / URL | Core Focus |
| :---: | :--- | :--- | :--- |
| **0:00** | The Crisis & Hook | Title / Problem Intro | Commuters trapped in sudden urban flash floods. |
| **0:20** | Introduce FloodRoute AI | Landing Page (`localhost:8080`) | National AI-powered flood intelligence platform. |
| **0:40** | Live GIS Map & Quick Cities | Live Map (`/live-map`) | Pan/zoom India map, select Chennai/Mumbai. |
| **1:00** | Real-Time Weather Intelligence | Weather Drawer / Card | Live Open-Meteo rain rate, 24h accumulation. |
| **1:30** | Explainable AI Risk Analysis | Risk Analysis Modal | 8-step pipeline, 78/100 score, factor attribution. |
| **1:50** | Active Disaster Alerts | Alerts Panel | Multi-tier NDMA/IMD flash flood warnings. |
| **2:05** | High-Ground Emergency Shelters | Emergency Drawer | Verified relief camps, capacity, and direct navigation. |
| **2:30** | Flood-Resilient Route Planner | Route Planner (`/route-planner`) | Compare direct route vs lower modeled risk corridor. |
| **2:45** | Citizen Reporting & Vision Analysis | Report Incident (`/report`) | Crowdsourced waterlogging report & AI photo depth. |
| **2:55** | Closing & Call to Action | Command Deck / Hero | Final wrap-up: *"Smarter Flood Intelligence. Safer Decisions."* |

---

## Detailed Step-by-Step Script with Exact Timestamp Marks

### 0:00 — The Crisis & Hook (20s)
**[Presenter Action]**: Stand centered, project voice clearly.  
**[Presenter Speaks]**:
> *"Good morning, judges. During extreme monsoon cloudbursts across India, urban streets turn into rivers within minutes. Commuters drive unknowingly into submerged underpasses, ambulances get stuck in dead ends, and families are left without safe evacuation guidance.
> Standard weather apps tell you how much rain is falling, but they cannot tell you if your street is passable or where to find safe high ground."*

---

### 0:20 — Introduce FloodRoute AI (20s)
**[Presenter Action]**: Open browser to `http://localhost:8080`.  
**[Presenter Speaks]**:
> *"To solve this life-critical gap, we built **FloodRoute AI**—an AI-powered flood intelligence and route decision-support platform that combines weather data, location intelligence, flood-risk analysis, emergency services and route analysis in one interactive platform.
> Designed for high accessibility and low cognitive load during crises, anyone from a child to a senior citizen can navigate to safety in seconds."*

---

### 0:40 — Live GIS Map & Quick Cities (20s)
**[Presenter Action]**: Click **"Live Map"** in top navbar; click quick-city pill **"Chennai"**.  
**[Presenter Speaks]**:
> *"Navigating to our Live GIS Map, the platform immediately renders interactive flood risk layers across India. With a single tap on Chennai, the camera smoothly pans to the Velachery basin.
> Notice the color-coded 4-tier risk heatmap: green for safe passable corridors, yellow for surface runoff, orange for high waterlogging, and red for impassable submersion."*

---

### 1:00 — Real-Time Weather Intelligence (30s)
**[Presenter Action]**: Expand the Weather Intelligence panel on the right sidebar.  
**[Presenter Speaks]**:
> *"Our hydrometeorological engine ingests real-time telemetry from Open-Meteo.
> Here in Velachery, we observe a torrential rain intensity of 42 mm/h with 110 mm antecedent 24-hour accumulation.
> Rather than just presenting numbers, FloodRoute AI feeds this live precipitation directly into our spatial elevation and drainage saturation models."*

---

### 1:30 — Explainable AI Risk Analysis (20s)
**[Presenter Action]**: Click **"Run Flood Risk Analysis"**; let the animated 8-step pipeline calculate.  
**[Presenter Speaks]**:
> *"Clicking 'Run Flood Risk Analysis' executes our explainable multi-variable risk algorithm in real time.
> The result: **78 out of 100 — HIGH RISK**.
> Unlike black-box AI, we provide full transparency: Rainfall accounts for 35%, low topographical elevation contributes 25%, municipal drainage overload adds 20%, and river canal proximity adds 15%."*

---

### 1:50 — Active Disaster Alerts (15s)
**[Presenter Action]**: Click the **"Active Alerts"** badge.  
**[Presenter Speaks]**:
> *"The platform immediately surfaces contextual warnings: an active Red Inundation Alert for low-lying Velachery and Pallikaranai marshlands, with clear civil defense guidance to avoid pedestrian underpasses."*

---

### 2:05 — High-Ground Emergency Shelters (25s)
**[Presenter Action]**: Click **"Emergency Services"** in the top navbar or map overlay.  
**[Presenter Speaks]**:
> *"When water rises, citizens need immediate refuge. FloodRoute AI displays verified high-ground relief centers, NDRF staging camps, and operational hospitals.
> Each shelter lists verified bed capacity, elevation above mean sea level, emergency contact numbers, and a one-touch navigation button to find the safest path there."*

---

### 2:30 — Flood-Resilient Route Planner (15s)
**[Presenter Action]**: Switch to `/route-planner`, click **"Find Safe Route"** between Velachery and Chennai Central.  
**[Presenter Speaks]**:
> *"Now the core innovation: our flood-aware routing engine.
> While a standard navigation app sends you along the direct path right through the submerged basin, FloodRoute AI computes an alternative corridor taking elevated flyovers.
> It delivers a **lower modeled flood-risk exposure route**, keeping vehicles clear of impassable water."*

---

### 2:45 — Citizen Reporting & Vision Analysis (10s)
**[Presenter Action]**: Show `/report` screen with water photo and AI contour depth detection.  
**[Presenter Speaks]**:
> *"On the ground, citizens can report flooded roads in two taps. Our FastAPI computer vision engine analyzes the photo to estimate water depth, immediately broadcasting the hazard to the community."*

---

### 2:55 — Closing & Call to Action (5s)
**[Presenter Action]**: Show concluding slide or Command Center dashboard.  
**[Presenter Speaks]**:
> *"FloodRoute AI: Smarter Flood Intelligence. Safer Decisions. Saving lives across India. Thank you!"*
