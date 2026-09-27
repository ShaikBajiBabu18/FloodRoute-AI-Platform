# FloodRoute AI — Demonstration Screenshot Checklist

**Purpose:** Comprehensive guide detailing the 11 key views to capture from the live running application for hackathon submissions, slide decks, and devpost galleries.

---

### 1. Main Dashboard (`http://localhost:8080/`)
- **Visible Elements:**
  - Hero banner with headline *"Smarter Flood Intelligence. Safer Routes."*
  - Real-time weather and risk telemetry cards.
  - Interactive map preview card with active hazard indicators.
  - Quick-action shortcuts (*"Live Map"*, *"Plan Route"*, *"Report Hazard"*, *"Emergency Services"*).

### 2. India-Wide GIS Map (`/live-map`)
- **Visible Elements:**
  - Full-screen Leaflet canvas centered on the Indian subcontinent.
  - Active color-coded hazard markers (red/yellow caution pins).
  - Floating layer switcher (Street, Satellite, Topography).
  - Bottom expandable location summary card.

### 3. Location Search & Autocomplete
- **Visible Elements:**
  - Search input box in top header with sample text *"Patna"* or *"Chennai"*.
  - Dropdown suggestion menu showing matched Indian municipalities and districts.
  - Camera `flyTo` target marker pinned on the selected city coordinates.

### 4. Flood-Risk Result Card
- **Visible Elements:**
  - Circular or numerical 0–100 risk score gauge (e.g. `93/100 CRITICAL` or `45/100 MODERATE`).
  - Color-coded severity badge (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
  - Advisory disclaimer: *"Model-estimated flood risk — advisory guidance only."*
  - Data freshness timestamp and source attribution badge (`LIVE DATA`).

### 5. Risk Factor Breakdown Table
- **Visible Elements:**
  - Granular factor attribution breakdown table.
  - Contributing factor bars: Rainfall Intensity (35%), Ground Elevation (25%), Soil Saturation (20%), Official Warnings (15%), Crowdsourced Reports (5%).
  - Text description explaining why the score was assigned.

### 6. Route Decision Support (`/route-planner`)
- **Visible Elements:**
  - Dual route comparison cards on the sidebar:
    - *Direct Corridor (Fastest):* Highlighted red/blue with warning about flooded underpasses.
    - *Elevated Bypass (Safest):* Highlighted green with badge **"LOWER MODELED FLOOD-RISK EXPOSURE"**.
  - Polyline routes drawn across the map canvas circumventing hazard buffer zones.

### 7. Emergency Services & High-Ground Shelters (`/emergency`)
- **Visible Elements:**
  - Large red `☎ Call 112 (National Emergency)` action button.
  - Filter category tabs: *Hospitals*, *Fire Stations*, *Police Outposts*, *Relief Shelters*.
  - Facility cards displaying direct contact numbers, capacity, and quick routing shortcuts.

### 8. Conversational AI Assistant (Copilot)
- **Visible Elements:**
  - Floating slide-out Copilot chat drawer in bottom-right corner.
  - Conversation thread with query *"Why is the flood risk elevated?"*.
  - AI response breaking down rainfall rate, basin elevation, and recommending elevated bypasses.
  - Quick suggestion action pills along the bottom.

### 9. Admin Operations Command Console (`http://localhost:5174/`)
- **Visible Elements:**
  - Incident triage queue with incoming citizen hazard submissions.
  - Computer vision analysis tags (water coverage %, estimated depth, vehicle clearance passability).
  - Action buttons: *Verify Report*, *Reject*, *Broadcast Alert*.

### 10. Analytics & Vulnerability Dashboard
- **Visible Elements:**
  - Incident distribution charts across municipal districts.
  - Rainfall rate vs. reported waterlogging correlation graphs.
  - System health and microservice diagnostic telemetry panel.

### 11. Responsive Mobile View (< 768px Viewport)
- **Visible Elements:**
  - Mobile browser emulation view (e.g., iPhone 14 or Pixel 7).
  - Fixed bottom navigation bar with icons for *Map*, *Route*, *Weather*, *Alerts*, and *Report*.
  - Touch-friendly action buttons ($\ge 48\text{px}$) and clear, uncluttered cards.
