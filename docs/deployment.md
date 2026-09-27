# FloodRoute AI — Enterprise Production Deployment Guide

## 1. Overview
FloodRoute AI is architected for zero-downtime multi-cloud deployment. The system can be deployed in containers via **Docker Compose**, or serverless/PaaS across **Vercel** (Citizen Portal & Admin Dashboard), **Render / Railway** (Node.js API Gateway & FastAPI Neural Service), and **Neon / Supabase** (PostgreSQL Database).

---

## 2. Environment Variables Specification

### 2.1. Backend Gateway (`server/.env`)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require&schema=public"
JWT_SECRET="<generate_secure_random_64_char_key>"
AI_SERVICE_URL="http://127.0.0.1:8000"
CLIENT_URL="https://floodroute.vercel.app"
ADMIN_URL="https://floodroute-admin.vercel.app"
DEMO_MODE=true
```

### 2.2. FastAPI AI Service (`apps/ai-service/.env`)
```bash
PORT=8000
HOST="0.0.0.0"
WORKERS=2
```

### 2.3. Frontend Citizen Portal (`apps/web/.env.production`)
```bash
VITE_API_URL="/api"
VITE_WS_URL="/"
VITE_MAP_STYLE_URL="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
```

---

## 3. Option A: Full-Stack Docker Compose (Recommended for Self-Hosting)

### Step 1: Clone & Configure
```bash
git clone https://github.com/floodroute/floodroute-ai.git
cd floodroute-ai
cp .env.example .env
```

### Step 2: Build & Launch Services
```bash
docker compose up -d --build
```

### Step 3: Run Database Migrations & Seeding
```bash
docker compose exec server npx prisma migrate deploy --schema=./prisma/schema.postgresql.prisma
docker compose exec server npx ts-node prisma/seed.ts
```

### Port Map:
- **Citizen PWA Portal**: `http://localhost:8080`
- **Admin Command Center**: `http://localhost:5174`
- **Central API Gateway & Swagger Docs**: `http://localhost:5000/api/docs`
- **FastAPI Vision Service**: `http://localhost:8000/docs`
- **PostgreSQL Datastore**: `localhost:5432`

---

## 4. Option B: Cloud PaaS Deployment

### 4.1. Database: Neon / Supabase PostgreSQL
1. Create a project at [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the Connection Pooling or Direct Connection String:
   ```
   postgresql://postgres:[PASSWORD]@[HOST].neon.tech/floodroute?sslmode=require
   ```
3. Run migrations from your terminal:
   ```bash
   DATABASE_URL="<your_neon_url>" npx prisma migrate deploy --schema=./prisma/schema.postgresql.prisma
   DATABASE_URL="<your_neon_url>" npx ts-node prisma/seed.ts
   ```

### 4.2. Backend & AI Service: Render Blueprint
1. Connect your repository to [Render](https://render.com).
2. Click **New +** $\to$ **Blueprint**.
3. Select `render.yaml` in the root directory.
4. Render automatically spins up:
   - `floodroute-postgres` (Managed PostgreSQL 16)
   - `floodroute-gateway` (Node.js 20 Gateway with automatic health probes)
   - `floodroute-ai-service` (FastAPI Python 3.10 microservice)

### 4.3. Frontend & Admin: Vercel
1. Import repository on [Vercel](https://vercel.com).
2. For the **Citizen Portal** (Standard Deployment via root `vercel.json`):
   - Leave Root Directory as `./` (repository root)
   - Vercel automatically uses `vercel.json` (`npm run build:web` / `apps/web/dist`)
   - Or if Root Directory is set to `apps/web`:
     - Build Command: `cd ../.. && npm run build --workspace=@floodroute/shared && npm run build --workspace=@floodroute/web`
     - Output Directory: `dist`
3. For the **Admin Command Center**:
   - Create a second Vercel project with Root Directory `apps/admin`.
   - Build Command: `cd ../.. && npm run build --workspace=@floodroute/shared && npm run build --workspace=@floodroute/admin`
   - Output Directory: `dist`

---

## 5. Production Health Verification
Check all service health indicators:
```bash
curl -f https://<your-backend-url>/health
curl -f https://<your-backend-url>/api/system/health-deep
curl -f https://<your-ai-url>/health
```
All endpoints will return HTTP `200 OK` with JSON telemetry.
