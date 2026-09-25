# FloodRoute AI — Incident Command Center Operator & Administrator Manual

## 1. Introduction
The **FloodRoute AI Command Center** (running on port `5174`) provides municipal authorities, District Magistrates (DMs), State Disaster Management Authorities (SDMAs), and National Disaster Response Force (NDRF) battalions with real-time operational GIS command capabilities.

---

## 2. Authentication & Access Governance
- Default administrative URL: `http://localhost:5174/login`
- Standard Seed Credentials:
  - **Super Administrator**: `admin@floodroute.ai` / `Admin@123456`
  - **Disaster Moderator**: `moderator@floodroute.ai` / `Moderator@123456`
- All administrative operations record permanent cryptographic signatures in the `AuditLog` table.

---

## 3. Incident Command Modules

### 3.1. Dashboard Overview (`/`)
- **Key Performance Indicators (KPIs)**:
  - Active verified waterlogging incidents
  - Blocked arterial corridors & highway closures
  - Total evacuees accommodated across relief camps
  - AI Vision model accuracy & queue throughput
- **Live Stream Ticker**: Incoming community reports streamed via WebSockets with zero page refresh.

### 3.2. Live Operations Map (`/operations-map`)
- Full-screen high-resolution GIS interface depicting:
  - Red / Amber inundation clusters
  - CWC river gauge stations with flood danger markers
  - Emergency vehicle fleet positions and rescue boat docks
  - Relief shelters with real-time bed capacity meters.

### 3.3. Report Moderation Queue (`/reports`)
1. Operators inspect crowdsourced incident tickets.
2. Each submission displays the citizen's photograph alongside the **FastAPI Computer Vision Neural Analysis**:
   - `Flood Detected`: `YES` / `NO`
   - `Confidence Score`: e.g. `94.2%`
   - `Estimated Clearance`: `SUVs & Trucks Only`
3. Click **"Verify & Publish"** to immediately broadcast the blockage to all navigating citizens.
4. Click **"Adjust Severity"** to elevate localized puddling to a full road blockage.

### 3.4. Road Conditions & Detours (`/road-conditions`)
- Add official closures on highways (e.g. NH-48, OMR, GST Road) due to river breaches or culvert collapse.
- Setting a road to `BLOCKED` automatically instructs the OSRM routing engine to penalize that segment with infinite weight, routing civilian traffic along high-ground diversions.

### 3.5. Official Warning Broadcasts (`/alerts`)
- Issue statutory NDMA / IMD weather warnings with severity levels: `YELLOW`, `AMBER`, `RED`, `EMERGENCY`.
- Draw custom bounding polygons or select target districts. Alerts are pushed instantly via Socket.IO and Web Push notifications.

---

## 4. National Analytics Hub & Timestamped Reporting (`/analytics`)
- In-depth spatial trends, rainfall vs inundation correlations, and sentinel engagement metrics.
- **Export Capabilities**:
  - **CSV**: Raw tabular export with timestamp header (`FloodRoute_AI_Analytics_<timestamp>.csv`).
  - **Excel (.xls)**: Formatted XML spreadsheet with styling (`FloodRoute_AI_Analytics_<timestamp>.xls`).
  - **JSON**: Comprehensive hierarchical summary data (`FloodRoute_AI_Analytics_Summary_<timestamp>.json`).
  - **Printable PDF**: Formatted executive brief suitable for district briefings.

---

## 5. System Health Diagnostics (`/system-health`)
- Live telemetry reading `/api/system/health-deep` every 10 seconds:
  - Gateway process memory & V8 heap allocations
  - PostgreSQL / SQLite database probe latency ($ms$)
  - FastAPI Computer Vision neural microservice connectivity (port `8000`)
  - External weather ingestion pipelines (Open-Meteo, IMD)
  - Historical 99.9%+ Uptime Service Level Agreements (SLAs).
