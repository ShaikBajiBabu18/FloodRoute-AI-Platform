import { Request, Response } from 'express';
import { FloodService, floodService } from './flood.service';

export class FloodController {
  constructor(private service: FloodService = floodService) {}

  getRisk = async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const locationName = (req.query.location as string) || 'Target Location';

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) parameters are required.' });
      }

      const risk = await this.service.calculateRisk(lat, lng, locationName);
      return res.json(risk);
    } catch (err: any) {
      console.error('[FloodController] Risk calculation error:', err);
      return res.status(500).json({
        error: 'Official flood data temporarily unavailable.',
        details: err.message,
      });
    }
  };

  getZones = async (req: Request, res: Response) => {
    try {
      const zones = await this.service.getCriticalZones();
      return res.json({ zones });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve flood zones.' });
    }
  };

  getFloodReports = async (req: Request, res: Response) => {
    try {
      const reports = await this.service.getVerifiedReports();
      return res.json({ reports });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve flood reports.' });
    }
  };

  getRiverStages = async (req: Request, res: Response) => {
    try {
      const stages = await this.service.getRiverStages();
      return res.json({ stages });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve river stages.' });
    }
  };

  predictFlood = async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string || req.body.lat);
      const lng = parseFloat(req.query.lng as string || req.body.lng);
      const locationName = (req.query.location as string || req.body.location) || 'Target Sector';

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) parameters are required.' });
      }

      const prediction = await this.service.predictFlood({
        lat,
        lng,
        locationName,
        elevationM: req.query.elevation ? parseFloat(req.query.elevation as string) : undefined,
        riverProximityKm: req.query.riverProx ? parseFloat(req.query.riverProx as string) : undefined,
      });

      return res.json(prediction);
    } catch (err: any) {
      console.error('[FloodController] Flood prediction error:', err);
      return res.status(500).json({ error: 'Failed to generate AI flood prediction.' });
    }
  };
}

export const floodController = new FloodController();
