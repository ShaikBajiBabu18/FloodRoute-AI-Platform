# FloodRoute AI Platform — Flood-Risk Model Technical Audit

**Model Type:** Multi-Factor Deterministic Heuristic Scoring Model  
**Implementation Source:** `server/src/services/riskEngine.ts` & `server/src/flood/flood.service.ts`

---

## 1. Input Parameters & Data Attribution

| Parameter | Symbol | Source | Physical Units | Sub-Score Range | Weight |
|---|:---:|---|---|:---:|:---:|
| **Rainfall Intensity** | $R_{\text{rain}}$ | Open-Meteo IMD Grid | $mm/h$ & 24h accumulation | $0–100$ | **35%** |
| **Topographic Depression** | $E_{\text{elev}}$ | NASA SRTM 30m DEM | Meters above MSL | $0–100$ | **25%** |
| **Drainage Saturation** | $D_{\text{drain}}$ | Soil Saturation Index | Duration & intensity | $0–100$ | **20%** |
| **Disaster Advisories** | $A_{\text{bulletins}}$ | Active warning polygons | Distance & severity | $0–100$ | **15%** |
| **Ground Corroboration** | $C_{\text{crowd}}$ | Verified citizen reports | Density in 1.5 km | $0–100$ | **5%** |

---

## 2. Normalization & Threshold Equations

### Rainfall Sub-Score ($R_{\text{rain}}$)
- $R < 2.5\text{ mm/h} \to 0\text{ pts}$ (Dry / Light drizzle)
- $2.5 \le R < 15\text{ mm/h} \to 30\text{ pts}$ (Moderate rain)
- $15 \le R < 35\text{ mm/h} \to 65\text{ pts}$ (Heavy rain)
- $R \ge 35\text{ mm/h} \to 100\text{ pts}$ (Cloudburst / Severe downpour)

### Elevation Depression Sub-Score ($E_{\text{elev}}$)
- Relative ground elevation calculated against the surrounding $2\text{ km}$ buffer:
  - $\le 2\text{m MSL} \to 100\text{ pts}$ (Extreme low-lying saucer depression)
  - $2\text{m} < \text{Elev} \le 5\text{m} \to 70\text{ pts}$ (High vulnerability basin)
  - $5\text{m} < \text{Elev} \le 15\text{m} \to 30\text{ pts}$ (Moderate elevation)
  - $> 15\text{m} \to 0\text{ pts}$ (High ridge / Elevated ground)

### Composite Risk Formula
$$\text{Risk Score} = 0.35(R_{\text{rain}}) + 0.25(E_{\text{elev}}) + 0.20(D_{\text{drain}}) + 0.15(A_{\text{bulletins}}) + 0.05(C_{\text{crowd}})$$
The resulting score is clamped to $[0, 100]$.

---

## 3. Output Categories & Operational Meaning

- **LOW (0–30):** Normal transit conditions; normal surface drainage functioning.
- **MODERATE (31–60):** Surface water accumulating; low-clearance hatchbacks and two-wheelers exercise caution.
- **HIGH (61–80):** Significant underpass and road waterlogging; avoid low-lying basins; higher-clearance vehicles advised.
- **CRITICAL (81–100):** Severe, impassable flooding ($>45\text{ cm}$); immediate vehicle stalling hazard; take elevated highway bypasses.

---

## 4. Missing-Data & Degradation Behavior
- If any individual data source is unavailable (e.g. no verified citizen reports in the area), that sub-factor defaults to nominal zero or baseline weight.
- If the external weather API times out, the service automatically injects cached meteorological baselines.
- The calculation is completely non-blocking and guaranteed never to throw an unhandled exception.

---

## 5. Model Limitations (Honest Disclosure)
- **Not Machine Learning:** This is an auditable, deterministic heuristic algorithm, not a black-box deep neural network.
- **Elevation Resolution Limit:** Incorporates 30m SRTM elevation data; cannot detect localized sub-meter curb blockages or micro-depressions.
- **Advisory Only:** Outputs are strictly labeled as *"Model-estimated flood risk — advisory guidance only."*
