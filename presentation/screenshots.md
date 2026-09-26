# FloodRoute AI — Hackathon Screenshot & Visual Evidence Catalog

> Checklist of key application views, actual captured assets, corresponding local URLs, and key visual elements to highlight during judge demonstrations.

---

## Active Visual Evidence Assets in Repository

The repository contains real high-resolution operational captures located in [`docs/images/`](../docs/images/):

1. **`docs/images/gis_live_map.jpg`**: Live GIS Navigation Deck showing full India spatial map canvas, real-time flood report markers, official alert flags, emergency facilities, dynamic inundation heatmap, and bottom inspection drawer.
2. **`docs/images/command_center.jpg`**: Incident Command Room showing multi-screen operations console, live CCTV verification queue, and automated AI vision inferences.

---

## Complete 13-Screenshot Demonstration Checklist

| # | View Name | Application URL | Key Visual Elements to Capture | Status in App |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Homepage / Hero** | `http://localhost:8080/` | • Clean, high-contrast dark hero header<br/>• "Travel Safely During Floods" title<br/>• 56px+ search bar with MapPin icon<br/>• Primary action buttons: Open Map, Find Safe Route, Emergency Help | ✅ Ready & Implemented |
| **2** | **Command-Center Dashboard** | `http://localhost:8080/` (Scroll) | • Active India Disaster Intelligence Hub header<br/>• City switcher (Chennai, Mumbai, Delhi, Guwahati, Bengaluru)<br/>• 4-metric grid (Risk Score gauge, Weather 29°C, NDMA Live alert, Shelter)<br/>• Embedded spatial inundation radar preview | ✅ Ready & Implemented |
| **3** | **India Live GIS Map** | `http://localhost:8080/live-map` | • Full-bleed MapLibre GL canvas with India-wide bounds<br/>• Standardized 4-tier legend (LOW, MODERATE, HIGH, SEVERE)<br/>• Dynamic Inundation Heatmap toggle<br/>• Layer toggles (Community reports, NDMA alerts, Shelters) | ✅ Ready & Implemented |
| **4** | **Location Autocomplete Search** | `http://localhost:8080/live-map` | • Search bar active with typed query: *"Velachery"*<br/>• Nominatim autocomplete dropdown showing sub-meter geocoded locations<br/>• Automatic camera flyTo animation on select | ✅ Ready & Implemented |
| **5** | **Flood-Risk Assessment Result** | `http://localhost:8080/live-map` or Modal | • 8-step "Run Flood Risk Analysis" modal<br/>• Animated progress bar (Step 4 of 8)<br/>• **78/100 High Risk** gauge with confidence 94%<br/>• Explainable factor attribution bars (Rain 35%, Elevation 25%, Drainage 20%) | ✅ Ready & Implemented |
| **6** | **Live Weather Radar** | `http://localhost:8080/weather` | • Open-Meteo live telemetry feed<br/>• 34.2 mm/h precipitation rate with storm risk indicator<br/>• 24-hour rainfall projection curve and humidity/wind cards<br/>• Telemetry timestamp and source badge | ✅ Ready & Implemented |
| **7** | **Official Disaster Alerts** | `http://localhost:8080/disaster-alerts` | • Synchronized NDMA / SDMA warning feed<br/>• Color-coded severity banners (RED, ORANGE, YELLOW)<br/>• Affected municipal zone radius and safety instructions<br/>• Direct "View on Map" shortcut | ✅ Ready & Implemented |
| **8** | **Emergency Shelters & SOS** | `http://localhost:8080/emergency-resources` | • Verified high-ground relief centers and hospitals<br/>• Operational status (24/7 open, food & power provisions)<br/>• Distance calculation (1.2 km away)<br/>• One-touch National 112 emergency phone call button | ✅ Ready & Implemented |
| **9** | **Route Planner Inputs** | `http://localhost:8080/route-planner` | • Origin (Chennai Central) and Destination (Velachery Basin)<br/>• Swap button and vehicle toggle (Car, Bike, Walk)<br/>• Interactive map polyline rendering | ✅ Ready & Implemented |
| **10** | **Safe Route Comparison Result** | `http://localhost:8080/route-planner` (Bottom) | • 3 comparative cards: Safest vs Fastest vs Balanced<br/>• **🟢 Elevated Bypass (Safest)**: Lower modeled flood-risk exposure<br/>• Comparative metrics: 19.4 km • 26 min vs 18.0 km • 20 min<br/>• Non-statutory AI estimate disclaimer banner | ✅ Ready & Implemented |
| **11** | **Context-Aware AI Assistant** | Floating widget on any page | • Floating Copilot modal with query prompt chips<br/>• User prompt: *"Why is the flood risk high?"*<br/>• Detailed AI response breaking down 34.2 mm/h rain, elevation, and drainage | ✅ Ready & Implemented |
| **12** | **Admin Command Center** | `http://localhost:5174/` | • Incident Command Dashboard on port 5174<br/>• Top 6 KPIs: Users, Reports, Alerts, Flood Zones, Road Closures, AI Analyses<br/>• Prominent `[DEMO DATA - SEEDED FOR EVALUATION]` badges<br/>• Incident moderation queue and live CCTV verification | ✅ Ready & Implemented |
| **13** | **National Analytics & Export Hub** | `http://localhost:5174/` & `/districts` | • District-by-district vulnerability distribution bar chart<br/>• Rainfall vs water depth time-series chart<br/>• One-touch export buttons for timestamped **PDF, CSV, Excel (.xls), and JSON** | ✅ Ready & Implemented |

---

## Instructions for Capturing Clean Demo Screenshots

When recording demo videos or capturing still screenshots for hackathon submissions:
1. Open Google Chrome in an Incognito window with browser extensions disabled.
2. Set display zoom to 100% and screen resolution to 1920x1080 (1080p).
3. Ensure dark mode is active for optimal contrast with our dark glassmorphic interface.
4. Capture each screen listed in the checklist above while running local microservices:
   * Citizen Portal: `http://localhost:8080`
   * Admin Operations: `http://localhost:5174`
