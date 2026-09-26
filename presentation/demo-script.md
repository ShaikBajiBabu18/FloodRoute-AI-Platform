# FloodRoute AI — 3-Minute Live Hackathon Demo Script

> **Target Duration**: Exactly 3 minutes (180 seconds)  
> **Presenter Persona**: Confident, articulate, mission-driven engineering presenter  
> **Key Mantra**: Keep explanations concise, point directly to active screen features, and never claim guaranteed safety.

---

## Timing & Stage Direction Overview

| Timestamp | Phase / Section | Screen to Display | Core Message |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:20** | The Problem | Title Slide / News Headlines | Monsoon inundation traps commuters; static alerts lack route context. |
| **0:20 – 0:45** | Introduce FloodRoute AI | Landing Page (`localhost:8080`) | National AI emergency platform turning weather into transit decisions. |
| **0:45 – 1:20** | Location Search & Live Map | Live Map (`/live-map`) | Search Velachery, pan/zoom, demonstrate 4-tier risk legend & heatmap. |
| **1:20 – 1:50** | Weather & Flood-Risk Analysis | "Run Flood Risk Analysis" Modal | 8-step pipeline, 78/100 risk score, explainable factor attribution. |
| **1:50 – 2:20** | Route Planning & Exposure Analysis | Route Planner (`/route-planner`) | Compare Fastest vs Safest Elevated Bypass with lower risk exposure. |
| **2:20 – 2:40** | Emergency Services & Alerts | Emergency Services / Bottom Sheet | High-ground shelters, NDMA alerts, and one-touch 112 calling. |
| **2:40 – 2:55** | Context-Aware AI Copilot | Copilot Widget (`bottom-right`) | Ask "Why is the flood risk high?", show live factor explanation. |
| **2:55 – 3:00** | Impact & Closing | Slide 12 / Hero Screen | "Smarter Flood Intelligence. Safer Decisions." |

---

## Word-for-Word Demo Script

### 0:00 – 0:20 | The Problem (20 Seconds)
**[Presenter Speaks]**:
> *"Good morning, judges. Every monsoon in India, sudden cloudbursts submerge city roads in minutes. Commuters drive into flooded underpasses without warning, ambulances get stranded, and families cannot locate safe high ground.*
>
> *Traditional weather apps tell you how much rain is falling, but they never tell you if your street is passable or which road will keep your car above water."*

---

### 0:20 – 0:45 | Introducing FloodRoute AI (25 Seconds)
**[Action]**: Display Landing Page at `http://localhost:8080`.
**[Presenter Speaks]**:
> *"This is why we built **FloodRoute AI**—India’s national disaster intelligence and flood-resilient routing platform.*
>
> *We combine live Open-Meteo radar telemetry, digital elevation contours, crowdsourced hazard reports, and official NDMA alerts into a single decision-support platform designed to protect lives during extreme inundation events."*

---

### 0:45 – 1:20 | Location Search & Live Interactive Map (35 Seconds)
**[Action]**: Click **"Open Live Map"** (`/live-map`). In search bar, type `Velachery, Chennai` and press Enter. Click the **Legend** and **Heatmap** toggles.
**[Presenter Speaks]**:
> *"Let’s look at the Live Map. We have full India-wide coverage with sub-meter geocoding.*
>
> *When we search for **Velachery, Chennai**—a known low-lying basin—the map immediately centers and displays active spatial layers.*
>
> *Notice our standardized national flood legend: **Green** for Low Risk, **Yellow** for Moderate, **Orange** for High, and **Red** for Severe waterlogging.*
>
> *With one click, I can toggle the dynamic **Inundation Heatmap**, visualizing surface water accumulation across monitored river corridors."*

---

### 1:20 – 1:50 | Weather & Flood-Risk Analysis (30 Seconds)
**[Action]**: Click **"Run Analysis (Judge Demo)"** button. Advance through steps 2, 4, and 5 of the modal.
**[Presenter Speaks]**:
> *"Now let’s run our end-to-end **Flood Risk Analysis**.*
>
> *In real time, our engine ingests atmospheric radar data—showing 34.2 millimeters per hour of sustained monsoon rainfall.*
>
> *Our multi-variable model computes an AI Flood Risk Score of **78 out of 100—High Risk**.*
>
> *Crucially, this is explainable AI. The platform shows judges exactly why: 35% from rainfall intensity, 25% from the low-lying terrain elevation, and 20% from storm drain saturation. All predictions are transparently labeled as model-derived estimates."*

---

### 1:50 – 2:20 | Route Planning & Flood-Risk Exposure (30 Seconds)
**[Action]**: Navigate to Route Planner (`/route-planner`). Show the 3 route cards.
**[Presenter Speaks]**:
> *"Now, the core transit breakthrough: Safe Route Planning.*
>
> *If a user needs to travel from Chennai Central to Velachery, our engine doesn't just offer the fastest road. It calculates three distinct corridors via OSRM.*
>
> *Here, the Direct Corridor is the fastest at 20 minutes, but carries an acute water ingress hazard through submerged underpasses.*
>
> *Instead, FloodRoute AI recommends the **Elevated Bypass Corridor**—a 26-minute journey using highway flyovers that provides **lower modeled flood-risk exposure** based on terrain elevation. Notice our strict compliance: we never make false claims of 'guaranteed zero flooding'—we empower safer decisions."*

---

### 2:20 – 2:40 | Emergency Services & Alerts (20 Seconds)
**[Action]**: Open the bottom drawer on the map or click **Alerts / Shelters**. Point to Guru Nanak College and the 112 button.
**[Presenter Speaks]**:
> *"For citizens in immediate danger, FloodRoute AI instantly locates the nearest verified high-ground relief centers with electricity, food, and water.*
>
> *Users get one-touch direct dialing to the **National Disaster Helpline 112**, while official statutory NDMA and state flood warnings are continuously synchronized."*

---

### 2:40 – 2:55 | Context-Aware AI Copilot (15 Seconds)
**[Action]**: Click the floating Copilot bubble at the bottom right. Click the chip: *"Why is the flood risk high?"*
**[Presenter Speaks]**:
> *"Users can also consult our AI Copilot.*
>
> *When I ask, 'Why is the flood risk high?', the copilot analyzes the current GPS coordinates and instantly breaks down precipitation levels, river proximity, and road closures in plain language."*

---

### 2:55 – 3:00 | Impact & Closing (5 Seconds)
**[Action]**: Return to the Landing Page hero view.
**[Presenter Speaks]**:
> *"FloodRoute AI: **Smarter Flood Intelligence. Safer Decisions.** Thank you, and we welcome your questions!"*

---

## Backup Demo Checklist for Presenters

* [ ] Ensure all 3 terminals are running (`server` on 5000, `apps/web` on 8080, `apps/admin` on 5174).
* [ ] Open [http://localhost:8080](http://localhost:8080) in Chrome with normal 100% zoom.
* [ ] Have Admin Dashboard open in an adjacent browser tab: [http://localhost:5174](http://localhost:5174).
* [ ] If Wi-Fi is slow, the platform automatically utilizes local SQLite fallback and cached tiles.
* [ ] Remember: strictly state *"Lower modeled flood-risk exposure"* when describing routes.
