# FloodRoute AI Platform — AI Architecture & Flood Risk Model

## 1. Explainable Flood Risk Engine (Mathematical Formulation)

Unlike uninterpretable neural networks that cannot be audited during emergency operations, FloodRoute AI enforces an **Explainable AI (XAI)** mathematical formulation.

The cumulative Flood Risk Index $R_{\text{flood}} \in [0, 100]$ is computed as:

$$\text{Risk Score} = 0.35 \times R_{\text{rain}} + 0.25 \times E_{\text{elev}} + 0.20 \times D_{\text{drain}} + 0.15 \times A_{\text{bulletins}} + 0.05 \times C_{\text{crowd}}$$

### Granular Factor Breakdown:
1. **$R_{\text{rain}}$ — Meteorological Intensity (35% Weight):**
   - Ingests real-time precipitation rate ($mm/h$) and 24-hour antecedent rainfall from the Open-Meteo IMD observation grid.
   - Rates exceeding $35\text{ mm/h}$ indicate cloudburst conditions with rapid surface runoff.
2. **$E_{\text{elev}}$ — Topographical Elevation Depression (25% Weight):**
   - Cross-references NASA SRTM 30m Digital Elevation Model.
   - Low-lying saucer-shaped basins (e.g. $<5\text{m}$ MSL) receive high depression penalties.
3. **$D_{\text{drain}}$ — Drainage & Soil Saturation Index (20% Weight):**
   - Estimates stormwater conduit capacity exceedance based on continuous precipitation duration.
4. **$A_{\text{bulletins}}$ — Active Disaster Advisories (15% Weight):**
   - Evaluates proximity to official/simulated NDMA, IMD, or CWC warning polygons.
5. **$C_{\text{crowd}}$ — Ground-Truth Citizen Corroboration (5% Weight):**
   - Density and water-level severity of verified citizen hazard reports within a $1.5\text{ km}$ radius.

---

## 2. Qualitative Risk Tiers

- **LOW (0–30):** Normal transit conditions. Clear drainage flow.
- **MODERATE (31–60):** Surface runoff accumulating. Low-clearance hatchbacks and two-wheelers exercise caution.
- **HIGH (61–80):** Significant waterlogging in underpasses. Avoid low-lying basins; higher-clearance vehicles advised.
- **CRITICAL (81–100):** Severe, impassable flooding ($>45\text{ cm}$). Immediate vehicle stalling hazard. Avoid travel or use elevated highway bypasses.

---

## 3. Computer Vision AI Engine (`apps/ai-service`)

A dedicated Python FastAPI microservice that analyzes citizen-submitted incident photos:
- Evaluates surface water reflectivity and turbidity using OpenCV color segmentation.
- Computes estimated road water coverage percentage.
- Categorizes road visibility into `CLEAR`, `PARTIALLY_SUBMERGED`, or `COMPLETELY_SUBMERGED`.
- Suggests vehicle accessibility clearance (`PASSABLE`, `DIFFICULT`, `IMPASSABLE`).
- Every output carries an explicit disclaimer: *"AI-assisted estimate. Not an official disaster determination."*

---

## 4. Responsible AI & Trust Standard

### "Can We Trust the Flood Prediction?"
**Honest Answer:** FloodRoute AI provides **decision-support estimates** based on available remote sensing, meteorological telemetry, and topological elevation data. It is **not** an official statutory emergency determination. Topographical DEM data has a 30m resolution boundary and cannot detect localized sub-meter clogged storm gutters. Commuters and responders must always treat the output as advisory guidance and comply with on-ground directives from local police and disaster authorities.
