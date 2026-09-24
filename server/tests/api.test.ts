import request from 'supertest';
import { app } from '../src/app';

describe('FloodRoute AI Core API Integration', () => {
  it('GET /health should return healthy status and microservice diagnostic array', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBeDefined();
    expect(res.body.services).toBeDefined();
    expect(res.body.services.weatherService).toBeDefined();
  });

  it('GET /api/weather/current should validate latitude and longitude query parameters', async () => {
    const res = await request(app).get('/api/weather/current');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Valid latitude');
  });

  it('GET /api/routes/geocode should return location results for Indian cities', async () => {
    const res = await request(app).get('/api/routes/geocode?q=Chennai');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.locations)).toBe(true);
    if (res.body.locations.length > 0) {
      expect(res.body.locations[0].country).toBe('India');
    }
  });
});
