# FloodRoute AI — REST API Reference Specification

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new citizen profile.
```json
{
  "name": "Rohan Verma",
  "email": "rohan@example.com",
  "password": "Password123!",
  "phone": "+91-9876543210"
}
```

### `POST /api/auth/login`
Authenticates a user or incident command operator. Returns JWT bearer token.
```json
{
  "email": "admin@floodroute.ai",
  "password": "ChangeMe123!"
}
```

### `GET /api/auth/me`
Headers: `Authorization: Bearer <token>`
Returns authenticated identity and roles.

---

## 2. Weather & Storm Telemetry (`/api/weather`)

### `GET /api/weather/current?lat=13.08&lng=80.27`
Returns 10-parameter atmospheric observations, source attribution, and freshness status.

### `GET /api/weather/forecast?lat=13.08&lng=80.27`
Returns 24-hour hourly precipitation curves and 7-day outlook.

---

## 3. Flood Intelligence & Risk Engine (`/api/flood`)

### `GET /api/flood/risk?lat=13.08&lng=80.27&location=Chennai`
Runs multi-vector explainable risk calculations across rainfall, CWC river stages, nearby reports, and active alerts.

---

## 4. Community Flood Reports (`/api/reports`)

### `POST /api/reports`
Content-Type: `multipart/form-data`
Payload fields: `hazardType`, `severity`, `waterLevel`, `locationName`, `latitude`, `longitude`, `description`, `photo` (file).
Generates `reportCode` (e.g. `FR-2026-000182`) and triggers asynchronous OpenCV vision analysis.

### `GET /api/reports`
Query params: `status`, `severity`, `hazardType`, `state`, `search`, `limit`.

### `PUT /api/reports/:id/status` (Admin / Moderator Only)
```json
{
  "status": "VERIFIED",
  "severity": "CRITICAL",
  "notes": "Verified against traffic camera telemetry."
}
```

---

## 5. Route Planner (`/api/routes`)

### `POST /api/routes`
```json
{
  "originLat": 12.9805,
  "originLng": 80.2195,
  "destLat": 12.9892,
  "destLng": 80.2483,
  "avoidFlooded": true,
  "avoidHighRisk": true,
  "preferSafer": true
}
```
Returns alternative routes, GeoJSON geometry, distance, duration, hazard counts, and explainable risk reasons.

### `GET /api/routes/geocode?q=Velachery`
India-wide geocoded location lookup via OpenStreetMap Nominatim.

---

## 6. Official & Platform Alerts (`/api/alerts`)

### `GET /api/alerts`
Returns active statutory alerts (NDMA/SACHET, IMD, CWC) and platform advisories.

### `POST /api/alerts` (Admin Only)
Broadcasts a new emergency advisory stamped as `FloodRoute AI Platform Alert`.

---

## 7. Road Conditions (`/api/roads`)

### `GET /api/roads`
Returns current road blockages, submerged sectors, and municipal closures.

### `POST /api/roads` (Admin Only)
Records an impassable or caution sector for real-time route engine avoidance.

---

## 8. Incident Command Metrics (`/api/admin`)

- `GET /api/admin/dashboard`: Real-time KPI counters from database.
- `GET /api/admin/analytics`: Severity, state, and status distributions for Recharts.
- `GET /api/admin/ai-analytics`: Computer vision classification statistics.
- `GET /api/admin/audit-logs`: Immutable administrative audit trail.

---

## 9. Diagnostic Health (`/health` & `/api/health`)
Returns live connectivity state for database, weather telemetry, routing grid, alert pipelines, and AI vision microservice.
