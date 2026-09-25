import { prisma } from '../config/database';

export class FloodRepository {
  async getRegionalAlerts(lat: number, lng: number, radiusDeg: number = 0.5) {
    return prisma.disasterAlert.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async getNearbyReports(lat: number, lng: number, radiusDeg: number = 0.25) {
    return prisma.floodReport.findMany({
      where: {
        latitude: { gte: lat - radiusDeg, lte: lat + radiusDeg },
        longitude: { gte: lng - radiusDeg, lte: lng + radiusDeg },
        deletedAt: null,
      },
      include: {
        aiAnalysis: true,
        images: true,
        communityItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNearbyRoadConditions(lat: number, lng: number, radiusDeg: number = 0.25) {
    return prisma.roadCondition.findMany({
      where: {
        latitude: { gte: lat - radiusDeg, lte: lat + radiusDeg },
        longitude: { gte: lng - radiusDeg, lte: lng + radiusDeg },
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getCriticalZones() {
    return prisma.location.findMany({
      where: {
        isCriticalZone: true,
        deletedAt: null,
      },
    });
  }

  async getVerifiedReports(limit: number = 100) {
    return prisma.floodReport.findMany({
      where: {
        status: 'VERIFIED',
        deletedAt: null,
      },
      include: {
        aiAnalysis: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const floodRepository = new FloodRepository();
