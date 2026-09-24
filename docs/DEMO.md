# FloodRoute AI — Demo Walkthrough & Presentation Guide

## 1. Hackathon & Live Presentation Overview

FloodRoute AI comes pre-configured with a comprehensive **Demo Mode** featuring seeded incidents, road conditions, official bulletins, and AI analyses across 10 major disaster hubs in India.

Every seeded record is explicitly stamped: `[DEMO DATA]`

---

## 2. Seeded User & Operator Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Chief Operations Officer (SUPER_ADMIN)** | `admin@floodroute.ai` | `ChangeMe123!` | Full incident command, user management, alert broadcasting |
| **Disaster Risk Analyst (ANALYST)** | `analyst@floodroute.ai` | `ChangeMe123!` | Moderation of reports, reviewing AI vision estimates |
| **Citizen User (CITIZEN)** | `citizen@floodroute.ai` | `Citizen123!` | Submitting reports, route planning, saving watchlist locations |

---

## 3. Step-by-Step Live Demonstration Script

### Act I: The Citizen Experience (`http://localhost:5173`)
1. **Landing Page & System Grid**:
   - Observe the live system status cards showing confirmed connections (Weather Service, Flood Data, Routing, Alert System, Community Reports).
   - Point out that status reflects actual backend diagnostic checks without synthetic simulation.
2. **Interactive Live Map**:
   - Click **Open Live Map**.
   - Inspect the national overview of India.
   - Click on the **Chennai** sector (Velachery / Saidapet).
   - Click the red flood marker to view the incident card:
     * Report ID: `FR-2026-000182`
     * AI Analysis: `Flood Detected (Confidence: 89%)`
     * Road Visibility: `Partially Submerged`
     * Status: `VERIFIED`
   - Toggle layers (Hospitals, Police, Relief Shelters) and examine the standardized color legend.
3. **Flood-Aware Safe Route Planning**:
   - Navigate to **Safe Routes** (`/route-planner`).
   - Select the preset: *Chennai Inundation Corridor* (Velachery to Tidel Park).
   - Click **Calculate Safe Routes**.
   - Show how the explainable scoring engine explains **why** the alternative route is safer:
     * "Avoids confirmed road closure on Velachery 100 Feet Road"
     * "Evades active Adyar River red alert zone"
   - View the calculated GeoJSON route line on the interactive map.
4. **Weather Intelligence**:
   - Navigate to **Weather** (`/weather`).
   - Inspect the 10 parameters (Rainfall rate, feels like, barometric pressure, wind speed, visibility).
   - View the 24-hour rainfall projection and temperature Recharts graphs.
5. **Community Reporting & AI Vision**:
   - Go to **Report Hazard** (`/report-hazard`).
   - Choose *Flooded Road*, select *High Severity*, upload an evidence image, and submit.
   - Point out the instant tracking code generation (`FR-2026-000185`) and pending moderation status.

---

### Act II: Incident Command & Moderation (`http://localhost:5174`)
1. **Admin Login**:
   - Access `http://localhost:5174/login`.
   - Sign in with `admin@floodroute.ai` / `ChangeMe123!`.
2. **Operations Dashboard**:
   - Review live KPIs drawn directly from PostgreSQL / SQLite (Total Reports, Verified, Pending, Active Road Closures).
   - Review the Recharts distributions (Severity, State breakdown, Verification workflow).
3. **Live Operations Map & Rapid Moderation**:
   - Navigate to **Live Operations Map**.
   - Click the pending report from the dispatch queue.
   - Review the automated OpenCV vision estimate.
   - Click **Approve**.
   - Notice the instant WebSocket broadcast update reflecting in real time on the Citizen Web App without page reloads!
4. **Road Closure Management**:
   - Add a road closure in the **Road Conditions** page.
   - Notice how any new routes calculated through that corridor will instantly be diverted by the routing engine.
5. **Audit Logs**:
   - Open **Audit Logs** to view the immutable record of the moderation decision with timestamp and operator identity.
