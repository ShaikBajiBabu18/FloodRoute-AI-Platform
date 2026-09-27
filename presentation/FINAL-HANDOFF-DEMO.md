# FloodRoute AI Platform — Final 3-Minute Handoff Demo Script

**Total Duration:** Exactly 180 Seconds (3 Minutes)  
**Standard:** Every action and screen reflects verified capabilities running in the codebase.

---

### [00:00 – 00:20] 1. THE PROBLEM
- **TIMESTAMP:** 00:00 – 00:20
- **SCREEN:** Command Center Dashboard (`http://localhost:8080/`)
- **ACTION:** Presenter opens browser to root URL; gestures to the dashboard hero and active disaster telemetry cards.
- **WHAT TO SAY:** *"Judges, during intense monsoon downpours across India, citizens face life-critical transit decisions: Where is flood risk escalating? Which roads are passable? Mainstream navigation apps only monitor traffic velocity; an empty road can actually be submerged under three to four feet of floodwater in low-lying underpasses, trapping motorists and stalling emergency ambulances."*
- **EXPECTED RESULT:** High-contrast dashboard renders with live weather metrics, disaster warning highlights, and an interactive GIS preview card.

---

### [00:20 – 00:45] 2. THE SOLUTION
- **TIMESTAMP:** 00:20 – 00:45
- **SCREEN:** Dashboard Telemetry Overview (`http://localhost:8080/`)
- **ACTION:** Scroll smoothly down to the feature shortcuts (*"Live Map"*, *"Plan Route"*, *"Report Hazard"*, *"Emergency Services"*).
- **WHAT TO SAY:** *"Introducing FloodRoute AI — an AI-powered flood-risk decision-support platform designed for climate resilience. It bridges the dangerous gap between atmospheric weather telemetry, 30-meter digital elevation models, and vehicular routing, calculating transparent risk scores and recommending routes with lower modeled flood-risk exposure."*
- **EXPECTED RESULT:** Clean telemetry grid displays real-time precipitation, risk level gauges, and active alert summaries.

---

### [00:45 – 01:15] 3. LIVE GIS MAP & DEMO LOCATION
- **TIMESTAMP:** 00:45 – 01:15
- **SCREEN:** Interactive GIS Deck (`/live-map`)
- **ACTION:** Click **Live Map** in the top navbar. In the search box, click the pre-configured quick pill **"Chennai (Velachery)"** (or type `Patna`).
- **WHAT TO SAY:** *"Here is our interactive GIS map covering all 36 Indian states and union territories. When I select our demonstration location—Velachery Basin, Chennai—the system geocodes the coordinates via OpenStreetMap Nominatim, executes a smooth camera fly-to, and overlays active hazard pins, relief shelters, and live weather sensors."*
- **EXPECTED RESULT:** Leaflet GIS canvas centers over Velachery (`12.9805, 80.2195`); bottom slide-up drawer displays local weather and hazard pins.

---

### [01:15 – 01:45] 4. EXPLAINABLE FLOOD RISK ANALYSIS
- **TIMESTAMP:** 01:15 – 01:45
- **SCREEN:** Risk Breakdown Drawer / Weather View (`/weather`)
- **ACTION:** Click **View Full Risk Analysis** in the bottom drawer; scroll to the Factor Attribution Breakdown table.
- **WHAT TO SAY:** *"Rather than an uninterpretable black box, FloodRoute AI calculates a model-estimated flood risk score of 93/100 (CRITICAL) and transparently explains why: real-time rainfall exceeding 40 mm/h, a digital elevation model showing this location sits in a low-lying 4-meter saucer depression, and active verified citizen hazard reports nearby."*
- **EXPECTED RESULT:** 0–100 circular risk gauge displays `93/100 CRITICAL` with breakdown attributing points to rain intensity (35%), elevation depression (25%), soil saturation (20%), and citizen reports (5%).

---

### [01:45 – 02:15] 5. ROUTE ANALYSIS & EMERGENCY SERVICES
- **TIMESTAMP:** 01:45 – 02:15
- **SCREEN:** Route Planner (`/route-planner`) & Emergency Portal (`/emergency`)
- **ACTION:** In `/route-planner`, click **Calculate Route** from Velachery to Chennai Central. Then click the **Emergency** navigation tab.
- **WHAT TO SAY:** *"When we calculate a route to Chennai Central, the platform compares the corridors: The direct route is two minutes shorter, but passes directly through low-lying underpasses with severe submergence hazards. FloodRoute AI recommends the Elevated Bypass, guiding commuters along higher ground with lower modeled flood-risk exposure. And our Emergency Hub provides one-tap 112 calling and verified high-ground relief shelters."*
- **EXPECTED RESULT:** Map renders two distinct polylines; the elevated bypass is highlighted green with the badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**. Emergency page displays large red `☎ Call 112` button and shelter cards.

---

### [02:15 – 02:35] 6. CONTEXT-AWARE AI ASSISTANT (Copilot)
- **TIMESTAMP:** 02:15 – 02:35
- **SCREEN:** Copilot Chat Drawer (Floating bottom-right button)
- **ACTION:** Click the floating Copilot icon; click the quick suggestion pill: *"Why is the flood risk elevated?"*.
- **WHAT TO SAY:** *"For citizens who need personalized guidance, our AI Copilot is embedded right into the platform. When I ask why the risk is elevated, the assistant analyzes the active weather and elevation context in real time, explaining the rainfall rate and warning small hatchbacks and two-wheelers against low-clearance canal roads."*
- **EXPECTED RESULT:** Chat drawer opens; response streams in within 1 second explaining rainfall intensity, 4.2m MSL elevation, and pre-travel checks.

---

### [02:35 – 02:50] 7. ADMIN INCIDENT COMMAND CONSOLE
- **TIMESTAMP:** 02:35 – 02:50
- **SCREEN:** Admin Operations Portal (`http://localhost:5174/`)
- **ACTION:** Switch browser tab to Port 5174; scroll down the incident triage table.
- **WHAT TO SAY:** *"Behind the citizen app, disaster management authorities have an Admin Command Console. Responders can review citizen-submitted disaster photos analyzed by our computer vision microservice for water coverage percentage, verify incidents with one click, and dispatch geo-targeted alerts."*
- **EXPECTED RESULT:** Administrative deck displays live incident queue, OpenCV water coverage tags, vehicle passability classifications, and alert dispatch tools.

---

### [02:50 – 03:00] 8. CLOSING & ETHICAL BOUNDARIES
- **TIMESTAMP:** 02:50 – 03:00
- **SCREEN:** Main Dashboard (`http://localhost:8080/`)
- **ACTION:** Return to Citizen Dashboard; gesture to the platform disclaimer.
- **WHAT TO SAY:** *"FloodRoute AI provides decision-support estimates to turn passive weather data into actionable transit decisions. While it cannot predict every localized drainage blockage, it provides transparent, life-saving intelligence when every minute counts. Thank you, judges. We are ready for your questions."*
- **EXPECTED RESULT:** Clean dashboard view with disclaimer clearly visible: *"Model-estimated flood risk — advisory guidance only."*
