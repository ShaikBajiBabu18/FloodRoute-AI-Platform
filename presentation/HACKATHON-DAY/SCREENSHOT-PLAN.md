# FloodRoute AI Platform — Final Screenshot Plan

**Purpose:** Exact guide for capturing the 11 real application screenshots on presentation day.

---

### Screenshot 1: Command Center Dashboard
- **URL:** `http://localhost:8080/`
- **What should be visible:**
  - Hero headline: *"Smarter Flood Intelligence. Safer Routes."*
  - Real-time weather and risk summary cards.
  - Interactive map preview card with active hazard indicators.
  - Quick action buttons (*"Live Map"*, *"Plan Route"*, *"Report Hazard"*, *"Emergency Services"*).

### Screenshot 2: India-Wide GIS Map Deck
- **URL:** `http://localhost:8080/live-map`
- **What should be visible:**
  - Full-screen Leaflet canvas centered on the Indian subcontinent.
  - Layer switcher controls (Street, Satellite, Topography).
  - Active color-coded hazard markers across major Indian metropolitan basins.

### Screenshot 3: Municipal Location Search & Autocomplete
- **URL:** `http://localhost:8080/live-map`
- **What should be visible:**
  - Search input box with query text *"Patna"* or *"Chennai"*.
  - Suggestion dropdown with Nominatim geocoded results.
  - Pinned camera marker centered over the selected municipal coordinates.

### Screenshot 4: Flood-Risk Result Gauge
- **URL:** `/weather` or map telemetry drawer
- **What should be visible:**
  - 0–100 risk score gauge (e.g., `93/100 CRITICAL` or `45/100 MODERATE`).
  - Severity badge and freshness timestamp.
  - Disclaimer: *"Model-estimated flood risk — advisory guidance only."*

### Screenshot 5: Risk Explanation & Factor Breakdown
- **URL:** `/weather` or Risk Breakdown drawer
- **What should be visible:**
  - Detailed factor-by-factor attribution table.
  - Percentage contribution bars: Rainfall (35%), Elevation (25%), Saturation (20%), Warnings (15%), Reports (5%).
  - Text explanation describing why the score was assigned.

### Screenshot 6: Route Analysis & Safer Bypass Comparison
- **URL:** `http://localhost:8080/route-planner`
- **What should be visible:**
  - Dual route comparison cards (Direct Corridor vs. Elevated Bypass).
  - Elevated bypass highlighted green with badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**.
  - Route polylines drawn on the map circumventing flooded underpasses.

### Screenshot 7: Emergency Services & High-Ground Shelters
- **URL:** `http://localhost:8080/emergency`
- **What should be visible:**
  - Large red `☎ Call 112 (National Emergency)` action button.
  - Filter category tabs: Hospitals, Fire Stations, Police, Relief Shelters.
  - Facility cards with direct contact numbers and quick routing shortcuts.

### Screenshot 8: Context-Aware Conversational AI Assistant (Copilot)
- **URL:** Floating Copilot chat window on any page
- **What should be visible:**
  - Chat thread showing query: *"Why is the flood risk elevated?"*.
  - Assistant response breaking down rainfall rate, basin elevation, and recommending elevated bypasses.

### Screenshot 9: Admin Operations Command Console
- **URL:** `http://localhost:5174/`
- **What should be visible:**
  - Incident triage queue with incoming citizen hazard submissions.
  - Computer vision tags (surface water coverage %, estimated depth, vehicle clearance passability).
  - Action buttons: *Verify Report*, *Reject*, *Broadcast Alert*.

### Screenshot 10: Vulnerability Analytics Deck
- **URL:** `http://localhost:5174/` (Analytics tab)
- **What should be visible:**
  - District risk distribution charts.
  - Rainfall rate vs. reported waterlogging correlation graphs.
  - Microservice health and diagnostic telemetry panel.

### Screenshot 11: Responsive Mobile View (< 768px Viewport)
- **URL:** `http://localhost:8080/` (Narrow mobile emulation)
- **What should be visible:**
  - Fixed bottom navigation bar with icons for *Map*, *Route*, *Weather*, *Alerts*, and *Report*.
  - Clean, responsive touch targets $\ge 48\text{px}$ and uncluttered telemetry cards.
