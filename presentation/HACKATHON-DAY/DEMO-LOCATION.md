# FloodRoute AI Platform — Verified Demo Location Profile

**Selected Location:** **Velachery Basin, Chennai, Tamil Nadu**

---

### Location Specifications
- **Name:** Velachery Basin, Chennai
- **State:** Tamil Nadu
- **Coordinates:** `12.9805° N, 80.2195° E`
- **Topographical Elevation:** `4.2 meters` above Mean Sea Level (MSL)
- **Catchment Basin:** Pallikaranai Marshland Catchment Basin
- **Transit Destination:** Chennai Central Railway Station (`13.0827° N, 80.2707° E`)

---

### Why Velachery Was Selected
1. **Proven Urban Vulnerability:** Velachery is a historically prone urban depression basin in southern Chennai that naturally collects runoff from surrounding elevated neighborhoods during monsoon cloudbursts.
2. **Clear Routing Contrast:** The transit corridor between Velachery and Chennai Central provides a distinct contrast between:
   - *Direct Corridor (Fastest):* Passes through low-lying, flood-prone underpasses on Velachery 100ft Road and Saidapet corridor.
   - *Elevated Bypass (Safest):* Deflects via elevated highways and flyovers (OMR / Kamarajar Salai) offering **lower modeled flood-risk exposure**.
3. **Database Pre-Seeding:** Pre-seeded emergency resources (Velachery Police Station, Tamil Nadu Fire & Rescue Guindy, and local relief shelters) are directly mapped to this coordinate pair in SQLite.

---

### Expected Demo Workflows

#### 1. Expected Weather Workflow
- **Live Mode:** Queries Open-Meteo for real-time telemetry at `12.9805, 80.2195`.
- **Demo Mode:** Loads deterministic 42 mm/h cloudburst telemetry, 29°C temperature, and 85% relative humidity labeled as `[DEMO DATA]`.

#### 2. Expected Risk Workflow
- Correlates precipitation rate with the 4.2m MSL saucer-shaped basin elevation and nearby verified hazard reports.
- Computes an elevated/critical risk score (e.g., 93/100) with full factor breakdown attributing points to rain intensity and elevation depression.

#### 3. Expected Route Workflow
- Generates dual routes from Velachery to Chennai Central.
- Compares the shorter direct route against the elevated arterial bypass, badging the bypass as **"LOWER MODELED FLOOD-RISK EXPOSURE"**.

#### 4. Expected Emergency-Service Workflow
- Surfaces the nearest apex facilities: Tamil Nadu Fire & Rescue Guindy (1.1 km), Velachery Police Station (J-7), and designated high-ground relief centers with direct 112 calling.
