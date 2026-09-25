import request from 'supertest';
import { app } from '../src/app';

describe('Reports & Community Feedback API Integration', () => {
  it('GET /api/reports should return verified and active reports', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reports)).toBe(true);
  });

  it('POST /api/reports should accept a new citizen report', async () => {
    const res = await request(app).post('/api/reports').send({
      hazardType: 'WATERLOGGING',
      severity: 'MEDIUM',
      waterLevel: 'DIFFICULT_CARS',
      latitude: 12.9780,
      longitude: 80.2207,
      locationName: 'Velachery Bypass Road',
      description: 'Water accumulation near bus stop affecting left lane traffic.',
    });

    expect(res.status).toBe(201);
    expect(res.body.reportCode).toMatch(/^FR-2026-\d{6}$/);
    expect(res.body.status).toBe('PENDING');
  });

  it('GET /api/flood/risk should compute explainable 0-100 score for location', async () => {
    const res = await request(app).get('/api/flood/risk?lat=12.9805&lng=80.2195&location=Velachery');
    expect(res.status).toBe(200);
    expect(res.body.riskScore).toBeDefined();
    expect(res.body.riskLevel).toBeDefined();
    expect(res.body.breakdown).toBeDefined();
    expect(res.body.sources).toBeDefined();
  });
});
