# FloodRoute AI Platform — Implemented Features

Every feature listed below is verified, implemented, and fully operational in the codebase:

### 1. Interactive GIS Map Deck
- Leaflet 1.9 canvas covering all 28 states and 8 union territories of India.
- Hardware-accelerated zooming, panning, and layer switching (Street, Satellite, Topography).
- Dynamic hazard pins indicating verified waterlogging, fallen trees, and road closures.

### 2. Location Geocoding & Bounding-Box Navigation
- Suburb and city search powered by OpenStreetMap Nominatim API.
- Instant camera `flyTo` transitions with automated coordinate extraction.

### 3. Real-Time Meteorological Telemetry
- Hourly precipitation rate ($mm/h$), 24h accumulation, hourly temperature, and wind speed from Open-Meteo IMD observation grid.

### 4. Explainable Flood-Risk Engine
- Deterministic 0–100 scoring model evaluating 5 discrete factors: rainfall intensity (35%), terrain elevation (25%), drainage soil saturation (20%), official advisories (15%), and citizen reports (5%).
- Granular breakdown table detailing points impact and clear data sources.

### 5. Route Analysis (Lower Modeled Risk Exposure)
- Dual corridor generation via Open Source Routing Machine (OSRM).
- Highlights elevated highway bypasses with lower modeled flood-risk exposure circumventing submerged basins.

### 6. Emergency Directory & Helpline
- Curated index of emergency shelters, fire stations, and apex hospitals.
- Prominent one-tap 112 national emergency call button.

### 7. Citizen Hazard Crowdsourcing
- Public submission pipeline for road waterlogging incidents with water depth categorization and photo upload.

### 8. Computer Vision Flood Severity Classifier
- Python FastAPI microservice utilizing OpenCV image analysis to estimate surface water coverage and vehicle clearance passability.

### 9. Emergency Command Admin Console
- Administrative console (Port 5174) for emergency personnel to triage citizen submissions, approve verified alerts, and broadcast warnings.

### 10. Conversational AI Copilot
- Context-aware emergency transit assistant answering questions regarding road safety, detour logic, and shelter availability.

### 11. Predictable Demo Mode
- Instant toggle delivering deterministic, reproducible presentation scenarios for Chennai, Mumbai, and Bengaluru.
