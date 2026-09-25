import { prisma } from '../config/database';
import { RouteOption } from '@floodroute/shared';

export class RoutingRepository {
  async saveRouteRequestWithResults(params: {
    userId?: string;
    originLat: number;
    originLng: number;
    originName?: string;
    destLat: number;
    destLng: number;
    destName?: string;
    avoidFlooded?: boolean;
    avoidHighRisk?: boolean;
    preferSafer?: boolean;
    vehicleType?: string;
    options: RouteOption[];
  }) {
    return prisma.routeRequest.create({
      data: {
        userId: params.userId || null,
        originLat: params.originLat,
        originLng: params.originLng,
        originName: params.originName || `Lat ${params.originLat.toFixed(3)}, Lng ${params.originLng.toFixed(3)}`,
        destLat: params.destLat,
        destLng: params.destLng,
        destName: params.destName || `Lat ${params.destLat.toFixed(3)}, Lng ${params.destLng.toFixed(3)}`,
        avoidFlooded: params.avoidFlooded ?? true,
        avoidHighRisk: params.avoidHighRisk ?? true,
        preferSafer: params.preferSafer ?? true,
        vehicleType: params.vehicleType || 'CAR',
        results: {
          create: params.options.map((opt) => ({
            title: opt.title,
            distanceKm: opt.distanceKm,
            durationMinutes: opt.durationMinutes,
            floodRisk: opt.floodRisk,
            weatherRisk: opt.weatherRisk,
            overallRisk: opt.overallRisk,
            hazardsCount: opt.hazardsCount,
            officialAlertsCount: opt.officialAlertsCount,
            riskScore: opt.riskScore,
            riskReasonsJson: JSON.stringify(opt.riskReasons),
            geometryJson: JSON.stringify(opt.geometry),
            stepsJson: JSON.stringify(opt.steps || []),
            co2EmissionsKg: Math.round(opt.distanceKm * 0.12 * 10) / 10,
            isRecommended: opt.isRecommended,
          })),
        },
      },
      include: {
        results: true,
      },
    });
  }

  async getRouteHistory(userId?: string, limit: number = 20) {
    return prisma.routeRequest.findMany({
      where: {
        ...(userId ? { userId } : {}),
        deletedAt: null,
      },
      include: {
        results: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRouteById(id: string) {
    return prisma.routeRequest.findFirst({
      where: { id, deletedAt: null },
      include: { results: true },
    });
  }
}

export const routingRepository = new RoutingRepository();
