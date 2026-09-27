# FloodRoute AI Platform — AI Architecture & Implementation

**Technical Specification:** Comprehensive explanation of artificial intelligence and machine learning components within the FloodRoute AI Platform.

---

## 1. Where AI is Actually Used in the Platform

The platform employs AI in two distinct modules:

### Module A: Computer Vision Flood Severity Classifier (`apps/ai-service`)
- **Technology:** Python 3.10+, FastAPI, OpenCV, NumPy.
- **Function:** Analyzes citizen-submitted road photos to determine whether road waterlogging is present, calculate the percentage of surface water coverage, and classify vehicle accessibility.
- **Workflow:**
  1. Ingests uploaded image buffer.
  2. Executes color segmentation in HSV/LAB space to detect reflective water surfaces and turbid brown stormwater.
  3. Detects road boundary contours and calculates the ratio of submerged asphalt.
  4. Classifies road visibility (`CLEAR`, `PARTIALLY_SUBMERGED`, `COMPLETELY_SUBMERGED`) and vehicle passability (`PASSABLE`, `DIFFICULT`, `IMPASSABLE`).
  5. Computes a confidence metric ($0–100\%$) and explanation string.

### Module B: Context-Aware Conversational Copilot (`apps/web` & `server`)
- **Technology:** Express.js Copilot service with structured conversational prompts and client-side knowledge synthesis.
- **Context Ingested:**
  - Active latitude and longitude coordinates.
  - Selected location display name and district.
  - Current precipitation rate ($mm/h$) and 24h accumulation.
  - Topographical ground elevation ($m$ MSL) and drainage basin.
  - Calculated 0–100 route risk score.
- **Output:** Natural-language guidance answering queries such as *"Why is the risk elevated?"*, *"Is it safe to drive to Velachery right now?"*, or *"Where is the nearest shelter?"*.

---

## 2. External AI Dependencies & Offline Resilience

- **External Cloud AI APIs Required?** **NO.** The platform does not depend on closed, paid third-party AI APIs (e.g. OpenAI or Anthropic) for core runtime operation.
- **Deterministic Offline Fallback:** If the Python FastAPI microservice is offline or disconnected, the frontend and gateway automatically fall back to deterministic hydrological rule templates:
  - If a user asks *"Why is the risk high?"*, the fallback engine extracts factors directly from the mathematical model breakdown and generates a structured summary without throwing errors.
  - If image analysis is unavailable, the triage queue allows manual hazard classification by emergency operators.

---

## 3. Safety & Ethical Limitations

1. **No Absolute Safety Claims:** The AI assistant strictly avoids claiming "100% safe" or "guaranteed passable."
2. **Explicit Disclaimers:** Every computer-vision analysis includes the label: *"AI-assisted estimate. Not an official disaster determination."*
3. **On-Ground Responders Rule:** The AI explicitly advises users: *"Obey on-ground directives from local police and disaster authorities."*
