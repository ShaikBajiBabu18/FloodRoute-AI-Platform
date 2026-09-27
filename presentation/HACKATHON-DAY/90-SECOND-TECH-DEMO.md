# FloodRoute AI Platform — 90-Second Technical Demo

**Timing:** Exactly 90 Seconds  
**Format:** Fast-paced technical walkthrough for judges and evaluators.

---

### [00:00 – 00:10] STEP 1: DASHBOARD
- **ACTION:** Open `http://localhost:8080/`.
- **EXPECTED RESULT:** Main dashboard renders with live weather and flood risk telemetry cards.
- **WHAT TO SAY:** *"Welcome, judges. FloodRoute AI is an AI-powered flood intelligence and route decision-support platform designed for Indian urban monsoons."*

---

### [00:10 – 00:20] STEP 2: NATIONWIDE GIS MAP
- **ACTION:** Click **Live Map** in the top navigation bar.
- **EXPECTED RESULT:** Leaflet GIS canvas renders full map of India with layer controls and active hazard markers.
- **WHAT TO SAY:** *"Here is our interactive GIS map covering all 36 Indian states and union territories with real-time hazard markers."*

---

### [00:20 – 00:30] STEP 3: LOCATION SEARCH
- **ACTION:** Type `Patna` (or click `Chennai`) in the search bar.
- **EXPECTED RESULT:** Map smoothly flies to the coordinates; bottom drawer displays municipal weather telemetry.
- **WHAT TO SAY:** *"Searching a city resolves coordinates via OpenStreetMap Nominatim and immediately pulls local meteorological telemetry."*

---

### [00:30 – 00:45] STEP 4: FLOOD RISK ANALYSIS
- **ACTION:** Click **View Full Risk Analysis** in the bottom drawer.
- **EXPECTED RESULT:** Displays the 0–100 risk score (e.g. 93/100 CRITICAL) and weather forecast cards.
- **WHAT TO SAY:** *"The engine computes a model-estimated flood risk score of 93/100 based on real-time rain intensity and topographic basin elevation."*

---

### [00:45 – 00:55] STEP 5: RISK EXPLANATION
- **ACTION:** Scroll down to the Factor Attribution Breakdown table.
- **EXPECTED RESULT:** Breakdown table displays contribution percentages for Rainfall (35%), Elevation (25%), Saturation (20%), and Reports (5%).
- **WHAT TO SAY:** *"Unlike black-box models, we explain every point: cloudburst rainfall at 42 mm/h and a low 4-meter basin depression."*

---

### [00:55 – 01:05] STEP 6: ROUTE ANALYSIS
- **ACTION:** Click **Plan Route**; calculate route from *Velachery to Chennai Central*.
- **EXPECTED RESULT:** Renders direct path vs. green **Elevated Bypass** with badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**.
- **WHAT TO SAY:** *"The direct route passes flooded underpasses. FloodRoute AI recommends the elevated arterial bypass, giving commuters lower modeled flood-risk exposure."*

---

### [01:05 – 01:15] STEP 7: EMERGENCY SERVICES
- **ACTION:** Click the **Emergency** navigation tab.
- **EXPECTED RESULT:** Displays one-tap 112 dialing and nearest high-ground relief shelters.
- **WHAT TO SAY:** *"Citizens have one-tap access to national emergency 112, apex hospitals, and verified high-ground evacuation shelters."*

---

### [01:15 – 01:25] STEP 8: CONVERSATIONAL AI COPILOT
- **ACTION:** Click floating Copilot chat in bottom-right; click *"Why is the flood risk elevated?"*.
- **EXPECTED RESULT:** Assistant replies in 1 second with plain-language hydrological reasoning.
- **WHAT TO SAY:** *"Our AI Copilot answers natural-language transit questions in real time, advising small vehicles away from canal corridors."*

---

### [01:25 – 01:30] STEP 9: ADMIN & CLOSING
- **ACTION:** Switch to `http://localhost:5174/` (Admin Console).
- **EXPECTED RESULT:** Incident triage queue displays incoming citizen reports and computer vision flood depth tags.
- **WHAT TO SAY:** *"Disaster authorities can triage citizen photos and dispatch alerts. FloodRoute AI turns passive weather into actionable transit safety. Thank you."*
