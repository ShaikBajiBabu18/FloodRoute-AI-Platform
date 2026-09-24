import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { alertCreateSchema } from '@floodroute/shared';
import { socketService } from '../services/socketService';
import { auditService } from '../services/auditService';

export class AlertController {
  async getAlerts(req: Request, res: Response) {
    const { activeOnly = 'true', severity, source, state } = req.query;

    const where: any = {};
    if (activeOnly === 'true') where.isActive = true;
    if (severity) where.severity = String(severity);
    if (source) where.source = String(source);
    if (state) where.state = { contains: String(state) };

    const alerts = await prisma.disasterAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ alerts });
  }

  async getAlertById(req: Request, res: Response) {
    const { id } = req.params;
    const alert = await prisma.disasterAlert.findUnique({ where: { id } });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    return res.json({ alert });
  }

  async createPlatformAlert(req: AuthenticatedRequest, res: Response) {
    const validated = alertCreateSchema.parse(req.body);

    const alert = await prisma.disasterAlert.create({
      data: {
        title: validated.title,
        description: validated.description,
        severity: validated.severity,
        source: 'PLATFORM_FLOODROUTE',
        sourceLabel: 'FloodRoute AI Platform Alert',
        locationName: validated.locationName,
        state: validated.state || null,
        district: validated.district || null,
        latitude: validated.latitude,
        longitude: validated.longitude,
        radiusKm: validated.radiusKm,
        startTime: validated.startTime ? new Date(validated.startTime) : new Date(),
        expiryTime: validated.expiryTime ? new Date(validated.expiryTime) : new Date(Date.now() + 24 * 3600000),
        isActive: true,
        isOfficial: false,
        isDemo: false,
      },
    });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'ALERT_CREATED',
      entity: 'DisasterAlert',
      entityId: alert.id,
      details: `Created Platform Alert: "${alert.title}" in ${alert.locationName}`,
      ipAddress: req.ip,
    });

    socketService.broadcast('alert.created', alert);

    return res.status(201).json({
      message: 'Platform alert published successfully',
      alert,
    });
  }

  async updateAlertStatus(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { isActive, expiryTime } = req.body;

    const alert = await prisma.disasterAlert.update({
      where: { id },
      data: {
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
        ...(expiryTime ? { expiryTime: new Date(expiryTime) } : {}),
      },
    });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'ALERT_UPDATED',
      entity: 'DisasterAlert',
      entityId: alert.id,
      details: `Alert isActive: ${isActive}`,
      ipAddress: req.ip,
    });

    socketService.broadcast('alert.updated', alert);
    return res.json({ message: 'Alert updated', alert });
  }
}

export const alertController = new AlertController();
