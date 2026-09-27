# FloodRoute AI Platform — Flood-Risk Model Explanation

**Design Philosophy:** Explainable Multi-Factor Scoring. Rather than an uninterpretable deep neural network, FloodRoute AI uses a transparent, auditable mathematical model so that citizens and emergency responders understand exactly why a risk score was assigned.

---

## 1. Step-by-Step Computational Lifecycle

```text
RAW INPUTS
(Precipitation mm/h, DEM Elevation, Soil Saturation, Active Warnings, Citizen Reports)
                       │
                       ▼
NORMALIZATION & THRESHOLD MAPPING
(Raw physical units mapped into normalized [0, 100] sub-scores)
                       │
                       ▼
WEIGHTED SCORING AGGREGATION
(Weighted linear sum applying hydrological domain coefficients)
                       │
                       ▼
QUALITATIVE CATEGORY ASSIGNMENT
(LOW [0–30], MODERATE [31–60], HIGH [61–80], CRITICAL [81–100])
                       │
                       ▼
CARTOGRAPHIC GIS VISUALIZATION
(Color-coded map markers, factor breakdown tables, polyline hazard buffers)
```

---

## 2. Model Inputs & Normalization Logic

| Factor | Input Metric | Normalization Formula / Threshold | Weight |
|---|---|---|:---:|
| **$R_{\text{rain}}$ (Rainfall Intensity)** | Instantaneous precipitation ($mm/h$) & 24h accumulation | $0\text{ mm/h} \to 0\text{ pts}$; $15\text{ mm/h} \to 50\text{ pts}$; $\ge 40\text{ mm/h} \to 100\text{ pts}$ | **35%** |
| **$E_{\text{elev}}$ (Topographic Depression)** | Ground elevation ($m$ MSL) from SRTM 30m DEM | $\le 2\text{m MSL} \to 100\text{ pts}$; $5\text{m} \to 60\text{ pts}$; $\ge 25\text{m} \to 0\text{ pts}$ | **25%** |
| **$D_{\text{drain}}$ (Drainage Saturation)** | Estimated stormwater conduit capacity exceedance | Computed from continuous precipitation duration ($>3\text{h} \to 100\text{ pts}$) | **20%** |
| **$A_{\text{bulletins}}$ (Official Warnings)** | Proximity to active NDMA / IMD alert polygons | Red Warning $\to 100\text{ pts}$; Orange $\to 60\text{ pts}$; None $\to 0\text{ pts}$ | **15%** |
| **$C_{\text{crowd}}$ (Ground Corroboration)** | Density of verified citizen reports within 1.5 km | $\ge 5\text{ verified reports} \to 100\text{ pts}$; $1\text{ report} \to 40\text{ pts}$ | **5%** |

---

## 3. Mathematical Formula
$$\text{Risk Score} = 0.35 \times R_{\text{rain}} + 0.25 \times E_{\text{elev}} + 0.20 \times D_{\text{drain}} + 0.15 \times A_{\text{bulletins}} + 0.05 \times C_{\text{crowd}}$$

The resulting score is clamped to $[0, 100]$.

---

## 4. Qualitative Risk Tiers & Actionable Meaning

- **LOW (0–30):** Normal transit conditions. Normal surface drainage functioning.
- **MODERATE (31–60):** Runoff accumulation observed. Low-clearance hatchbacks and two-wheelers exercise caution.
- **HIGH (61–80):** Significant underpass and road waterlogging. Avoid low-lying basins; higher-clearance vehicles advised.
- **CRITICAL (81–100):** Severe, impassable flooding ($>45\text{ cm}$). High danger of vehicle stalling. Evacuate to high ground or choose elevated highway bypasses.

---

## 5. Important Ethical Note
This is a **heuristic scoring model**, not an uncertified black-box neural prediction. We do **not** claim mathematical perfection or statutory forecasting accuracy. All outputs are presented with the disclaimer: *"Model-estimated flood risk — advisory guidance only."*
