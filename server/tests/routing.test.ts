import request from 'supertest';
import { app } from '../src/app';

describe('Routing & Hazard Intersections API Integration', () => {
  it('POST /api/routes/calculate should return multiple route options with risk scoring', async () => {
    const res = await request(app).post('/api/routes/calculate').send({
      originLat: 12.9805,
      originLng: 80.2195,
      destLat: 13.0827,
      destLng: 80.2707,
      originName: 'Velachery, Chennai',
      destName: 'Chennai Central',
      preferSafer: true,
    });

    expect(res.status).toBe(200);
    expect(res.body.options).toBeDefined();
    expect(Array.isArray(res.body.options)).toBe(true);
    expect(res.body.options.length).toBeGreaterThan(0);
    expect(res.body.options[0].riskScore).toBeDefined();
    expect(res.body.options[0].distanceKm).toBeGreaterThan(0);
    expect(res.body.options[0].durationMinutes).toBeGreaterThan(0);
  });

  it('POST /api/routes/calculate should validate missing coordinates', async () => {
    const res = await request(app).post('/api/routes/calculate').send({
      originLat: 12.9805,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('coordinates are required');
  });
});
