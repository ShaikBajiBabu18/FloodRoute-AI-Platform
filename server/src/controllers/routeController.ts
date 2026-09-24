import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { routingService } from '../services/routingService';
import { geocodingService } from '../services/geocodingService';
import { routeQuerySchema } from '@floodroute/shared';

export class RouteController {
  async calculateRoutes(req: AuthenticatedRequest, res: Response) {
    const validated = routeQuerySchema.parse(req.body);

    try {
      const routes = await routingService.calculateRoutes({
        originLat: validated.originLat,
        originLng: validated.originLng,
        destLat: validated.destLat,
        destLng: validated.destLng,
        avoidFlooded: validated.avoidFlooded,
        avoidHighRisk: validated.avoidHighRisk,
        preferSafer: validated.preferSafer,
        preferFastest: validated.preferFastest,
      });

      // Save route request and results if authenticated or for history
      const savedRequest = await prisma.routeRequest.create({
        data: {
          userId: req.user?.userId || null,
          originLat: validated.originLat,
          originLng: validated.originLng,
          originName: validated.originName || 'Origin',
          destLat: validated.destLat,
          destLng: validated.destLng,
          destName: validated.destName || 'Destination',
          avoidFlooded: validated.avoidFlooded,
          avoidHighRisk: validated.avoidHighRisk,
          preferSafer: validated.preferSafer,
          results: {
            create: routes.map(r => ({
              title: r.title,
              distanceKm: r.distanceKm,
              durationMinutes: r.durationMinutes,
              floodRisk: r.floodRisk,
              weatherRisk: r.weatherRisk,
              overallRisk: r.overallRisk,
              hazardsCount: r.hazardsCount,
              officialAlertsCount: r.officialAlertsCount,
              riskScore: r.riskScore,
              riskReasonsJson: JSON.stringify(r.riskReasons),
              geometryJson: JSON.stringify(r.geometry),
              stepsJson: JSON.stringify(r.steps),
              isRecommended: r.isRecommended,
            })),
          },
        },
      });

      return res.json({
        requestId: savedRequest.id,
        routes,
        meta: {
          evaluatedAt: new Date().toISOString(),
          riskEngine: 'FloodRoute AI Explainable Multi-Vector Correlative Engine',
          disclaimer: 'Calculated advisory route. Ground conditions can alter abruptly during monsoon cloudbursts.',
        },
      });
    } catch (err: any) {
      console.error('[RouteController] Route computation failed:', err);
      return res.status(502).json({
        error: 'Route could not be calculated. Try another location.',
        details: err.message,
      });
    }
  }

  async getRouteById(req: Request, res: Response) {
    const { id } = req.params;
    const request = await prisma.routeRequest.findUnique({
      where: { id },
      include: { results: true },
    });

    if (!request) {
      return res.status(404).json({ error: 'Route request record not found.' });
    }

    const formattedRoutes = request.results.map(r => ({
      id: r.id,
      title: r.title,
      distanceKm: r.distanceKm,
      durationMinutes: r.durationMinutes,
      floodRisk: r.floodRisk,
      weatherRisk: r.weatherRisk,
      overallRisk: r.overallRisk,
      hazardsCount: r.hazardsCount,
      officialAlertsCount: r.officialAlertsCount,
      riskScore: r.riskScore,
      riskReasons: JSON.parse(r.riskReasonsJson),
      geometry: JSON.parse(r.geometryJson),
      steps: r.stepsJson ? JSON.parse(r.stepsJson) : [],
      isRecommended: r.isRecommended,
    }));

    return res.json({ request, routes: formattedRoutes });
  }

  async searchLocations(req: Request, res: Response) {
    const q = (req.query.q as string) || '';
    if (!q.trim()) return res.json({ locations: [] });

    const results = await geocodingService.search(q);
    return res.json({ locations: results });
  }
}

export const routeController = new RouteController();
