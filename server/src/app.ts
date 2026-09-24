import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import weatherRoutes from './routes/weatherRoutes';
import floodRoutes from './routes/floodRoutes';
import reportRoutes from './routes/reportRoutes';
import routeRoutes from './routes/routeRoutes';
import alertRoutes from './routes/alertRoutes';
import resourceRoutes from './routes/resourceRoutes';
import roadRoutes from './routes/roadRoutes';
import adminRoutes from './routes/adminRoutes';
import aiRoutes from './routes/aiRoutes';
import healthRoutes from './routes/healthRoutes';

export const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
app.use(cors({
  origin: true, // Allow frontend dev servers and mobile browsers
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// General API Rate Limiting
app.use('/api', apiRateLimiter);

// Health check endpoints (prompt requirement: GET /health and GET /api/health)
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/flood', floodRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found.` });
});

// Centralized Error Handler
app.use(errorHandler);
