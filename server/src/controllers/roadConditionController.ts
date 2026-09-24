import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { roadConditionSchema } from '@floodroute/shared';
import { socketService } from '../services/socketService';
import { auditService } from '../services/auditService';

export class RoadConditionController {
  async getRoadConditions(req: Request, res: Response) {
    const { condition, severity } = req.query;

    const where: any = {};
    if (condition) where.condition = String(condition);
    if (severity) where.severity = String(severity);

    const roads = await prisma.roadCondition.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ roads });
  }

  async createRoadCondition(req: AuthenticatedRequest, res: Response) {
    const validated = roadConditionSchema.parse(req.body);

    const road = await prisma.roadCondition.create({
      data: {
        roadName: validated.roadName,
        locationName: validated.locationName,
        condition: validated.condition,
        severity: validated.severity,
        reason: validated.reason,
        latitude: validated.latitude,
        longitude: validated.longitude,
        expectedResolutionTime: validated.expectedResolutionTime ? new Date(validated.expectedResolutionTime) : null,
        updatedBy: req.user?.email || 'Operations Admin',
        isOfficial: true,
        isDemo: false,
      },
    });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'ROAD_CONDITION_CREATED',
      entity: 'RoadCondition',
      entityId: road.id,
      details: `${road.roadName} marked as ${road.condition} (${road.reason})`,
      ipAddress: req.ip,
    });

    socketService.broadcast('road.updated', road);

    return res.status(201).json({ message: 'Road condition recorded', road });
  }

  async updateRoadCondition(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { condition, severity, reason } = req.body;

    const road = await prisma.roadCondition.update({
      where: { id },
      data: {
        ...(condition ? { condition } : {}),
        ...(severity ? { severity } : {}),
        ...(reason ? { reason } : {}),
        updatedBy: req.user?.email || 'Admin',
      },
    });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'ROAD_CONDITION_UPDATED',
      entity: 'RoadCondition',
      entityId: road.id,
      details: `Condition updated to ${road.condition}`,
      ipAddress: req.ip,
    });

    socketService.broadcast('road.updated', road);

    return res.json({ message: 'Road condition updated', road });
  }

  async deleteRoadCondition(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await prisma.roadCondition.delete({ where: { id } });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'ROAD_CONDITION_DELETED',
      entity: 'RoadCondition',
      entityId: id,
      ipAddress: req.ip,
    });

    socketService.broadcast('road.updated', { id, deleted: true });

    return res.json({ message: 'Road condition removed' });
  }
}

export const roadConditionController = new RoadConditionController();
