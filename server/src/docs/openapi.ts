export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'FloodRoute AI - Disaster Intelligence & Flood-Aware Routing API',
    version: '2.0.0',
    description:
      'Enterprise-grade disaster response and routing platform for India. Provides real-time weather telemetry, explainable flood-risk intelligence, OSRM hazard routing, community verification workflows, and NDRF emergency resource mapping.',
    contact: {
      name: 'FloodRoute AI Operations Command',
      url: 'https://floodroute.ai',
      email: 'operations@floodroute.ai',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
    {
      url: 'https://api.floodroute.ai',
      description: 'Production Cloud Gateway',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['CITIZEN', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] },
        },
      },
      FloodReport: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          reportCode: { type: 'string', example: 'FR-2026-000182' },
          hazardType: { type: 'string', example: 'FLOODED_ROAD' },
          severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          waterLevel: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          locationName: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED'] },
        },
      },
      RouteRequest: {
        type: 'object',
        required: ['originLat', 'originLng', 'destLat', 'destLng'],
        properties: {
          originLat: { type: 'number' },
          originLng: { type: 'number' },
          destLat: { type: 'number' },
          destLng: { type: 'number' },
          avoidFlooded: { type: 'boolean', default: true },
          preferSafer: { type: 'boolean', default: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'System Health Check',
        responses: {
          '200': { description: 'All systems operational' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register new citizen or emergency officer account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'User registered' } },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Authenticate and receive access + refresh JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Authenticated successfully' } },
      },
    },
    '/api/weather/live': {
      get: {
        summary: 'Get live weather with IMD & Open-Meteo multi-provider fallback',
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' } },
        ],
        responses: { '200': { description: 'Current atmospheric and precipitation telemetry' } },
      },
    },
    '/api/flood/risk': {
      get: {
        summary: 'Calculate explainable 0-100 multi-factor flood risk score',
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'location', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Explainable risk assessment with provenance' } },
      },
    },
    '/api/routes/calculate': {
      post: {
        summary: 'Calculate flood-aware routes with OSRM and hazard buffer intersections',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RouteRequest' },
            },
          },
        },
        responses: { '200': { description: 'Calculated route alternatives with risk scoring' } },
      },
    },
    '/api/reports': {
      get: {
        summary: 'Query crowd-sourced and verified flood hazard reports',
        responses: { '200': { description: 'List of reports' } },
      },
      post: {
        summary: 'Submit a new citizen flood report with optional photo upload',
        responses: { '201': { description: 'Report created and queued for AI analysis' } },
      },
    },
    '/api/alerts': {
      get: {
        summary: 'List active NDMA Sachet and official disaster alerts',
        responses: { '200': { description: 'List of disaster alerts' } },
      },
    },
    '/api/admin/analytics/overview': {
      get: {
        summary: 'Aggregated analytics and incident command metrics (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Aggregated dashboard telemetry' } },
      },
    },
  },
};
