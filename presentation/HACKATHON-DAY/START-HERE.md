# FloodRoute AI Platform — Judge Start Page

**Document Purpose:** The first document for hackathon judges and evaluators to read before reviewing or testing the platform.

---

## What It Is
FloodRoute AI is an AI-powered flood-risk decision-support platform designed to help citizens, emergency services, and urban planners navigate severe monsoon flooding in Indian metropolitan areas. By synthesizing real-time meteorological observations, digital elevation models, verified road hazard reports, and topological routing graphs, it calculates transparent flood-risk scores and recommends transit corridors with **lower modeled flood-risk exposure**.

---

## What Problem It Solves
Traditional navigation platforms (such as Google Maps or Waze) optimize almost exclusively for traffic speed and vehicle velocity. During intense monsoon cloudbursts, a road showing clear green traffic can actually be submerged under three to four feet of floodwater in low-lying underpasses. This causes stalled engines, trapped vehicles, blocked emergency ambulances, and stranded commuters. FloodRoute AI solves the dangerous visibility gap between atmospheric weather telemetry, road elevation topography, and vehicle routing.

---

## 30-Second Spoken Explanation
> "Judges, standard mapping apps only look at traffic speed. During a monsoon cloudburst, an empty road can be flooded under three feet of water. We built FloodRoute AI to bridge weather telemetry and navigation. On our interactive GIS map, citizens can search any Indian city, view an explainable 0 to 100 flood-risk score based on rain intensity and ground elevation, and receive route alternatives that prioritize elevated bypasses with lower modeled flood-risk exposure. With one-tap 112 calling and context-aware AI assistance, it turns passive weather forecasts into life-saving transit decisions."

---

## How To Run (Verified Command)
From the project root directory, launch all 4 microservices concurrently:
```bash
npm run dev
```
- **Citizen Portal (Main UI):** [http://localhost:8080](http://localhost:8080)
- **Incident Command Console (Admin):** [http://localhost:5174](http://localhost:5174)
- **API Swagger Documentation:** [http://localhost:5000/docs](http://localhost:5000/docs)
- **AI Microservice Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Recommended Demo Flow
1. **Open Dashboard:** Visit `http://localhost:8080/` to view the disaster overview and active telemetry cards.
2. **Search Demo Location:** Click **Live Map** and search *"Patna"* or click *"Chennai (Velachery)"*.
3. **Analyze Flood Risk:** Open the Risk Analysis panel to view the calculated 0–100 score.
4. **View Explanation:** Inspect the transparent 5-factor breakdown table (rain intensity, basin elevation, etc.).
5. **Compare Route Exposure:** Go to **Route Planner**, calculate directions, and inspect the green **Elevated Bypass** with lower modeled risk.
6. **View Emergency Services:** Open **Emergency** to view nearest relief shelters and one-tap 112 dialing.
7. **Ask AI Assistant:** Open Copilot chat and click *"Why is the flood risk elevated?"*.
8. **Show Analytics/Admin:** Switch to `http://localhost:5174/` to view incident triage and vulnerability charts.

---

## Main Technologies (Actually Implemented)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Leaflet GIS, Framer Motion, Lucide React.
- **Backend Gateway:** Node.js, Express.js, TypeScript, Joi validation, Helmet, Rate Limiter.
- **Database:** SQLite with Prisma ORM (WAL mode enabled; PostgreSQL schema compatible).
- **AI Service:** Python 3.10+, FastAPI, Uvicorn, OpenCV image heuristics.
- **Testing:** Jest, Supertest.

---

## Data Sources (Actual Providers)
- **Live Meteorology:** Open-Meteo API synced with IMD observation grid (**Live Data**).
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API (**Live Data**).
- **Road Network Graph:** Open Source Routing Machine (OSRM) (**Live Data**).
- **Digital Elevation Models (DEM):** NASA SRTM 30m dataset (**Integrated Model**).
- **Disaster Warnings:** Pre-seeded NDMA / IMD emergency advisories (**Explicitly Tagged Demo Data**).

---

## Important Disclaimer
FloodRoute AI provides **model-estimated decision-support guidance** based on available remote sensing, meteorological telemetry, and topological elevation data. It is **not** an official statutory emergency warning system and does not issue legal disaster declarations. Commuters and responders must always treat outputs as advisory guidance and comply with on-ground directives from local police and disaster authorities.

---

## Repository
- **Configured GitHub Repository:** [https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform.git](https://github.com/ShaikBajiBabu18/FloodRoute-AI-Platform.git)
- **Branch:** `main`
