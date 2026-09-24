# FloodRoute AI — Database Architecture & Schema Specification

## 1. Relational Entity Data Model

FloodRoute AI leverages Prisma ORM with support for PostgreSQL (Production / Docker) and SQLite (Local Development).

```
                      +-------------------+
                      |       User        |
                      +-------------------+
                                | 1
                                |
                   +------------+------------+
                   |                         |
                   v *                       v *
        +-------------------+     +-------------------+
        |   SavedLocation   |     |    FloodReport    |
        +-------------------+     +-------------------+
                                             | 1
                                             |
                                +------------+------------+
                                |                         |
                                v 1                       v *
                     +-------------------+     +-------------------+
                     |    AIAnalysis     |     |    FloodImage     |
                     +-------------------+     +-------------------+

       +-------------------+     +-------------------+     +-------------------+
       |   DisasterAlert   |     |   RoadCondition   |     | EmergencyResource |
       +-------------------+     +-------------------+     +-------------------+

       +-------------------+     +-------------------+     +-------------------+
       |   WeatherRecord   |     |   RouteRequest    |     |     AuditLog      |
       +-------------------+     +-------------------+     +-------------------+
                                           | 1
                                           v *
                                 +-------------------+
                                 |    RouteResult    |
                                 +-------------------+
```

---

## 2. Table Indexing Strategy for Geographic High-Throughput

To ensure sub-10ms lookup times across millions of geographic records during monsoon surges, B-tree indexes are implemented across:
- `FloodReport(latitude, longitude)`: Spatial bounding box queries.
- `FloodReport(severity, status)`: Incident triage filters.
- `RoadCondition(latitude, longitude, condition)`: Routing engine corridor collision checks.
- `DisasterAlert(latitude, longitude, isActive)`: Proximity warning lookups.
- `EmergencyResource(latitude, longitude, category)`: Proximity sorting.

---

## 3. Database Migration & Switching Provider

### Local SQLite Zero-Config Mode
```bash
# Push schema to dev.db
npx prisma db push --schema=./prisma/schema.prisma

# Seed data
npx ts-node prisma/seed.ts
```

### PostgreSQL Production Mode
```bash
# Push schema to PostgreSQL container
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/floodroute?schema=public" \
npx prisma db push --schema=./prisma/schema.postgresql.prisma
```
