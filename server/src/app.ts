import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';
import { ENV } from './config/env';

// Modular Feature Modules (Service / Repository Architecture)
import authRoutes from './auth/auth.routes';
import userRoutes from './users/users.routes';
import weatherRoutes from './weather/weather.routes';
import floodRoutes from './flood/flood.routes';
import routingRoutes from './routing/routing.routes';
import reportsRoutes from './reports/reports.routes';
import alertsRoutes from './alerts/alerts.routes';
import aiRoutes from './ai/ai.routes';
import analyticsRoutes from './analytics/analytics.routes';
import docsRoutes from './docs/docs.routes';
import copilotRoutes from './copilot/copilot.routes';
import districtsRoutes from './districts/districts.routes';
import riversRoutes from './rivers/rivers.routes';
import systemRoutes from './system/system.routes';

// Operational & Infrastructure Modules
import resourceRoutes from './routes/resourceRoutes';
import roadRoutes from './routes/roadRoutes';
import adminRoutes from './routes/adminRoutes';
import healthRoutes from './routes/healthRoutes';

export const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Allows inline Swagger UI bundle
  })
);

// CORS Configuration supporting Vercel frontend, Admin console, and local dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile webviews, server-to-server)
      if (!origin) return callback(null, true);
      if (
        ENV.NODE_ENV !== 'production' ||
        origin === ENV.CLIENT_URL ||
        origin === ENV.ADMIN_URL ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for public emergency transit data
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// General API Rate Limiting
app.use('/api', apiRateLimiter);

// Health check endpoints (GET /health and GET /api/health)
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// OpenAPI 3.0 Documentation & Swagger UI
app.use('/api', docsRoutes);
app.use('/docs', docsRoutes);

// Modular Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/flood', floodRoutes);
app.use('/api/routes', routingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/rivers', riversRoutes);
app.use('/api/system', systemRoutes);

// Supporting Infrastructure Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found.` });
});

// Centralized Error Handler
app.use(errorHandler);
