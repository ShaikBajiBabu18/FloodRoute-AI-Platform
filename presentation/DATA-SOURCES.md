# FloodRoute AI Platform — Data Sources & Integrity Register

**Standard:** Factual disclosure distinguishing live feeds, numerical forecasts, static baselines, and demonstration datasets.

---

| Source | Purpose | Type | Actual Use in Platform |
|---|---|:---:|---|
| **Open-Meteo Weather API** | Real-time and forecasted precipitation telemetry | **LIVE DATA & FORECAST DATA** | Ingests real-time precipitation rate ($mm/h$), 24-hour antecedent rainfall, temperature, relative humidity, and 7-day outlooks synced with IMD grids. |
| **OpenStreetMap & Nominatim API** | Municipal cartography and forward/reverse geocoding | **LIVE DATA** | Resolves Indian cities, districts, and landmarks to coordinate bounding boxes; renders base map tiles. |
| **Open Source Routing Machine (OSRM)** | Road network graph and turn-by-turn routing | **LIVE DATA** | Generates driving route polylines and navigation steps between origin and destination coordinates across India. |
| **NASA SRTM 30m Digital Elevation Model** | Ground surface elevation contours | **STATIC DATA (Integrated Model)** | Evaluates ground elevation ($m$ MSL) to detect low-lying depressions, saucer basins, and natural drainage paths. |
| **National Emergency Helplines (112, 101, 108)** | Life-safety emergency communication | **STATIC DATA** | Powers prominent one-tap direct calling for ambulance, fire, and national emergency response. |
| **Emergency Shelters & Apex Hospitals Database** | High-ground evacuation and medical aid directory | **STATIC DATA** | Relational records of shelters, NDRF posts, and hospitals with address, elevation above sea level, and direct contact numbers. |
| **Citizen Incident Field Submissions** | Localized road waterlogging and hazard reporting | **LIVE DATA** | Public reporting pipeline storing citizen descriptions, depth levels, and photo attachments in SQLite. |
| **Sample Disaster Warning Bulletins** | Realistic emergency alert demonstration | **DEMO DATA** | Seeded alerts (e.g. Adyar Inundation, Mumbai Orange Alert) explicitly tagged `[DEMO DATA]` for judging predictability. |
