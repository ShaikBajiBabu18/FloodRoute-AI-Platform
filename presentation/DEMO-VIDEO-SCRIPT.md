# FloodRoute AI Platform — 2-Minute Demo Video Recording Script

**Video Length:** Exactly 2 Minutes (120 Seconds)  
**Strict Standard:** Use only real screens and verified functionality. Clearly identify demonstration data.

---

### [00:00 – 00:10] TITLE SLIDE
- **SCREEN:** Title slide or Dashboard header with the FloodRoute AI logo and tagline.
- **ACTION:** Camera holds steady on the title text: *"FloodRoute AI — Smarter Flood Intelligence. Safer Routes."*
- **VOICEOVER:** *"Welcome to FloodRoute AI — an AI-powered flood-risk decision-support platform designed to help citizens and emergency responders navigate severe urban monsoon flooding."*

---

### [00:10 – 00:25] THE PROBLEM
- **SCREEN:** Split visual between a monsoon rain radar map and a photo/diagram of an inundated urban underpass.
- **ACTION:** Smooth zoom into the flooded low-lying underpass.
- **VOICEOVER:** *"During intense monsoon cloudbursts across India, conventional navigation apps only monitor traffic velocity. A road showing clear green traffic can actually be submerged under three to four feet of water, trapping motorists in low-lying underpasses."*

---

### [00:25 – 00:45] DASHBOARD & LIVE GIS MAP
- **SCREEN:** Browser open at `http://localhost:8080/`. Click **Live Map** in the top navigation bar.
- **ACTION:** Pan across the Leaflet GIS canvas covering India. Toggle between **"Street"** and **"Topography"** layers.
- **VOICEOVER:** *"Here is our interactive GIS map, covering all 36 Indian states and union territories. It integrates live meteorological observations, topographical elevation contours, and verified hazard markers in real time."*

---

### [00:45 – 01:05] LOCATION SEARCH & WEATHER
- **SCREEN:** Search bar at the top of the map.
- **ACTION:** Type `Patna` or click the quick pill `Chennai (Velachery)`. Map smoothly executes a `flyTo` transition to center on the coordinates. Bottom telemetry drawer slides up.
- **VOICEOVER:** *"Searching a location resolves municipal coordinates via OpenStreetMap Nominatim and immediately pulls real-time precipitation, temperature, and wind data from the meteorological observation grid."*

---

### [01:05 – 01:25] FLOOD-RISK ANALYSIS & EXPLANATION
- **SCREEN:** Risk Breakdown modal / Weather view at `/weather`.
- **ACTION:** Cursor highlights the 0–100 risk score gauge (93/100 CRITICAL) and scrolls down to the Factor Attribution Breakdown table.
- **VOICEOVER:** *"Rather than giving an opaque black box, FloodRoute AI calculates an explainable 0 to 100 risk score. For this area, the score is 93/100, attributing points to 42 mm/h rain intensity, a low 4-meter basin depression, and nearby verified citizen reports."*

---

### [01:25 – 01:45] ROUTE INTELLIGENCE & EMERGENCY SERVICES
- **SCREEN:** Route Planner (`/route-planner`) and Emergency Hub (`/emergency`).
- **ACTION:** Calculate route from *Velachery to Chennai Central*. Highlight the green **Elevated Bypass** card with badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**. Switch to Emergency tab and hover over the red `☎ Call 112` button.
- **VOICEOVER:** *"When planning a route, FloodRoute AI flags submerged underpasses on direct corridors and recommends elevated bypasses with lower modeled flood-risk exposure. And our Emergency Hub provides one-tap 112 dialing and verified high-ground relief centers."*

---

### [01:45 – 01:55] CONTEXT-AWARE AI COPILOT
- **SCREEN:** Copilot chat drawer in the bottom-right corner.
- **ACTION:** Click the suggestion pill: *"Why is the flood risk elevated?"*. Copilot response streams in within 1 second.
- **VOICEOVER:** *"Our conversational AI Copilot provides real-time guidance, warning small vehicles against low-clearance canal roads and explaining local basin hydrology."*

---

### [01:55 – 02:00] CLOSING
- **SCREEN:** Full view of the Command Center Dashboard showing the unified platform.
- **ACTION:** Smooth fade out on the project URL and GitHub repository link.
- **VOICEOVER:** *"FloodRoute AI: Turning fragmented flood data into actionable transit decisions. Open, explainable, and built for real-world resilience."*
