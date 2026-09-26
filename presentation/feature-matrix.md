# FloodRoute AI — Platform Feature Matrix

> Comprehensive breakdown of all platform capabilities, implementation status, backing data sources, operational mode, and technical notes.

---

| Feature | Implemented | Data Source | Live / Demo | Technical Notes |
| :--- | :---: | :--- | :---: | :--- |
| **India-wide Interactive GIS Map** | Yes | MapLibre GL + CARTO / OSM Tiles | **Live** | Sub-meter pan/zoom, dynamic canvas bounds, responsive touch handling |
| **Location Search & Geocoding** | Yes | OpenStreetMap Nominatim API | **Live** | Autocomplete support for Indian cities, suburbs, and landmark locations |
| **Current Location (GPS Geolocation)** | Yes | Browser Geolocation API | **Live** | High-accuracy HTML5 geolocation with fallback to city center |
| **Real-time Weather Intelligence** | Yes | Open-Meteo Global Radar & Meteo API | **Live** | Temperature, humidity, wind, precipitation rate ($mm/h$), 24h accumulation |
| **Multi-factor Flood Risk Engine** | Yes | Algorithmic Multi-Variable Engine | **Live** | Deterministic formula: Rain ($35\%$), Elev ($25\%$), Drain ($20\%$), River ($15\%$), Crowd ($5\%$) |
| **Explainable AI Risk Attribution** | Yes | Internal Scoring Matrix | **Live** | Detailed factor percentage breakdown with plain-English contextual advice |
| **Dynamic Inundation Heatmap** | Yes | Client-side Canvas Heatmap Shader | **Live** | Real-time gradient overlay color-coded according to risk intensity |
| **Flood-Aware Route Calculation** | Yes | OSRM (Open Source Routing Machine) | **Live** | Evaluates multiple paths and recommends lower modeled risk corridor |
| **Turn-by-Turn Flood Warnings** | Yes | Spatial Segment Risk Evaluator | **Live** | Contextual warnings on low-elevation bridges, culverts, and underpasses |
| **Verified High-Ground Shelters** | Yes | Disaster Management Datastore (Prisma) | **Live** | Indexed by elevation above MSL, bed capacity, contact, and direct routing |
| **National SOS & Emergency Calling** | Yes | National Disaster Helpline 112 API | **Live** | Direct `tel:112` protocol integration with local emergency directory |
| **Official Disaster Alerts Feed** | Yes | NDMA / SDMA Warning Datastore | **Live** | Standardized Red/Amber/Yellow color-coded municipal warnings |
| **Citizen Hazard Incident Reporting** | Yes | Community Sentinel Pipeline + WebSockets | **Live** | Two-tap submission with severity, location, description, and photo upload |
| **AI Computer Vision Photo Depth** | Yes | FastAPI + OpenCV Microservice | **Live** | Automated image segmentation estimating water depth in centimeters |
| **Incident Command Center (Admin)** | Yes | Incident Management Portal (Port 5174) | **Live** | Triage queue, report verification/dismissal, alert broadcast deck |
| **Executive Disaster Analytics** | Yes | Recharts Visualization Engine | **Live** | Vulnerability distribution, rainfall vs water depth charts, incident trends |
| **Multi-format Audit Report Export** | Yes | Client & Server Export Engines | **Live** | One-touch export to timestamped CSV, Excel (.xls), and JSON |
| **Role-Based Access Control (RBAC)** | Yes | Argon2id + Stateless JWT | **Live** | Secure segregation between Citizen and Super Admin privileges |
| **Offline Resilience & Fallbacks** | Yes | Built-in Express Hydrologic Baseline | **Live** | Seamless transition to cached regional baselines if external APIs fail |
| **PWA & Mobile Responsive Design** | Yes | Tailwind CSS + Service Worker | **Live** | Accessible on mobile phones, tablets, command wall displays, and laptops |
