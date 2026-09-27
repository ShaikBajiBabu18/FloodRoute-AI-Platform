# FloodRoute AI Platform — Emergency Backup Demo (Zero-Network Mode)

**Purpose:** Fully deterministic, offline presentation flow running on pre-loaded demonstration data. Demonstrates the core product when venue Wi-Fi drops or external APIs time out.

---

## 1. How to Activate Demo Mode

1. Open `http://localhost:8080/` in the browser.
2. In the top navigation header, click the bright amber button: **"Demo Mode"** (or press `Ctrl + Shift + D`).
3. An amber badge will appear across the deck: **`[DEMO MODE ACTIVE • SIMULATED DATA]`**.
4. The system automatically loads the **Velachery Basin, Chennai** scenario.

---

## 2. Walkthrough Steps (All Clearly Labeled as DEMO DATA)

### STEP 1: Map & Location Context
- **Display:** GIS canvas automatically centers on Velachery, Chennai (Lat: 12.9805, Lng: 80.2195, Elev: 4.2m MSL).
- **Label:** `[DEMO DATA • ELEVATION 4.2m MSL]`
- **Presenter Line:** *"We are looking at our pre-configured demonstration scenario for Velachery, Chennai, an urban saucer-shaped depression basin."*

### STEP 2: Weather & Flood-Risk Estimate
- **Display:** Weather card displays 42 mm/h heavy cloudburst telemetry. Risk score gauge shows **93/100 (CRITICAL)**.
- **Label:** `[DEMO DATA • MODEL ESTIMATE]`
- **Presenter Line:** *"The explainable engine estimates a critical 93/100 risk score, attributing 35% to rain intensity, 25% to the low 4-meter basin elevation, and 20% to drainage saturation."*

### STEP 3: Route Concept (Lower Modeled Risk Exposure)
- **Display:** Renders route comparison between:
  - *Direct Corridor (Fastest):* Intersects submerged Velachery 100ft road underpass.
  - *Elevated Bypass (Safest):* Deflects via OMR/Kamarajar Salai flyovers with badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**.
- **Label:** `[DEMO DATA • ROUTE COMPARISON]`
- **Presenter Line:** *"Notice the routing logic: rather than guiding commuters through the flooded underpass, it selects the elevated bypass with lower modeled flood-risk exposure."*

### STEP 4: Emergency Services & Shelters
- **Display:** Displays nearest high-ground relief centers (e.g. Velachery Higher Secondary School Shelter, Elev: 9.5m MSL) and direct 112 dialing.
- **Label:** `[DEMO DATA • VERIFIED SHELTERS]`
- **Presenter Line:** *"Citizens immediately see nearest high-ground shelters indexed by elevation above sea level."*

### STEP 5: AI Copilot Contextual Response
- **Display:** Copilot chat opens pre-loaded with scenario telemetry. Click *"Why is the risk elevated?"*.
- **Response:** Copilot provides structured advice explaining the rainfall intensity and recommending avoidance of low-clearance canal roads.
- **Presenter Line:** *"The conversational Copilot provides immediate, plain-language guidance based on the active scenario."*
