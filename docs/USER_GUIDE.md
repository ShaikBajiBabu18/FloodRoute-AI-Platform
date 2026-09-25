# FloodRoute AI — Public Citizen & First Responder User Guide

## 1. Welcome to FloodRoute AI
**FloodRoute AI** is India’s open disaster-response and flood-resilient navigation platform. It helps you navigate safely during monsoons, find verified emergency shelters, submit community flood reports, and receive official alerts.

---

## 2. Navigating the Interactive GIS Map (`/map`)
1. **Explore Inundated Corridors**:
   - The map uses real-time color coding:
     - 🟢 **Green**: Safe transit corridor.
     - 🟡 **Yellow**: Caution / Ankle-deep standing water.
     - 🟠 **Orange**: High risk / impassable for low-clearance hatchbacks and two-wheelers.
     - 🔴 **Red**: Critical submersion / road closure.
2. **24-Hour Timeline Replay Slider**:
   - Use the scrubber at the bottom center to simulate storm progression from `00:00` to `24:00`.
   - Play/pause the hourly rain curve to see which culverts flood first and when floodwaters subside.
3. **Flood Inundation Heatmap**:
   - In the left sidebar under **Layers**, toggle the **Flood Inundation Heatmap**.
   - Adjust the **Density Opacity** slider to overlay satellite terrain with water accumulation zones.
4. **Inspect Incident Details**:
   - Click on any water wave icon (`🌊`) to open the **AI Explanation Drawer**.
   - View factor contributions (Precipitation, Elevation, River Proximity) and one-click evacuation navigation to the nearest high-ground shelter.

---

## 3. Safe Route Planning (`/route-planner`)
1. **Set Origin & Destination**: Search any Indian landmark, road, or use the **"Use Current Location"** crosshair.
2. **Select Vehicle Type**:
   - `Two-Wheeler / Bike`: Requires $< 15$ cm water depth.
   - `Hatchback / Sedan`: Requires $< 25$ cm water depth.
   - `SUV / Pickup`: Up to $45$ cm clearance.
   - `Emergency Ambulance / High-Axle Truck`: Maximum storm tolerance.
3. **Compare Corridors**:
   - **Fastest Corridor**: Shortest travel time (may pass through submerged underpasses).
   - **Flood-Aware Safe Corridor**: Bypasses active flood polygons and confirmed road blockages.
4. **Turn-by-Turn Guidance**: Audio voice readouts announce upcoming hazards before you reach them.

---

## 4. Submitting a Community Flood Report (`/report`)
1. Tap **"Report Flood"** in the top navigation or bottom dock.
2. Allow GPS capture or click on the map to pin the incident.
3. Select water depth:
   - *Ankle Deep* (~10–15 cm)
   - *Knee Deep* (~30–45 cm)
   - *Waist Deep* (~80–100 cm)
   - *Full Submersion* (> 1.2 m)
4. Attach an on-site photo. The **FastAPI Neural Computer Vision engine** automatically validates water surface reflection and vehicle passability.
5. **Offline Support**:
   - If cellular connectivity is severed, your report is saved safely in the **Offline Queue**.
   - As soon as your device reconnects to network or Wi-Fi, the report auto-syncs.

---

## 5. One-Touch Emergency SOS (`EmergencySosModal`)
- Tap the **RED SOS** icon on the top telemetry bar or press `Ctrl + Shift + S`.
- **Instant Actions**:
  - **Dial 112**: Nationwide Disaster & Emergency Unified Helpline.
  - **Nearest Shelter**: Immediate safe-ground routing with live bed counts.
  - **Flashlight Strobe**: Uses screen or device flash for nighttime rescue visibility.
  - **Share Live GPS**: Generates an encrypted tracking link to message to relatives and rescue boats.

---

## 6. Multilingual & Accessibility Settings
- Switch between **English**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)** using the globe selector.
- Click the speaker icon on any alert to activate screen-reader voice broadcasts.
