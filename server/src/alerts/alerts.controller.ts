import { Request, Response } from 'express';
import { AlertsService, alertsService } from './alerts.service';
import { AuthRequest } from '../middleware/auth';
import { alertCreateSchema } from '@floodroute/shared';

export class AlertsController {
  constructor(private service: AlertsService = alertsService) {}

  getAlerts = async (req: Request, res: Response) => {
    try {
      const { activeOnly = 'true', severity, source, state } = req.query;
      const alerts = await this.service.getAlerts({
        activeOnly: activeOnly === 'true',
        severity: severity as string | undefined,
        source: source as string | undefined,
        state: state as string | undefined,
      });
      return res.json({ alerts });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve alerts.' });
    }
  };

  getAlertById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const alert = await this.service.getAlertById(id);
      return res.json({ alert });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Alert not found.' });
    }
  };

  createAlert = async (req: AuthRequest, res: Response) => {
    try {
      const validated = alertCreateSchema.parse(req.body);
      const alert = await this.service.createAlert(req.user!.userId, validated, req.ip);
      return res.status(201).json({ message: 'Platform alert published successfully.', alert });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to create alert.' });
    }
  };

  updateAlert = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive, expiryTime } = req.body;
      const alert = await this.service.updateAlert(
        req.user!.userId,
        id,
        {
          ...(typeof isActive === 'boolean' ? { isActive } : {}),
          ...(expiryTime ? { expiryTime: new Date(expiryTime) } : {}),
        },
        req.ip
      );
      return res.json({ message: 'Alert updated.', alert });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to update alert.' });
    }
  };

  deleteAlert = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteAlert(req.user!.userId, id, req.ip);
      return res.json({ message: 'Alert successfully deactivated.' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to delete alert.' });
    }
  };
}

export const alertsController = new AlertsController();
