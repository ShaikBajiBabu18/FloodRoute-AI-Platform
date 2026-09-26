# FloodRoute AI — Technical Limitations, Data Constraints & Future Scope

> Rigorous technical transparency regarding current prototype boundaries, physical limitations of remote sensing, and engineering roadmap.

---

## 1. Safety & Legal Disclaimer

FloodRoute AI is an **experimental decision-support prototype** developed for hackathon evaluation and disaster-preparedness research.

> **CRITICAL DISCLAIMER**:
> - FloodRoute AI does **NOT** issue statutory flood declarations or sovereign civil defense orders.
> - All alternative transit corridors are classified as **"Lower Modeled Flood-Risk Exposure"** — they are **NEVER guaranteed safe** against unpredictable flash flooding, structural culvert collapse, or submerged electrical lines.
> - Citizens, commercial drivers, and emergency personnel must always follow on-ground instructions issued by the **National Disaster Management Authority (NDMA)**, **State Disaster Management Authorities (SDMA)**, local municipal corporations, and traffic police officers.
> - **Never drive through moving flood waters.** "Turn Around, Don't Drown."

---

## 2. Inherent Data Constraints & Remote Sensing Boundaries

### 2.1. Meteorological Telemetry Latency
- **Data Source**: Open-Meteo API / IMD GFS Ensemble models.
- **Refresh Frequency**: 1-hour to 3-hour intervals depending on forecast model run.
- **Constraint**: Ultra-localized hyper-convective micro-bursts (e.g. 100 mm in 45 minutes over a 2 km² urban pocket) can develop faster than global numerical weather models assimilate radar telemetry. Ground sentinel reports compensate for this delta but require active citizen participation.

### 2.2. Digital Elevation Model (DEM) Resolution
- **Current Resolution**: 30-meter Shuttle Radar Topography Mission (SRTM) global dataset.
- **Constraint**: 30-meter pixels average out sub-meter vertical micro-features such as raised road medians, flyover ramps, stormwater curb drains, and roadside embankments. A road surface elevated 1.2 meters above an adjacent drainage ditch may not be resolved in 30m DEM without local LiDAR survey integration.

### 2.3. Road Network Topology & Drainage Infrastructure
- **Network Source**: OpenStreetMap (OSM) via OSRM routing machine.
- **Constraint**: OSM tags for culverts, floodgates, underground stormwater pump stations, and historical inundation points vary in completeness across tier-2 and tier-3 Indian municipalities compared to metropolitan centers like Chennai, Mumbai, or Delhi.

### 2.4. Computer Vision Image Verification
- **Vision Model**: OpenCV + Deep Learning contour segmentation.
- **Constraint**: Image-based depth estimation relies on visible landmarks (tire submergence, car grilles, street signposts). At night or in muddy torrential downpours with heavy lens droplets, confidence bounds degrade by 15-20%.

---

## 3. Operational Resilience & Fallback Mitigations

| Failure Mode | Fallback Mechanism | Impact on User |
| :--- | :--- | :--- |
| **External Weather API Down** | Built-in offline hydrological model with cached baseline profiles | Transparent warning displayed; fallback telemetry used |
| **OSRM Routing Engine Down** | Haversine distance heuristic with topological waypoint interpolation | Basic routing guidance with risk elevation profile preserved |
| **Internet Offline** | PWA Service Worker caching core UI, emergency phone numbers, and cached maps | Offline emergency directory and cached route bookmarks accessible |
| **Database Failure** | In-memory read replica with local state persistence | Public read operations continue uninterrupted |

---

## 4. Future Roadmap & Scaling Horizon

1. **Phase 1: LiDAR & Drone Bathymetry Integration**  
   Partner with municipal corporations (e.g. Greater Chennai Corporation, BMC Mumbai) to ingest centimeter-accurate mobile LiDAR scans of urban stormwater conduits.

2. **Phase 2: IoT Ultrasonic Water-Level Mesh Network**  
   Deploy low-cost solar LoRaWAN sensors at major urban underpasses and stormwater outfalls, streaming 30-second water-level telemetry directly to the WebSocket ingestion pipeline.

3. **Phase 3: Multi-Language Offline SMS & USSD Evacuation Gateway**  
   Enable feature-phone users without smartphones or mobile data to send their PIN code via SMS/USSD and receive immediate turn-by-turn high-ground evacuation directions in Hindi, Tamil, Telugu, Marathi, and Bengali.

4. **Phase 4: Official NDMA CAP-CP Webhook Telemetry**  
   Direct automated bi-directional synchronization with India's Common Alerting Protocol (CAP) platform for automated emergency broadcast validation.
