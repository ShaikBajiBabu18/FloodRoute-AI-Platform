# FLOODROUTE AI PLATFORM

## AI-POWERED FLOOD-RISK DECISION SUPPORT

---

### PROBLEM
During intense monsoon cloudbursts in Indian urban hubs, arterial roads submerge within minutes. Mainstream navigation apps optimize solely for traffic velocity, inadvertently directing motorists and emergency responders into inundated low-lying underpasses. Fragmented weather totals, unverified social media alerts, and static shelter circulars leave citizens stranded without actionable transit guidance.

---

### SOLUTION
FloodRoute AI unifies real-time meteorological observations, 30-meter digital elevation models, and verified citizen hazard reports into a single, accessible decision-support command system. It calculates transparent 0–100 flood-risk scores, recommends elevated bypass routes with lower modeled flood-risk exposure, and provides one-tap access to national emergency services and high-ground shelters.

---

### CORE FEATURES

- 🗺 **Interactive Map:** India-wide Leaflet GIS deck with layer toggles (Street, Satellite, Topography) and active hazard markers.
- 🌧 **Weather Context:** Live precipitation intensity ($mm/h$), 24h accumulation, hourly forecast, and wind speed.
- 🌊 **Flood-Risk Estimate:** Explainable 0–100 score breaking down rainfall, ground elevation, soil saturation, and hazard reports.
- 🛣 **Route Analysis:** Highlights elevated highway bypasses with lower modeled flood-risk exposure circumventing flooded basins.
- 🚑 **Emergency Services:** One-tap 112 emergency calling, apex hospital discovery, and high-ground shelter routing.
- 🤖 **AI Assistant:** Context-aware conversational Copilot and computer-vision flood depth classification.
- 📊 **Analytics:** Administrative incident command deck with district vulnerability charts and alert broadcasting.

---

### HOW IT WORKS

```text
Location → Data Ingestion → Risk Model → Map Visualization → Route Analysis → Safe Action
```

---

### TECHNOLOGY
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Leaflet GIS, Lucide Icons.
- **Backend Gateway:** Node.js, Express.js in TypeScript, Helmet, Rate Limiter, Joi validation.
- **Database:** SQLite with Prisma ORM (WAL mode; PostgreSQL compatible).
- **AI Microservice:** Python 3.10+, FastAPI, OpenCV, NumPy.

---

### DATA
- **Meteorology:** Open-Meteo API synced with IMD observation grid (**Live Data**).
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API (**Live Data**).
- **Road Network Graph:** Open Source Routing Machine (OSRM) (**Live Data**).
- **Digital Elevation Models:** NASA SRTM 30m dataset (**Integrated Model**).
- **Disaster Bulletins:** Pre-seeded scenario bulletins (**Explicitly Tagged Demo Data**).

---

### IMPORTANT
> **"Model estimates are decision-support information and are not official emergency warnings. Commuters and responders must always comply with on-ground instructions from police and disaster management authorities."**
