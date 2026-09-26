# FloodRoute AI — Hackathon Demonstration Guide

> Step-by-step walkthrough instructions for evaluating, demonstrating, and testing the FloodRoute AI platform.

---

## 1. Prerequisites & Services Architecture

FloodRoute AI runs 4 microservices:

| Service | Port | Technology | Purpose |
| :--- | :---: | :--- | :--- |
| **Backend API Gateway** | `5000` | Node.js / Express / TypeScript / Prisma | Core business logic, risk engine, proxy |
| **Citizen Web Portal** | `8080` | Vite / React 18 / Tailwind / MapLibre | Public portal for safe routing and map |
| **Admin Command Center** | `5174` | Vite / React 18 / Tailwind / Lucide | Incident management & emergency triage |
| **AI Vision Service** | `8000` | Python / FastAPI / OpenCV / PyTorch | Water segmentation & depth estimation |

---

## 2. Quickstart Execution

### 2.1. Automatic Unified Start
From the project root directory:
```bash
# 1. Install dependencies
npm install

# 2. Setup SQLite database and seed demo data
npm run db:setup --workspace=server

# 3. Launch all services concurrently
npm run dev
```

### 2.2. Verifying Service Health
- **Backend API**: Open [http://localhost:5000/api/health](http://localhost:5000/api/health) — expect `{"status": "ok", "database": "connected"}`
- **Interactive Swagger Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Citizen Portal**: [http://localhost:8080](http://localhost:8080)
- **Admin Command Center**: [http://localhost:5174](http://localhost:5174)
- **FastAPI Vision Engine**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 3. Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@floodroute.ai` | `ChangeMe123!` or `Admin@123456` | Full Incident Command Center triage |
| **Citizen User** | `citizen@floodroute.ai` | `Citizen@123456` | Citizen reports, bookmarks, navigation |

---

## 4. Complete Step-by-Step Demo Flow

Follow this exact flow during hackathon judging:

### Step 1: Landing Page (0:00 – 0:30)
1. Open [http://localhost:8080](http://localhost:8080).
2. Point out the hero statement: *"Travel Safely During Floods"*.
3. Note the high-contrast stats banner: Live monitored cities, active alerts, verified shelters, and community reports.
4. Click **"View Live Map"** or the prominent primary search bar.

### Step 2: Live GIS Map & City Search (0:30 – 1:00)
1. Navigate to `/live-map`.
2. Notice the instant map rendering with interactive risk heatmap overlays.
3. Click on the quick-city pill **"Chennai"** or **"Mumbai"**.
4. The map smoothly flies to the coordinates, loading localized weather telemetry and high-ground markers.

### Step 3: Run Flood Risk Analysis (1:00 – 1:30)
1. Click the **"Run Flood Risk Analysis"** button in the location card.
2. Watch the modal step through the 8-stage hydrological pipeline:
   - *Querying Open-Meteo precipitation* $\to$ *Sampling DEM contours* $\to$ *Analyzing stormwater runoff* $\to$ *Computing risk score*.
3. Highlight the result:
   - Score: **78/100 (HIGH RISK)**
   - Clear explainable breakdown (Rainfall 35%, Elevation 25%, Drainage 20%, River Proximity 15%, Reports 5%).
   - Actionable advisory: *"Lower modeled flood-risk exposure route recommended"*.

### Step 4: Flood-Aware Route Planner (1:30 – 2:10)
1. Click **"Plan Safe Route"** or navigate to `/route-planner`.
2. Select sample coordinates (e.g. Origin: **Velachery**, Destination: **Chennai Central**).
3. Click **"Find Safe Route"**.
4. Observe the comparison view:
   - **Direct Route (High Inundation Risk)**: Red/Orange line traversing flood basins.
   - **Recommended Safe Route (Lower Risk Exposure)**: Cyan/Green line taking elevated bypass flyovers.
5. Highlight turn-by-turn flood warnings on hazardous segments.

### Step 5: High-Ground Shelters & Emergency Services (2:10 – 2:35)
1. Click **"Emergency Services"** in the top navigation or bottom drawer.
2. Filter by **"Relief Shelters"**, **"NDRF Camps"**, or **"Hospitals"**.
3. Point out verified attributes: capacity, distance, contact number, and direct routing shortcut.
4. Show the emergency quick-dial banner for **National Helpline 112**.

### Step 6: Citizen Reporting & Vision Analysis (2:35 – 2:50)
1. Navigate to `/report`.
2. Select severity: *Waterlogged (30-60 cm)*.
3. Upload a flood photo or use sample image.
4. Show the FastAPI segmentation result estimating water depth in centimeters.
5. Submit report and observe it instantly appear on the map via real-time WebSocket.

### Step 7: Incident Command Center (Admin) (2:50 – 3:00)
1. Switch to [http://localhost:5174](http://localhost:5174).
2. Login with `admin@floodroute.ai` / `Admin@123456`.
3. Review the high-level metrics: Active incidents, dispatched teams, alert broadcast system.
4. Verify or dismiss crowdsourced citizen reports with one click.

---

## 5. Offline & Backup Resilience
If external internet or Open-Meteo is disrupted during the presentation:
- The system automatically serves built-in cached hydrometeorological fallbacks for 8 Indian cities (Chennai, Mumbai, Delhi, Bengaluru, Hyderabad, Kolkata, Patna, Guwahati).
- The map uses pre-cached Vector Tile fallbacks and OpenStreetMap raster tiles.
- Zero mock servers required; all fallbacks are fully native to the Express server pipeline.
