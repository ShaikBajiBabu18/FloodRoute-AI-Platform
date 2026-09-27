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

// Root Gateway Route (GET /)
app.get('/', (req, res) => {
  const webAppUrl = ENV.CLIENT_URL || 'http://localhost:8080';
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FloodRoute AI — API Gateway</title>
        <style>
          body { margin: 0; background: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
          .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 40px; max-width: 520px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          h1 { margin: 0 0 10px; font-size: 26px; font-weight: 800; color: #ffffff; }
          p { margin: 0 0 28px; color: #94a3b8; font-size: 14px; line-height: 1.5; }
          .btn-group { display: flex; flex-direction: column; gap: 12px; }
          .btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 20px; border-radius: 14px; font-weight: 700; font-size: 14px; text-decoration: none; transition: all 0.2s; }
          .btn-primary { background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; box-shadow: 0 10px 20px -5px rgba(2, 132, 199, 0.3); }
          .btn-primary:hover { background: linear-gradient(135deg, #0369a1, #1d4ed8); transform: translateY(-1px); }
          .btn-secondary { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
          .btn-secondary:hover { background: #334155; color: #ffffff; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> API Gateway Active & Healthy</div>
          <h1>FloodRoute AI Platform</h1>
          <p>Backend API services, flood risk inference engine, and real-time transit routing are operational.</p>
          <div class="btn-group">
            <a href="${webAppUrl}" class="btn btn-primary">&#8594; Open Citizen Web App (${webAppUrl})</a>
            <a href="/health" class="btn btn-secondary">System Health Status (/health)</a>
            <a href="/docs" class="btn btn-secondary">Interactive Swagger Docs (/docs)</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      name: 'FloodRoute AI Platform — API Gateway',
      status: 'ONLINE',
      version: '1.0.0',
      webAppUrl,
      endpoints: {
        health: '/health',
        docs: '/docs',
        api: '/api',
      },
    });
  }
});

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
