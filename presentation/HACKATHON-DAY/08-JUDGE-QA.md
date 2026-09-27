# FloodRoute AI Platform — Hackathon Day Judge Q&A

**Fact-Based Reference:** Concise, factual answers to the 15 core technical and architectural questions.

---

### Q1: What problem are you solving?
**Answer:** Standard navigation tools optimize for traffic velocity and transit time. During heavy monsoon cloudbursts, an empty road can be flooded under three feet of water. We solve the dangerous information gap between meteorological weather telemetry, road elevation topography, and vehicle navigation.

### Q2: Why does this need AI?
**Answer:** Traditional systems present static weather bulletins or historical flood maps. AI is required to correlate multi-source asynchronous signals in real time—synthesizing dynamic rainfall intensity, digital elevation contours, and citizen image submissions—and translate them into explainable risk scores and natural-language transit guidance.

### Q3: How is flood risk calculated?
**Answer:** We use an explainable 5-factor deterministic formula:
$$\text{Risk Score} = 0.35(R) + 0.25(E) + 0.20(D) + 0.15(A) + 0.05(C)$$
Where $R$ is real-time rain intensity, $E$ is topographic ground elevation depression, $D$ is soil saturation index, $A$ is active meteorological warnings, and $C$ is verified citizen hazard reports.

### Q4: What data sources are used?
**Answer:**
- **Live Weather:** Open-Meteo API synced with IMD observation grid.
- **Cartography & Geocoding:** OpenStreetMap and Nominatim API.
- **Road Network Graph:** Open Source Routing Machine (OSRM).
- **Elevation Data:** NASA SRTM 30m Digital Elevation Model.
- **Sample Disaster Bulletins:** NDMA / IMD emergency advisories (explicitly tagged `[DEMO DATA]`).

### Q5: How does routing account for flooding?
**Answer:** The routing service queries OSRM for candidate highway trajectories, samples coordinates along each route polyline, and cross-references them against spatial flood-risk buffers and citizen hazard pins. High-risk basins are penalized, and the engine recommends elevated bypass corridors.

### Q6: Is the route guaranteed safe?
**Answer:** **No, and we strictly never claim it is.** Monsoon weather and flash flooding can change rapidly. Our platform explicitly labels recommendations as **"Lower modeled flood-risk exposure"** and advises commuters to follow on-ground police instructions.

### Q7: Where exactly is AI used?
**Answer:**
1. **Explainable Correlative Risk Engine:** Multi-factor deterministic algorithm providing transparent point-by-point attribution.
2. **Computer Vision Flood Depth Classifier:** Python FastAPI microservice using OpenCV to estimate water surface coverage percentage and road passability from incident photos.
3. **Conversational Copilot:** Ingests live telemetry context into natural-language safety advice.

### Q8: What happens when APIs fail?
**Answer:** The system is built for graceful offline resilience:
- If geocoding fails $\to$ pre-seeded municipal quick chips appear.
- If live weather is unreachable $\to$ system serves cached observation baselines with a `[MODEL ESTIMATE]` badge.
- If OSRM routing server times out $\to$ client calculates topological elevation bypass geometry locally.
- If venue Wi-Fi fails $\to$ **Demo Mode** runs the complete showcase offline.

### Q9: How does this scale across India?
**Answer:** OpenStreetMap covers all 36 Indian states and union territories. The meteorological grid covers the entire subcontinent at a 0.1° (~11 km) resolution. The stateless Express gateway and lightweight SQLite/PostgreSQL architecture easily containerize into auto-scaling Kubernetes pods behind CDN edge caching.

### Q10: How do you protect user data?
**Answer:**
- Citizen transit queries do not require permanent GPS history logging.
- Authentication utilizes salted `bcryptjs` password hashing and signed JSON Web Tokens (JWT).
- Strict Role-Based Access Control (RBAC) prevents unauthorized report moderation.
- Clean `.gitignore`; zero keys or database files tracked in Git.

### Q11: Can this replace official emergency systems?
**Answer:** **No.** FloodRoute AI is a citizen decision-support platform designed to complement, not replace, statutory emergency broadcast systems like NDMA, SDMA, or district disaster management cells.

### Q12: What are the current limitations?
**Answer:**
1. **30m DEM Resolution:** Does not capture micro-features like blocked curb drainage or localized roadside dips.
2. **Satellite Refresh Interval:** Earth observation satellite revisit cycles are 6–12 hours.
3. **Public OSRM Rate Limits:** Production deployments require self-hosted OSRM instances.
4. **Crowdsource Verification:** Public reports require moderation to prevent spam.

### Q13: What would you build next?
**Answer:**
1. Direct IoT ultrasonic river gauge integration with Central Water Commission (CWC) telemetry.
2. On-device edge vision inference in mobile browsers using WebAssembly / TensorFlow.js.
3. Common Alerting Protocol (CAP) XML feed ingestion from NDMA / Sachet.
4. Expanded regional language localization (Hindi, Tamil, Telugu, Bengali).

### Q14: How could emergency organizations use it?
**Answer:** District magistrates and NDRF teams can utilize the Admin Command Console to monitor real-time incident heatmaps, review computer-vision flood severity tags on citizen photos, prioritize rescue boat dispatching, and broadcast targeted evacuation advisories.

### Q15: What makes the technical architecture scalable?
**Answer:** Stateless microservice boundaries, asynchronous event-driven design, decoupling of the compute-heavy computer vision pipeline into a standalone Python service, and lightweight relational schemas optimized for high read concurrency via WAL-mode persistence.
