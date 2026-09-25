# FloodRoute AI — Enterprise API Reference Manual

## 1. Overview & Base URLs
FloodRoute AI provides a resilient RESTful JSON API and real-time WebSocket event grid. All endpoints are documented via OpenAPI 3.0 at `/api/docs`.

- **Base Gateway URL**: `http://localhost:5000/api`
- **FastAPI Vision Microservice**: `http://127.0.0.1:8000`
- **Interactive Swagger UI**: `http://localhost:5000/api/docs`
- **OpenAPI 3.0 JSON Specification**: `http://localhost:5000/api/openapi.json`

---

## 2. Authentication & Authorization
All authenticated routes require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### `POST /api/auth/register`
Register a new citizen or community sentinel.
- **Request Body**:
  ```json
  {
    "name": "Arun Kumar",
    "email": "arun@example.com",
    "password": "SecurePassword123!",
    "phone": "+919876543210"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "user": { "id": "uuid", "name": "Arun Kumar", "email": "arun@example.com", "role": "CITIZEN" },
    "token": "eyJhbGciOi..."
  }
  ```

### `POST /api/auth/login`
Authenticate credentials and establish a session.
- **Response `200 OK`**: Returns user profile and signed JWT token.

---

## 3. Hydrological & AI Prediction Endpoints

### `POST /api/flood/predict`
Calculates explainable predictive flood risk for any coordinates in India.
- **Request Body**:
  ```json
  {
    "currentRainfallMm": 45.2,
    "forecastRainfallMm": 85.0,
    "elevationM": 6.4,
    "riverProximityKm": 1.2,
    "drainageDensityIndex": 0.35,
    "communityReportsCount": 8,
    "activeRoadClosuresCount": 2,
    "officialWarningsCount": 1
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "floodProbability": 78,
    "confidence": 88,
    "riskLevel": "CRITICAL",
    "explanation": "High precipitation (45.2 mm/h) combined with low elevation (6.4m) and close proximity to Adyar River creates extreme inundation potential.",
    "affectedRadius": 1.8,
    "factors": [
      { "factor": "Precipitation Rate", "contributionPercent": 35, "status": "SEVERE" },
      { "factor": "Topography / Elevation", "contributionPercent": 24, "status": "HIGH" },
      { "factor": "River / Basin Proximity", "contributionPercent": 22, "status": "HIGH" }
    ],
    "accessibility": {
      "twoWheeler": false,
      "hatchbackSedan": false,
      "suv": true,
      "heavyEmergencyVehicle": true
    },
    "disclaimer": "AI FLOOD PREDICTION: Guidance only; not a substitute for official NDMA/IMD declarations."
  }
  ```

---

## 4. Disaster Routing & Corridor Analysis

### `POST /api/routes/calculate`
Calculates dual routes: **Fastest Route** vs **Flood-Aware Safe Route**.
- **Request Body**:
  ```json
  {
    "origin": { "lat": 12.9716, "lng": 80.2435, "name": "Kotturpuram" },
    "destination": { "lat": 12.9229, "lng": 80.1275, "name": "Tambaram" },
    "preferSafe": true,
    "vehicleType": "FOUR_WHEELER"
  }
  ```
- **Response `200 OK`**:
  Returns GeoJSON line coordinates for both corridors, inundation exposure scores, elevation profiles, and diversion warnings.

---

## 5. Incident Reporting & Image Analysis

### `POST /api/reports` (Multipart / Form-Data)
Submit an on-the-ground flood report with optional photograph.
- **Form Fields**:
  - `latitude` (Float), `longitude` (Float), `locationName` (String)
  - `severity` (`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`)
  - `waterLevel` (`ANKLE_DEEP` | `KNEE_DEEP` | `WAIST_DEEP` | `SUBMERGED`)
  - `description` (String)
  - `image` (File: JPEG, PNG, WebP)
- **Automatic Execution**:
  Forwarded directly to FastAPI Neural Microservice on port 8000 for flood detection and depth verification.

### `GET /api/reports`
Query verified or active reports with optional spatial bounding box or district filters.

---

## 6. Official Alerts, Rivers & Telemetry

### `GET /api/alerts`
Retrieves active NDMA, IMD, and State Disaster Authority warning bulletins.

### `GET /api/rivers`
Central Water Commission (CWC) gauging stations across India (Brahmaputra, Yamuna, Adyar, Cooum, Godavari) reporting stage heights ($m$), danger levels, and discharge rates ($m^3/s$).

### `GET /api/districts`
National district registry returning risk scoring, closures, and relief camp capacities.

### `GET /api/system/health-deep`
Performs live end-to-end diagnostics across Node.js, PostgreSQL/Prisma, FastAPI, and weather pipelines.

---

## 7. Real-Time WebSocket Event Grid (Socket.IO)

Clients connect to `ws://localhost:5000/socket.io`:
- **`report.created`**: Broadcast when a citizen submits an inundation report.
- **`report.statusChanged`**: Broadcast when a moderator verifies or resolves an incident.
- **`alert.issued`**: Broadcast when a statutory warning polygon is published.
- **`road.blocked`**: Immediate routing invalidation event for impassable roads.
