import { Request, Response } from 'express';
import { RoutingService, routingService } from './routing.service';
import { AuthRequest } from '../middleware/auth';

export class RoutingController {
  constructor(private service: RoutingService = routingService) {}

  calculateRoute = async (req: AuthRequest, res: Response) => {
    try {
      const {
        originLat,
        originLng,
        destLat,
        destLng,
        originName,
        destName,
        avoidFlooded = true,
        avoidHighRisk = true,
        preferSafer = true,
        preferFastest = false,
        vehicleType = 'CAR',
      } = req.body;

      if (
        originLat === undefined ||
        originLng === undefined ||
        destLat === undefined ||
        destLng === undefined
      ) {
        return res.status(400).json({ error: 'Origin (lat, lng) and Destination (lat, lng) coordinates are required.' });
      }

      const oLat = parseFloat(originLat);
      const oLng = parseFloat(originLng);
      const dLat = parseFloat(destLat);
      const dLng = parseFloat(destLng);

      if (isNaN(oLat) || isNaN(oLng) || isNaN(dLat) || isNaN(dLng)) {
        return res.status(400).json({ error: 'Coordinates must be valid numbers.' });
      }

      const userId = req.user?.userId;

      const { options, requestId } = await this.service.calculateRoutes({
        userId,
        originLat: oLat,
        originLng: oLng,
        destLat: dLat,
        destLng: dLng,
        originName,
        destName,
        avoidFlooded: Boolean(avoidFlooded),
        avoidHighRisk: Boolean(avoidHighRisk),
        preferSafer: Boolean(preferSafer),
        preferFastest: Boolean(preferFastest),
        vehicleType,
      });

      return res.json({
        requestId,
        options,
        timestamp: new Date().toISOString(),
        summary: {
          safestRouteId: options.find((o) => o.isRecommended)?.id || options[0]?.id,
          totalCalculated: options.length,
          origin: { lat: oLat, lng: oLng, name: originName },
          destination: { lat: dLat, lng: dLng, name: destName },
        },
      });
    } catch (error: any) {
      console.error('[RoutingController] Route calculation failure:', error);
      return res.status(500).json({ error: error.message || 'Failed to calculate flood-aware route.' });
    }
  };

  getHistory = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const history = await this.service.getHistory(userId);
      return res.json({ history });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve route history.' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const route = await this.service.getById(id);
      if (!route) {
        return res.status(404).json({ error: 'Route not found.' });
      }
      return res.json({ route });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve route.' });
    }
  };

  searchLocations = async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string) || '';
      if (!q.trim()) return res.json({ locations: [] });
      const { geocodingService } = await import('../services/geocodingService');
      const results = await geocodingService.search(q);
      return res.json({ locations: results });
    } catch (error: any) {
      return res.status(500).json({ error: 'Geocoding search failed.' });
    }
  };
}

export const routingController = new RoutingController();
