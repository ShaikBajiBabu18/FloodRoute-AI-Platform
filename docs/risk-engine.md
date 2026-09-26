# FloodRoute AI — Explainable Hydrological Risk Engine Specification

## 1. Architectural Philosophy: Explainable AI (XAI)
In life-critical disaster management systems, black-box neural networks that produce uninterpretable risk predictions cannot be trusted by municipal emergency coordinators, first responders, or citizens navigating rising waters.

**FloodRoute AI** enforces a deterministic, multi-factor hydrological modeling engine with granular mathematical attribution. Every risk score is accompanied by an explainable factor breakdown showing the exact percentage contribution of rainfall, elevation, drainage capacity, river proximity, and crowdsourced reports.

> **Crucial Safety Notice**:  
> All risk ratings and route analyses are classified as **Decision-Support Advisories** for lower modeled flood-risk exposure. They do not constitute official statutory flood warnings or guarantees of absolute passage.

---

## 2. Mathematical Formulation

The cumulative Flood Risk Index $R_{\text{flood}} \in [0, 100]$ is computed as a weighted linear combination of five orthogonal physical and observational parameters, modulated by an antecedent soil saturation multiplier $M_{\text{soil}}$:

$$R_{\text{flood}} = \min\left(100, \, \left(\sum_{i=1}^{5} w_i \cdot S_i\right) \times M_{\text{soil}}\right)$$

Where $\sum_{i=1}^{5} w_i = 1.0$, defined as follows:

| Factor | Notation | Weight ($w_i$) | Physical Parameter | Primary Data Source |
| :--- | :---: | :---: | :--- | :--- |
| **Meteorological Intensity** | $S_{\text{rain}}$ | **0.35** ($35\%$) | Current precipitation rate ($mm/h$) & 24h accumulation | Open-Meteo Precipitation Telemetry |
| **Topographical Elevation** | $S_{\text{elev}}$ | **0.25** ($25\%$) | Digital Elevation Model (DEM) relative to basin minimum | Open-Meteo Elevation API / SRTM |
| **Drainage Capacity** | $S_{\text{drain}}$ | **0.20** ($20\%$) | Urban runoff coefficient & municipal stormwater threshold | Regional Urban Infrastructure Profiles |
| **Hydrological Proximity** | $S_{\text{river}}$ | **0.15** ($15\%$) | Buffer distance to major rivers, canals, or tidal basins | CWC Telemetry / OpenStreetMap Hydrology |
| **Crowdsourced Ground Truth** | $S_{\text{crowd}}$ | **0.05** ($5\%$) | Density & depth of verified citizen reports within 1.5 km | FloodRoute Community Sentinel Pipeline |

---

## 3. Sub-Component Calculation Details

### 3.1. Precipitation Score ($S_{\text{rain}}$)
Precipitation severity evaluates both instantaneous cloudburst rate $I_c$ ($mm/h$) and 24-hour antecedent total $A_{24}$ ($mm$):

$$S_{\text{rain}} = \min\left(100, \, 0.6 \times \left(\frac{I_c}{50} \times 100\right) + 0.4 \times \left(\frac{A_{24}}{150} \times 100\right)\right)$$

- $I_c > 50\text{ mm/h}$ triggers maximum localized flash flood hazard.
- $A_{24} > 150\text{ mm}$ saturates primary urban culverts.

### 3.2. Elevation Score ($S_{\text{elev}}$)
Elevations are scored inversely relative to surrounding terrain contours within a 5 km radius ($E_{\text{local}}$):

$$S_{\text{elev}} = \begin{cases}
100 & \text{if } E \le 2\text{ m MSL} \\
80 & \text{if } 2\text{ m} < E \le 8\text{ m MSL} \\
50 & \text{if } 8\text{ m} < E \le 20\text{ m MSL} \\
20 & \text{if } 20\text{ m} < E \le 50\text{ m MSL} \\
5 & \text{if } E > 50\text{ m MSL}
\end{cases}$$

### 3.3. Drainage Saturation Score ($S_{\text{drain}}$)
Drainage performance tracks runoff exceedance against standard municipal pipe evacuation design limits ($Q_{\text{design}} = 25\text{ mm/h}$):

