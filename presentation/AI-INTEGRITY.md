# FloodRoute AI Platform — AI Integrity & Ethical Audit

**Audit Objective:** Rigorous verification of machine learning and natural-language intelligence to ensure ethical safety, data privacy, and absence of misleading behavior.

---

## 1. External Model Dependencies
- **Are External Cloud AI APIs (e.g. OpenAI, Anthropic) Required?** **NO.**
- The platform does not depend on paid third-party proprietary LLM endpoints for runtime operation.
- The computer vision engine runs locally via a Python FastAPI microservice utilizing OpenCV heuristics.
- The conversational Copilot uses a structured, context-driven conversational engine in Express with local hydrological reasoning templates.

---

## 2. Context Ingestion & Guardrails
- **What Reaches the Model:**
  - Active latitude and longitude coordinates.
  - Resolved location name and municipal district.
  - Real-time rainfall intensity ($mm/h$) and 24h accumulation.
  - Ground elevation above sea level ($m$ MSL).
  - Calculated 0–100 route risk score.
- **Privacy Standard:** Zero personally identifiable citizen information (names, phone numbers, permanent GPS histories) is ingested into the conversational context.

---

## 3. Prevention of Authority Impersonation
- **Strict Prohibition:** The AI is architected so that it **never** presents itself as an official statutory disaster authority.
- **Explicit Disclaimers:** Every AI-generated transit recommendation includes the following persistent notice:
  > *"FloodRoute AI advisory guidance. Not an official statutory disaster determination. Always follow directives from local emergency personnel and on-ground traffic police."*
- Every computer vision classification displays:
  > *"AI-assisted estimate. Not an official disaster determination."*

---

## 4. Local Deterministic Fallback
- **What Happens if AI is Unavailable?**
  - If the Python microservice is offline, the citizen frontend automatically serves deterministic hydrological rule templates based on the mathematical risk score breakdown.
  - If a user asks *"Why is the risk elevated?"*, the fallback engine extracts factors directly from the mathematical model breakdown and generates a structured summary without throwing errors.
  - The application never presents a broken UI or blank error screen if the AI microservice terminates.

---

## 5. Security & Input Sanitization
- User chat inputs are trimmed, length-limited ($\le 500$ characters), and sanitized against cross-site scripting (XSS) before processing.
- Zero API keys are embedded in frontend client bundles.
