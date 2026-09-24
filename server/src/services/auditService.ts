import { prisma } from '../config/database';

export class AuditService {
  async log(params: {
    adminId?: string;
    action: string;
    entity: string;
    entityId: string;
    details?: string;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: params.adminId || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: params.details || null,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (err) {
      console.error('[AuditService] Failed to record audit log:', err);
    }
  }
}

export const auditService = new AuditService();
