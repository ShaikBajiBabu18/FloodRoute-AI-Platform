import dotenv from 'dotenv';
import path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local .env

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'floodroute_jwt_secret_key_india_disaster_2026_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  ROUTING_API_URL: process.env.ROUTING_API_URL || 'https://router.project-osrm.org',
  GEOCODING_API_URL: process.env.GEOCODING_API_URL || 'https://nominatim.openstreetmap.org',
  OPEN_METEO_API_URL: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1',
  IMD_API_URL: process.env.IMD_API_URL || '',
  IMD_API_KEY: process.env.IMD_API_KEY || '',
  CWC_API_URL: process.env.CWC_API_URL || '',
  NDMA_API_URL: process.env.NDMA_API_URL || '',
  DEMO_MODE: process.env.DEMO_MODE !== 'false',
  ENABLE_AI_SERVICE: process.env.ENABLE_AI_SERVICE !== 'false',
};
