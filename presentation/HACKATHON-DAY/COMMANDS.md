# FloodRoute AI Platform — Presentation Day Commands

Only actual commands existing in `package.json` and project configuration are listed below:

### 1. Install Dependencies
```bash
npm install
```

### 2. Development (Concurrent Launch of All 4 Services)
```bash
npm run dev
```

### 3. Individual Service Start Commands
```bash
# Gateway Server (Port 5000)
npm run dev --workspace=server

# Citizen Web Portal (Port 8080)
npm run dev --workspace=apps/web

# Emergency Admin Console (Port 5174)
npm run dev --workspace=apps/admin

# Python AI Vision Service (Port 8000)
python -m uvicorn app.main:app --app-dir apps/ai-service --port 8000
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npm run db:generate

# Push Schema to Local SQLite Database
npm run db:push

# Seed Realistic Demonstration Scenarios
npm run db:seed
```

### 5. Automated Tests
```bash
npm test
```

### 6. TypeScript Lint & Typecheck
```bash
npm run lint
```

### 7. Production Build
```bash
npm run build
```
