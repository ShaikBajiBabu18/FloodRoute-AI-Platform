import { Response } from 'express';
import { AnalyticsService, analyticsService } from './analytics.service';
import { AuthRequest } from '../middleware/auth';

export class AnalyticsController {
  constructor(private service: AnalyticsService = analyticsService) {}

  getOverview = async (req: AuthRequest, res: Response) => {
    try {
      const analytics = await this.service.getDashboardAnalytics();
      return res.json(analytics);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve analytics overview.' });
    }
  };

  getStats = async (req: AuthRequest, res: Response) => {
    try {
      const stats = await this.service.getStats();
      return res.json({ stats });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve system stats.' });
    }
  };
}

export const analyticsController = new AnalyticsController();
