import { prisma } from '../config/database';

export class AlertsRepository {
  async getAlerts(params: {
    activeOnly?: boolean;
    severity?: string;
    source?: string;
    state?: string;
    limit?: number;
  }) {
    const where: any = { deletedAt: null };
    if (params.activeOnly) where.isActive = true;
    if (params.severity) where.severity = params.severity;
    if (params.source) where.source = params.source;
    if (params.state) where.state = { contains: params.state };

    return prisma.disasterAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: params.limit || 100,
    });
  }

  async getById(id: string) {
    return prisma.disasterAlert.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async createAlert(data: {
    title: string;
    description: string;
    severity: string;
    source?: string;
    sourceLabel?: string;
    locationName: string;
    state?: string;
    district?: string;
    latitude: number;
    longitude: number;
    radiusKm?: number;
    startTime?: Date;
    expiryTime?: Date;
    isOfficial?: boolean;
    isDemo?: boolean;
  }) {
    return prisma.disasterAlert.create({
      data: {
        title: data.title,
        description: data.description,
        severity: data.severity,
        source: data.source || 'PLATFORM_FLOODROUTE',
        sourceLabel: data.sourceLabel || 'FloodRoute AI Emergency Broadcast',
        locationName: data.locationName,
        state: data.state || null,
        district: data.district || null,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusKm: data.radiusKm || 15,
        startTime: data.startTime || new Date(),
        expiryTime: data.expiryTime || new Date(Date.now() + 24 * 3600000),
        isActive: true,
        isOfficial: data.isOfficial ?? false,
        isDemo: data.isDemo ?? false,
      },
    });
  }

  async updateAlert(id: string, data: { isActive?: boolean; expiryTime?: Date }) {
    return prisma.disasterAlert.update({
      where: { id },
      data,
    });
  }

  async softDeleteAlert(id: string) {
    return prisma.disasterAlert.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}

export const alertsRepository = new AlertsRepository();
