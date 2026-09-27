# FloodRoute AI Platform — Limitations & Future Roadmap

**Honest Engineering Disclosure:** Clear separation between current physical and technical limitations versus realistic future development items.

---

## Part 1: Current Limitations

### 1. Topographical Data Resolution (30m SRTM DEM)
- **Constraint:** The model currently incorporates NASA SRTM 30-meter digital elevation data.
- **Impact:** 30m resolution accurately models macro-catchments and basin depressions, but cannot resolve sub-meter micro-barriers like flyover median ramps, elevated sidewalks, or clogged roadside gutters.

### 2. Earth Observation Satellite Latency
- **Constraint:** Public optical and radar remote sensing satellites carry an orbital revisit interval of 6 to 12 hours.
- **Impact:** Real-time sudden flash flood detection relies on ground weather radar, precipitation telemetry, and crowdsourced hazard reports rather than instant spaceborne imagery.

### 3. Public OSRM Server Rate Limits
- **Constraint:** The development prototype interfaces with public Open Source Routing Machine (OSRM) endpoints.
- **Impact:** Subject to external server load and connection timeouts during peak traffic. Production deployments require self-hosted OSRM container instances.

### 4. Crowdsourced Report Verification Delay
- **Constraint:** Unverified public submissions cannot immediately influence route risk weights without risk of false reporting or spam.
- **Impact:** Reports must pass heuristic filtering or manual moderator review in the Admin Console before penalizing road segments.

### 5. Telecom SMS Gateway Integration
- **Constraint:** Low-bandwidth SMS/USSD fallback command parsing is fully implemented and tested, but live carrier integration (e.g. Twilio or CDAC Mobile Seva) was simulated in development without live SMS carrier credits.

---

## Part 2: Future Development Roadmap

### 1. IoT Ultrasonic River Gauge Network
- Ingest real-time water-level stage measurements from Central Water Commission (CWC) telemetry sensors mounted at urban bridges and culverts.

### 2. On-Device Edge Computer Vision
- Deploy lightweight, quantized neural networks (e.g. MobileNet / YOLO) directly into citizen mobile browsers via WebAssembly / TensorFlow.js for offline image analysis.

### 3. Native NDMA Common Alerting Protocol (CAP) Ingestion
- Automatically ingest and parse official CAP-XML alert feeds from national disaster management agencies.

### 4. Municipal LiDAR & High-Resolution Elevation Contours
- Partner with municipal corporations to ingest sub-meter aerial LiDAR bathymetry surveys for precise curb-level drainage modeling.

### 5. Multilingual Localization
- Expand user interface and SMS commands into major Indian regional languages (Hindi, Tamil, Telugu, Bengali, Marathi, and Kannada).
