import axios from 'axios';
import { prisma } from '../config/database';
import { ENV } from '../config/env';
import { weatherService } from '../weather/weather.service';
import { RoutingRepository, routingRepository } from './routing.repository';
import { RouteOption, RouteStep, RiskLevel } from '@floodroute/shared';

// Helper: Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class RoutingService {
  constructor(private repo: RoutingRepository = routingRepository) {}

  async calculateRoutes(params: {
    userId?: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    originName?: string;
    destName?: string;
    avoidFlooded?: boolean;
    avoidHighRisk?: boolean;
    preferSafer?: boolean;
    preferFastest?: boolean;
    vehicleType?: string;
  }): Promise<{ options: RouteOption[]; requestId?: string }> {
    const { originLat, originLng, destLat, destLng, preferSafer = true } = params;

    let routesRaw: any[] = [];

    try {
      // Real OSRM driving route API
      const osrmUrl = `${ENV.ROUTING_API_URL}/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true&steps=true`;
      const response = await axios.get(osrmUrl, { timeout: 7000 });

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        routesRaw = response.data.routes;
      }
    } catch (err: any) {
      console.warn('[RoutingService] OSRM service call failed, generating geodesic geometry fallback:', err.message);
    }

    if (routesRaw.length === 0) {
      routesRaw = this.createSyntheticRoutes(originLat, originLng, destLat, destLng);
    }

    // Fetch active environmental data
    const [reports, roads, alerts, originWeather, destWeather] = await Promise.all([
      prisma.floodReport.findMany({
        where: { status: { in: ['VERIFIED', 'PENDING', 'UNDER_REVIEW'] }, deletedAt: null },
      }),
      prisma.roadCondition.findMany({
        where: { condition: { in: ['FLOODED', 'BLOCKED', 'CAUTION'] }, deletedAt: null },
      }),
      prisma.disasterAlert.findMany({
        where: { isActive: true, deletedAt: null },
      }),
      weatherService.getWeather(originLat, originLng).catch(() => null),
      weatherService.getWeather(destLat, destLng).catch(() => null),
    ]);

    const options: RouteOption[] = [];

    for (let i = 0; i < routesRaw.length; i++) {
      const raw = routesRaw[i];
      const coords: [number, number][] = raw.geometry.coordinates;
      const distanceKm = Math.round((raw.distance / 1000) * 10) / 10;
      const durationMinutes = Math.round(raw.duration / 60);

      const steps: RouteStep[] = [];
      if (raw.legs && raw.legs[0] && raw.legs[0].steps) {
        raw.legs[0].steps.forEach((st: any) => {
          steps.push({
            instruction: st.maneuver?.type ? `${st.maneuver.type} onto ${st.name || 'unnamed road'}` : 'Proceed ahead',
            distanceKm: Math.round((st.distance / 1000) * 100) / 100,
            durationMin: Math.round(st.duration / 60),
            startLocation: st.maneuver?.location || [originLng, originLat],
            endLocation: [originLng, originLat],
          });
        });
      }

      // Stride sampling along route polyline
      const sampleStride = Math.max(1, Math.floor(coords.length / 50));
      const sampledPoints: [number, number][] = [];
      for (let c = 0; c < coords.length; c += sampleStride) {
        sampledPoints.push(coords[c]);
      }
      sampledPoints.push(coords[coords.length - 1]);

      let hazardsCount = 0;
      let officialAlertsCount = 0;
      let floodScore = 0;
      const riskReasons: string[] = [];

      // Intersect with verified reports
      for (const rep of reports) {
        for (const pt of sampledPoints) {
          const d = getDistanceKm(pt[1], pt[0], rep.latitude, rep.longitude);
          if (d <= 0.8) {
            hazardsCount++;
            floodScore += rep.severity === 'CRITICAL' ? 40 : rep.severity === 'HIGH' ? 25 : 10;
            riskReasons.push(`Proximity (${(d * 1000).toFixed(0)}m) to ${rep.severity} hazard: ${rep.locationName}`);
            break;
          }
        }
      }

      // Intersect with road conditions
      for (const rd of roads) {
        for (const pt of sampledPoints) {
          const d = getDistanceKm(pt[1], pt[0], rd.latitude, rd.longitude);
          if (d <= 0.6) {
            hazardsCount++;
            floodScore += rd.condition === 'BLOCKED' ? 45 : rd.condition === 'FLOODED' ? 35 : 15;
            riskReasons.push(`Road closure notice on ${rd.roadName}: ${rd.reason}`);
            break;
          }
        }
      }

      // Intersect with disaster alerts
      for (const al of alerts) {
        for (const pt of sampledPoints) {
          const d = getDistanceKm(pt[1], pt[0], al.latitude, al.longitude);
          if (d <= al.radiusKm) {
            officialAlertsCount++;
            floodScore += al.severity === 'CRITICAL' ? 30 : al.severity === 'DANGER' ? 20 : 10;
            riskReasons.push(`Official disaster alert: ${al.title} (${al.sourceLabel})`);
            break;
          }
        }
      }

      // Regional weather risk
      const avgRain = Math.max(originWeather?.current?.rainfallMm || 0, destWeather?.current?.rainfallMm || 0);
      let weatherRisk: RiskLevel = 'LOW';
      if (avgRain > 25) {
        weatherRisk = 'CRITICAL';
        floodScore += 30;
        riskReasons.push(`Severe localized rainfall along transit corridor (${avgRain} mm/h)`);
      } else if (avgRain > 12) {
        weatherRisk = 'HIGH';
        floodScore += 20;
        riskReasons.push(`Heavy rain detected along transit corridor (${avgRain} mm/h)`);
      } else if (avgRain > 4) {
        weatherRisk = 'MODERATE';
        floodScore += 10;
      }

      const totalRiskScore = Math.min(100, floodScore);
      let floodRisk: RiskLevel = 'LOW';
      if (totalRiskScore > 65) floodRisk = 'CRITICAL';
      else if (totalRiskScore > 40) floodRisk = 'HIGH';
      else if (totalRiskScore > 18) floodRisk = 'MODERATE';

      let overallRisk: RiskLevel = floodRisk;
      if (weatherRisk === 'CRITICAL') overallRisk = 'CRITICAL';
      else if (weatherRisk === 'HIGH' && overallRisk === 'LOW') overallRisk = 'MODERATE';

      const title =
        i === 0
          ? 'Fastest Highway Transit'
          : i === 1
          ? 'Elevated Bypass Route'
          : `Alternative Corridor ${i + 1}`;

      options.push({
        id: `route-opt-${i}-${Date.now()}`,
        title,
        distanceKm,
        durationMinutes,
        floodRisk,
        weatherRisk,
        overallRisk,
        hazardsCount,
        officialAlertsCount,
        riskScore: totalRiskScore,
        riskReasons: riskReasons.length > 0 ? riskReasons.slice(0, 4) : ['Corridor clear of active flood advisories and verified inundation.'],
        isRecommended: false,
        geometry: raw.geometry,
        steps,
      });
    }

    // Determine recommended route
    if (preferSafer) {
      options.sort((a, b) => a.riskScore - b.riskScore || a.durationMinutes - b.durationMinutes);
    } else {
      options.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }
    if (options.length > 0) {
      options[0].isRecommended = true;
    }

    // Persist calculation in database via repository
    let savedRecordId: string | undefined;
    try {
      const saved = await this.repo.saveRouteRequestWithResults({
        userId: params.userId,
        originLat,
        originLng,
        originName: params.originName,
        destLat,
        destLng,
        destName: params.destName,
        avoidFlooded: params.avoidFlooded,
        avoidHighRisk: params.avoidHighRisk,
        preferSafer: params.preferSafer,
        vehicleType: params.vehicleType,
        options,
      });
      savedRecordId = saved.id;
    } catch (saveErr) {
      console.warn('[RoutingService] Failed to persist route request:', saveErr);
    }

    return { options, requestId: savedRecordId };
  }

  private createSyntheticRoutes(originLat: number, originLng: number, destLat: number, destLng: number) {
    const directLine: [number, number][] = [
      [originLng, originLat],
      [originLng + (destLng - originLng) * 0.5, originLat + (destLat - originLat) * 0.5],
      [destLng, destLat],
    ];

    const dist = getDistanceKm(originLat, originLng, destLat, destLng);
    const durationSec = Math.round((dist / 38) * 3600); // 38 km/h avg speed

    const route1 = {
      distance: dist * 1000,
      duration: durationSec,
      geometry: {
        type: 'LineString',
        coordinates: directLine,
      },
      legs: [{ steps: [] }],
    };

    // Alternative bypass arc
    const arcMidLng = originLng + (destLng - originLng) * 0.5 + 0.05;
    const arcMidLat = originLat + (destLat - originLat) * 0.5 - 0.04;
    const route2 = {
      distance: dist * 1.15 * 1000,
      duration: durationSec * 1.1,
      geometry: {
        type: 'LineString',
        coordinates: [
          [originLng, originLat],
          [arcMidLng, arcMidLat],
          [destLng, destLat],
        ],
      },
      legs: [{ steps: [] }],
    };

    return [route1, route2];
  }

  async getHistory(userId?: string) {
    return this.repo.getRouteHistory(userId);
  }

  async getById(id: string) {
    return this.repo.getRouteById(id);
  }
}

export const routingService = new RoutingService();
