import { AlertsRepository, alertsRepository } from './alerts.repository';
import { socketService } from '../websocket/socket.service';
import { prisma } from '../config/database';

export class AlertsService {
  constructor(private repo: AlertsRepository = alertsRepository) {}

  async getAlerts(params: {
    activeOnly?: boolean;
    severity?: string;
    source?: string;
    state?: string;
    limit?: number;
  }) {
    return this.repo.getAlerts(params);
  }

  async getAlertById(id: string) {
    const alert = await this.repo.getById(id);
    if (!alert) throw new Error('Alert not found.');
    return alert;
  }

  async createAlert(adminId: string, data: any, ipAddress?: string) {
    const alert = await this.repo.createAlert(data);

    // Record immutable audit log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'ALERT_CREATED',
        entity: 'DisasterAlert',
        entityId: alert.id,
        details: `Created Emergency Alert: "${alert.title}" in ${alert.locationName}`,
        ipAddress: ipAddress || null,
      },
    });

    // Broadcast in real-time
    socketService.broadcastAlertCreated(alert);

    return alert;
  }

  async updateAlert(adminId: string, id: string, data: { isActive?: boolean; expiryTime?: Date }, ipAddress?: string) {
    const updated = await this.repo.updateAlert(id, data);

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'ALERT_UPDATED',
        entity: 'DisasterAlert',
        entityId: updated.id,
        details: `Updated Alert status isActive=${data.isActive}`,
        ipAddress: ipAddress || null,
      },
    });

    socketService.broadcast('alert.updated', updated);
    return updated;
  }

  async deleteAlert(adminId: string, id: string, ipAddress?: string) {
    const deleted = await this.repo.softDeleteAlert(id);

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'ALERT_DELETED',
        entity: 'DisasterAlert',
        entityId: id,
        details: `Deactivated Alert ${id}`,
        ipAddress: ipAddress || null,
      },
    });

    socketService.broadcast('alert.updated', { id, isActive: false, deleted: true });
    return deleted;
  }
}

export const alertsService = new AlertsService();
