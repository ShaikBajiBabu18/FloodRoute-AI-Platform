# FloodRoute AI — Artificial Intelligence & Predictive Modeling Overview

## 1. Architectural Philosophy: Explainable AI (XAI)
In life-critical disaster management systems, black-box machine learning models that produce uninterpretable probabilities cannot be trusted by municipal emergency coordinators. 

**FloodRoute AI** enforces a hybrid AI architecture combining:
1. **Explainable Multi-Variable Hydrological Modeling** for flood probability and factor breakdown.
2. **Computer Vision Deep Learning** for automated photo verification.
3. **Context-Aware Disaster Copilot** for conversational routing assistance.

All predictions are strictly labeled:
> `[AI FLOOD PREDICTION] — Advisory guidance only; not a substitute for statutory government declarations.`

---

## 2. Explainable Hydrological Risk Engine

### 2.1. Mathematical Formulation
The flood probability $P_{\text{flood}} \in [0, 100]$ is computed using a weighted aggregation of five orthogonal disaster variables, scaled by a dynamic soil saturation index:

$$P_{\text{flood}} = \min\left(100, \, \left(w_{\text{met}} S_{\text{met}} + w_{\text{hydro}} S_{\text{hydro}} + w_{\text{topo}} S_{\text{topo}} + w_{\text{comm}} S_{\text{comm}} + w_{\text{alert}} S_{\text{alert}}\right) \times M_{\text{soil}}\right)$$

Where the weights satisfy $\sum w_i = 1.0$:
- **Meteorological Intensity ($w_{\text{met}} = 0.35$)**: Rain rate $R_c$ ($mm/h$) and 24h accumulation $R_f$ ($mm$).
- **River & Basin Proximity ($w_{\text{hydro}} = 0.20$)**: Distance $D_{\text{river}}$ to major drainage channels:
  - $D \le 0.8\text{ km} \implies S_{\text{hydro}} = 95$
  - $D \le 2.0\text{ km} \implies S_{\text{hydro}} = 70$
  - $D \le 5.0\text{ km} \implies S_{\text{hydro}} = 40$
- **Topographical Elevation & Drainage ($w_{\text{topo}} = 0.20$)**: Inverted Mean Sea Level (MSL) elevation and urban drainage capacity coefficient.
- **Community Ground Corroboration ($w_{\text{comm}} = 0.15$)**: Spatial density of verified crowdsourced reports within 1.5 km and confirmed blocked culverts.
- **Official Statutory Warning Multiplier ($w_{\text{alert}} = 0.10$)**: Active NDMA / IMD Red & Amber alert polygons.
- **Soil Saturation Multiplier ($M_{\text{soil}} \in [0.8, 1.2]$)**: Ratio of antecedent precipitation to soil moisture holding capacity.

### 2.2. Risk Classification Thresholds
| Risk Level | Probability Range | Citizen Guidance |
| :--- | :--- | :--- |
| **LOW** | $0 \le P < 25$ | Roads dry and passable. Normal transit conditions. |
| **MODERATE** | $25 \le P < 50$ | Surface runoff. Low-clearance two-wheelers exercise caution. |
| **HIGH** | $50 \le P < 75$ | Significant waterlogging. Hatchbacks avoid underpasses; SUVs only. |
| **SEVERE** | $75 \le P < 90$ | Deep standing water ($> 45$ cm). Commercial & emergency vehicles only. |
| **CRITICAL** | $90 \le P \le 100$ | Inundation / breach. Corridors impassable. Immediate evacuation advised. |

### 2.3. Vehicle Accessibility Rules Matrix
```typescript
{
  twoWheeler: floodProbability < 30 && currentRainfallMm < 15,
  hatchbackSedan: floodProbability < 45 && currentRainfallMm < 30,
  suv: floodProbability < 75,
  heavyEmergencyVehicle: floodProbability < 95
}
```

---

## 3. Computer Vision Flood Image Analysis (FastAPI Port 8000)

### 3.1. Pipeline Overview
When a citizen uploads an incident photograph, it is submitted via multipart form data to the FastAPI service at `http://127.0.0.1:8000/api/analyze-flood`:

```mermaid
flowchart LR
    IMG["Citizen Photograph"] --> PRE["Image Normalization<br/>(Resize, De-noise)"]
    PRE --> CV["Surface Reflection & Color Analysis"]
    CV --> WATER["Water Mask Segmentation"]
    WATER --> DEPTH["Submersion Heuristic<br/>(Tire/Kerb Ratio)"]
    DEPTH --> RES["JSON Output:<br/>floodDetected, confidence, depthCm"]
```

### 3.2. Detection Indicators
1. **Specular Surface Reflection**: Detects mirror reflection patterns characteristic of standing water bodies.
2. **Brown / Turbid Runoff Colorimetric Profiling**: Differentiates clear asphalt from monsoon mud/silt inundation in the HSV color space.
3. **Vehicle Reference Anchoring**: Compares water line heights against standard car tires (approx. 60 cm height) to deduce metric depth ($cm$).

---

## 4. AI Disaster Copilot (`/api/copilot/chat`)
- **Real-Time Context Injection**: Pulls the user’s current GPS coordinates, active regional weather alerts, and nearest available high-ground shelters.
- **Intent Disambiguation**:
  - `ROUTE_INTENT`: "How do I get to Chennai Central without crossing flooded roads?"
  - `SHELTER_INTENT`: "Where is the nearest relief camp with dry rations?"
  - `WEATHER_INTENT`: "What is the rainfall forecast for Velachery tonight?"
- **Multilingual Voice Synthesis**: Outputs can be vocalized in English, Tamil, Telugu, Hindi, or Kannada using the browser SpeechSynthesis API.