$$S_{\text{drain}} = \min\left(100, \, \max\left(0, \, \frac{I_c - Q_{\text{design}}}{40} \times 100\right)\right)$$

### 3.4. River Proximity Score ($S_{\text{river}}$)
Distance $D_{\text{channel}}$ to natural drainage basins, major rivers (e.g., Adyar, Cooum, Mula-Mutha, Yamuna), and ocean tidal buffers:

$$S_{\text{river}} = \begin{cases}
95 & \text{if } D_{\text{channel}} \le 0.5\text{ km} \\
75 & \text{if } 0.5\text{ km} < D_{\text{channel}} \le 1.5\text{ km} \\
45 & \text{if } 1.5\text{ km} < D_{\text{channel}} \le 3.5\text{ km} \\
15 & \text{if } D_{\text{channel}} > 3.5\text{ km}
\end{cases}$$

### 3.5. Crowdsourced Sentinel Corroboration ($S_{\text{crowd}}$)
Aggregated depth reports $d_k$ (in cm) from $N$ verified citizen submissions within $1.5\text{ km}$:

$$S_{\text{crowd}} = \min\left(100, \, \sum_{k=1}^{N} \left(\frac{d_k}{60} \times 25\right)\right)$$

---

## 4. Risk Classification Tiers & Advisory Mapping

The resulting score $R_{\text{flood}}$ maps directly into four operational tiers aligned with NDMA disaster color-coding:

| Score Range | Risk Tier | Color Code | Transit Guidance |
| :---: | :---: | :---: | :--- |
| **0 – 29** | **LOW** | `#22c55e` (Green) | Roads dry and passable. Normal transit conditions. |
| **30 – 59** | **MODERATE** | `#eab308` (Yellow) | Surface runoff observed. Low-clearance two-wheelers exercise caution. |
| **60 – 79** | **HIGH** | `#f97316` (Orange) | Significant waterlogging. Avoid subway underpasses; higher-clearance vehicles advised. |
| **80 – 100** | **SEVERE** | `#ef4444` (Red) | Impassable inundation ($> 45$ cm). High danger of vehicle stalling. Evacuate to high ground. |

---

## 5. Route-Level Risk Evaluation & Avoidance Routing

When calculating evacuation or transit routes, the routing engine queries OSRM (Open Source Routing Machine) for primary and alternative polylines.

For each polyline segment $L$ represented by coordinate sequence $\{c_1, c_2, \dots, c_m\}$:
1. Sample coordinates along the polyline at 250m intervals.
2. Query localized flood risk $R(c_k)$ at each sample point.
3. Compute segment cumulative risk score:
   $$\text{Route Risk} = \frac{1}{m} \sum_{k=1}^{m} R(c_k) + 0.2 \times \max_{k} R(c_k)$$
4. Filter out any route traversing segments where $R(c_k) \ge 85$ (submerged underpasses or riverbank overflow zones).
5. Recommend the corridor with **Lower Modeled Flood-Risk Exposure**, explicitly comparing elevation profile, water hazard points avoided, and transit safety delta.

---

## 6. Real-Time Explainability Payload

Every API response from `/api/weather/risk` returns both the holistic score and structured breakdown for transparent UI rendering:

```json
{
  "location": "Velachery, Chennai",
  "score": 78,
  "level": "HIGH",
  "recommendation": "Elevated bypass flyovers recommended. Avoid Velachery Lake underpasses.",
  "factors": [
    { "name": "Heavy Rainfall", "weight": "35%", "score": 85, "impact": "High (42 mm/h cloudburst)" },
    { "name": "Low Elevation", "weight": "25%", "score": 90, "impact": "Critical (3m MSL basin)" },
    { "name": "Drainage Overload", "weight": "20%", "score": 75, "impact": "Runoff exceeding storm drain capacity" },
    { "name": "Basin Proximity", "weight": "15%", "score": 65, "impact": "0.6 km from Velachery lake overflow canal" },
    { "name": "Ground Reports", "weight": "5%", "score": 70, "impact": "3 verified reports of 35cm standing water" }
  ]
}
```
