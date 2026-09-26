# FloodRoute AI — Technical Stack Reference

> Exhaustive catalog of languages, frameworks, libraries, tools, and protocols powering the FloodRoute AI platform.

---

| Technology | Purpose | Where Used |
| :--- | :--- | :--- |
| **TypeScript** | Type-safe enterprise JavaScript superset | Backend server, Citizen Web, and Admin Dashboard |
| **Node.js** | High-performance asynchronous JavaScript runtime | Backend API Gateway (`server`) |
| **Express.js** | Fast, minimalist web framework for REST APIs | Central API Gateway routing & middleware |
| **React 18** | Declarative component-driven user interface library | Citizen Web Portal (`apps/web`) & Admin Portal (`apps/admin`) |
| **Vite** | Next-generation frontend build tool and dev server | Bundling and hot module replacement for both frontend apps |
| **Tailwind CSS** | Utility-first responsive CSS design system | Styling, animations, dark/light contrast across all web views |
| **MapLibre GL JS** | Open-source vector and raster mapping library | Interactive spatial map canvas, heatmaps, layer toggling |
| **OSRM** | Open Source Routing Machine for graph pathfinding | Calculating route polylines and turn-by-turn waypoints |
| **Prisma ORM** | Next-generation type-safe Node.js / TS database client | Database modeling, schema migrations, and queries |
| **PostgreSQL 16** | Robust relational database with spatial capabilities | Production datastore for incidents, users, shelters, alerts |
| **SQLite** | Zero-configuration serverless SQL database engine | Offline, local development, and zero-dependency testing |
| **Socket.IO** | Bi-directional low-latency event-based communication | Real-time incident broadcasting and live map marker sync |
| **Python 3.10+** | Scientific computing and machine learning language | AI Computer Vision Microservice (`apps/ai-service`) |
| **FastAPI** | High-performance modern Python web framework | Computer vision depth estimation API |
| **OpenCV** | Computer vision library for image processing | Water body contour detection and flood segmentation |
| **PyTorch** | Deep learning framework | Deep neural feature extraction for flood verification |
| **Argon2id** | State-of-the-art password hashing algorithm | Secure user and admin credential management |
| **JSON Web Tokens (JWT)** | Stateless cryptographically signed authentication | API request authorization and role enforcement |
| **Helmet.js** | HTTP header security hardening middleware | Cross-Site Scripting (XSS) and clickjacking prevention |
| **Recharts** | Composable React charting library built on SVG | Admin analytics dashboard and risk factor visualizations |
| **Lucide Icons** | Accessible, consistent SVG icon system | Navigation, hazard indicators, weather and emergency status icons |
| **Open-Meteo API** | Free weather forecast API with global radar integration | Real-time precipitation rate, humidity, wind, and rain total |
| **Nominatim API** | OpenStreetMap reverse and forward geocoding | Indian locality search and latitude/longitude translation |
| **Docker & Compose** | Container virtualization and orchestration | Unified multi-container deployment (`docker-compose.yml`) |
