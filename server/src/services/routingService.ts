import axios from 'axios';
import { prisma } from '../config/database';
import { ENV } from '../config/env';
import { weatherService } from './weatherService';
import { RouteOption, RouteStep, RiskLevel } from '@floodroute/shared';

// Helper: Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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
  async calculateRoutes(params: {
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    avoidFlooded?: boolean;
    avoidHighRisk?: boolean;
    preferSafer?: boolean;
    preferFastest?: boolean;
  }): Promise<RouteOption[]> {
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

    // Fallback if OSRM returned nothing or errored
    if (routesRaw.length === 0) {
      routesRaw = this.createSyntheticRoutes(originLat, originLng, destLat, destLng);
    }

    // Fetch active environmental data for corridor evaluation
    const [reports, roads, alerts, originWeather, destWeather] = await Promise.all([
      prisma.floodReport.findMany({
        where: { status: { in: ['VERIFIED', 'PENDING', 'UNDER_REVIEW'] } },
      }),
      prisma.roadCondition.findMany({
        where: { condition: { in: ['FLOODED', 'BLOCKED', 'CAUTION'] } },
      }),
      prisma.disasterAlert.findMany({
        where: { isActive: true },
      }),
      weatherService.getWeather(originLat, originLng).catch(() => null),
      weatherService.getWeather(destLat, destLng).catch(() => null),
    ]);

    // Evaluate each route candidate
    const options: RouteOption[] = [];

    for (let i = 0; i < routesRaw.length; i++) {
      const raw = routesRaw[i];
      const coords: [number, number][] = raw.geometry.coordinates; // [lng, lat]
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

      // Check proximity along route samples (stride sampling to maintain O(N) performance)
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

      // Check flood reports near route (within 3.5 km)
      const matchedReports = new Set<string>();
      for (const [lng, lat] of sampledPoints) {
        for (const report of reports) {
          if (!matchedReports.has(report.id)) {
            const dist = getDistanceKm(lat, lng, report.latitude, report.longitude);
            if (dist <= 3.5) {
              matchedReports.add(report.id);
              hazardsCount++;
              if (report.severity === 'CRITICAL') floodScore += 35;
              else if (report.severity === 'HIGH') floodScore += 20;
              else floodScore += 10;

              riskReasons.push(
                `Verified ${report.hazardType.replace('_', ' ').toLowerCase()} report near ${report.locationName} (${dist.toFixed(1)} km from route)`
              );
            }
          }
        }
      }

      // Check road closures / conditions along route
      const matchedRoads = new Set<string>();
      for (const [lng, lat] of sampledPoints) {
        for (const road of roads) {
          if (!matchedRoads.has(road.id)) {
            const dist = getDistanceKm(lat, lng, road.latitude, road.longitude);
            if (dist <= 2.5) {
              matchedRoads.add(road.id);
              hazardsCount++;
              if (road.condition === 'FLOODED' || road.condition === 'BLOCKED') {
                floodScore += 40;
                riskReasons.push(`Confirmed road closure: ${road.roadName} (${road.reason})`);
              } else {
                floodScore += 15;
                riskReasons.push(`Traffic caution advisory: ${road.roadName}`);
              }
            }
          }
        }
      }

      // Check official disaster alerts covering the corridor
      const matchedAlerts = new Set<string>();
      for (const [lng, lat] of sampledPoints) {
        for (const alert of alerts) {
          if (!matchedAlerts.has(alert.id)) {
            const dist = getDistanceKm(lat, lng, alert.latitude, alert.longitude);
            if (dist <= (alert.radiusKm || 15)) {
              matchedAlerts.add(alert.id);
              officialAlertsCount++;
              floodScore += alert.severity === 'CRITICAL' ? 30 : 15;
              riskReasons.push(`Active official warning: ${alert.title}`);
            }
          }
        }
      }

      // Incorporate weather risk along route
      let weatherRisk: RiskLevel = 'LOW';
      const maxRain = Math.max(
        originWeather?.current.rainfallMm || 0,
        destWeather?.current.rainfallMm || 0
      );
      if (maxRain > 25) {
        weatherRisk = 'CRITICAL';
        floodScore += 25;
        riskReasons.push(`Torrential downpour forecast along corridor (${maxRain.toFixed(1)} mm/hr)`);
      } else if (maxRain > 12) {
        weatherRisk = 'HIGH';
        floodScore += 15;
        riskReasons.push(`Heavy rain observed in sector (${maxRain.toFixed(1)} mm/hr)`);
      } else if (maxRain > 4) {
        weatherRisk = 'MODERATE';
        floodScore += 5;
      }

      const totalRiskScore = Math.min(100, Math.round(floodScore));

      let overallRisk: RiskLevel = 'LOW';
      if (totalRiskScore >= 70) overallRisk = 'CRITICAL';
      else if (totalRiskScore >= 45) overallRisk = 'HIGH';
      else if (totalRiskScore >= 20) overallRisk = 'MODERATE';

      let floodRisk: RiskLevel = 'LOW';
      if (floodScore >= 50) floodRisk = 'HIGH';
      else if (floodScore >= 25) floodRisk = 'MODERATE';

      if (riskReasons.length === 0) {
        riskReasons.push('Clear corridor: No active flood reports or road blockages detected along this route.');
      }

      options.push({
        id: `route-${i + 1}`,
        title: i === 0 ? 'Primary Transit Corridor' : `Alternative Route ${i}`,
        distanceKm,
        durationMinutes,
        geometry: raw.geometry,
        steps,
        floodRisk,
        weatherRisk,
        overallRisk,
        hazardsCount,
        officialAlertsCount,
        riskReasons,
        riskScore: totalRiskScore,
        isRecommended: false,
      });
    }

    // Determine recommended route
    if (options.length > 0) {
      if (preferSafer) {
        // Find minimum risk score
        const minRisk = Math.min(...options.map(o => o.riskScore));
        const safest = options.find(o => o.riskScore === minRisk) || options[0];
        safest.isRecommended = true;
      } else {
        // Fastest
        const minDuration = Math.min(...options.map(o => o.durationMinutes));
        const fastest = options.find(o => o.durationMinutes === minDuration) || options[0];
        fastest.isRecommended = true;
      }
    }

    return options;
  }

  private createSyntheticRoutes(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): any[] {
    const directDistKm = getDistanceKm(originLat, originLng, destLat, destLng);
    const speedKmh = 50; // average city/highway speed

    // Primary route: segmented line
    const coords1: [number, number][] = [];
    const pointsCount = 20;
    for (let i = 0; i <= pointsCount; i++) {
      const frac = i / pointsCount;
      const lat = originLat + (destLat - originLat) * frac;
      const lng = originLng + (destLng - originLng) * frac;
      coords1.push([lng, lat]);
    }

    // Alternative detour route
    const coords2: [number, number][] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const frac = i / pointsCount;
      const arcOffset = Math.sin(frac * Math.PI) * 0.08;
      const lat = originLat + (destLat - originLat) * frac + arcOffset;
      const lng = originLng + (destLng - originLng) * frac + arcOffset;
      coords2.push([lng, lat]);
    }

    return [
      {
        distance: directDistKm * 1000 * 1.15,
        duration: (directDistKm / speedKmh) * 3600 * 1.15,
        geometry: {
          type: 'LineString',
          coordinates: coords1,
        },
        legs: [{ steps: [] }],
      },
      {
        distance: directDistKm * 1000 * 1.35,
        duration: (directDistKm / speedKmh) * 3600 * 1.35,
        geometry: {
          type: 'LineString',
          coordinates: coords2,
        },
        legs: [{ steps: [] }],
      },
    ];
  }
}

export const routingService = new RoutingService();
