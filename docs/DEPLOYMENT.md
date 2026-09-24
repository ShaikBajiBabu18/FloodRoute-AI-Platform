# FloodRoute AI — Deployment & DevOps Guide

## 1. Containerized Multi-Service Deployment (Docker Compose)

The complete ecosystem can be launched using the provided `docker-compose.yml`.

```bash
# Build and run all services in detached mode
docker compose up -d --build
```

### Services Deployed:
1. `floodroute-postgres`: PostgreSQL 15 Alpine with persistent volume.
2. `floodroute-ai-service`: Python 3.10 OpenCV FastAPI microservice on port 8000.
3. `floodroute-server`: Node.js Express & Socket.IO backend gateway on port 5000.
4. `floodroute-web`: Citizen Web App built and served via NGINX on port 5173 (80 internal).
5. `floodroute-admin`: Incident Command Dashboard built and served via NGINX on port 5174 (80 internal).

---

## 2. Cloud Production Deployment Checklist

1. **Environment Variables**:
   - Set strong `JWT_SECRET`.
   - Update `DATABASE_URL` with SSL connection strings.
   - Configure MapTiler or Mapbox tokens if proprietary custom vector styles are desired.

2. **Reverse Proxy (NGINX / Cloudflare)**:
   - Configure SSL certificates (Let's Encrypt).
   - Set up WebSocket proxying (`Upgrade $http_upgrade; Connection "upgrade";`).
   - Limit upload sizes to 15MB for flood evidence images.

3. **Database Backups**:
   - Establish daily automated `pg_dump` backups for `floodroute` database.
