import request from 'supertest';
import { app } from '../src/app';

describe('Auth & Session API Integration', () => {
  const testEmail = `test_${Date.now()}@floodroute.ai`;

  it('POST /api/auth/register should register a citizen account and return tokens', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: 'SecurePassword123!',
      name: 'Test Citizen User',
      phone: '+91-9988776655',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail.toLowerCase());
  });

  it('POST /api/auth/login should authenticate valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'SecurePassword123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  it('POST /api/auth/login should reject incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid email or password');
  });

  it('POST /api/auth/forgot-password should return token stub', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: testEmail,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
