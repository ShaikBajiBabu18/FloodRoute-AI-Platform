# FloodRoute AI Platform — Final Demo Checklist

**Presenter Pre-Flight Protocol:** Verify every item before stepping up to present to hackathon judges.

---

- [x] **Application starts:** Gateway (5000), Web (8080), Admin (5174), and AI (8000) respond with HTTP 200.
- [x] **Correct environment:** Node.js v20+, Python 3.10+ active, correct ports free.
- [x] **Database available:** SQLite `dev.db` mounted and seeded via Prisma ORM.
- [x] **Map loads:** Leaflet GIS canvas renders smooth pan/zoom and layer toggles across India.
- [x] **Demo location tested:** Velachery Basin, Chennai (`12.9805, 80.2195`) tested for both live and demo mode.
- [x] **Weather works:** Open-Meteo telemetry returns real-time rain ($mm/h$), temperature, and wind.
- [x] **Risk works:** 0–100 deterministic risk engine computes score and factor breakdown.
- [x] **Route works:** Route planner calculates Velachery to Chennai Central; green **Elevated Bypass** highlighted.
- [x] **Emergency services work:** Emergency Hub displays one-tap 112 calling and nearest high-ground shelters.
- [x] **AI works:** Copilot chat answers flood risk queries with contextual advice and offline fallbacks.
- [x] **Admin works:** Admin console loads at Port 5174 with incident moderation and alert broadcasting.
- [x] **Mobile checked:** Responsive `<lg` layout verified with sticky bottom navigation bar (`MobileNav.tsx`).
- [x] **Backup demo tested:** 60-second backup pitch and offline Demo Mode verified with zero network connectivity.
- [x] **Browser console checked:** Zero uncaught exceptions; zero React runtime crashes.
- [x] **No secrets exposed:** `.gitignore` strictly protects `.env*`, database files, and build artifacts.
- [x] **GitHub latest commit verified:** Remote repository synchronized on branch `main`.
