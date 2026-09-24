import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { weatherService } from '../services/weatherService';
import { calculateLocationRisk, FloodReportItem, RoadConditionItem, DisasterAlertItem } from '@floodroute/shared';

export class FloodController {
  async getRisk(req: Request, res: Response) {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const locationName = (req.query.location as string) || 'Target Location';

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) parameters are required.' });
    }

    try {
      // 1. Fetch live or cached weather
      const forecast = await weatherService.getWeather(lat, lng).catch(() => null);
      const current = forecast?.current || null;

      // 2. Fetch official alerts in region
      const alerts = await prisma.disasterAlert.findMany({
        where: { isActive: true },
      });

      // 3. Fetch verified and pending flood reports near this coordinate (+/- 0.15 deg ~ 15km)
      const reports = await prisma.floodReport.findMany({
        where: {
          latitude: { gte: lat - 0.25, lte: lat + 0.25 },
          longitude: { gte: lng - 0.25, lte: lng + 0.25 },
        },
        include: { aiAnalysis: true },
      });

      const verifiedReports = reports
        .filter(r => r.status === 'VERIFIED')
        .map(r => ({
          ...r,
          reportedAt: r.createdAt.toISOString(),
          hazardType: r.hazardType as any,
          severity: r.severity as any,
          waterLevel: r.waterLevel as any,
          status: r.status as any,
        }));

      const pendingReports = reports
        .filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW')
        .map(r => ({
          ...r,
          reportedAt: r.createdAt.toISOString(),
          hazardType: r.hazardType as any,
          severity: r.severity as any,
          waterLevel: r.waterLevel as any,
          status: r.status as any,
        }));

      // 4. Fetch road conditions
      const roads = await prisma.roadCondition.findMany({
        where: {
          latitude: { gte: lat - 0.25, lte: lat + 0.25 },
          longitude: { gte: lng - 0.25, lte: lng + 0.25 },
        },
      });

      const roadConditions: RoadConditionItem[] = roads.map(r => ({
        ...r,
        condition: r.condition as any,
        severity: r.severity as any,
        startTime: r.startTime.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));

      const disasterAlerts: DisasterAlertItem[] = alerts.map(a => ({
        ...a,
        severity: a.severity as any,
        source: a.source as any,
        startTime: a.startTime.toISOString(),
        expiryTime: a.expiryTime.toISOString(),
      }));

      const maxForecastRain = forecast?.daily?.reduce((max, d) => Math.max(max, d.rainfallMm), 0) || 0;

      // Execute explainable risk engine
      const riskAssessment = calculateLocationRisk({
        latitude: lat,
        longitude: lng,
        locationName,
        weather: current,
        forecastMaxRainfallMm: maxForecastRain,
        officialAlerts: disasterAlerts,
        verifiedReports,
        pendingReports,
        roadConditions,
      });

      // Segment telemetry by source
      return res.json({
        ...riskAssessment,
        breakdown: {
          officialData: {
            alertsCount: alerts.length,
            alerts: alerts.slice(0, 3),
            cwcRiverStatus: 'Monitored Normal Discharge (Unless Alert Specified)',
          },
          communityData: {
            verifiedReportsCount: verifiedReports.length,
            pendingReportsCount: pendingReports.length,
            reports: reports.slice(0, 5),
          },
          weatherDerivedRisk: {
            currentRainfallMm: current?.rainfallMm || 0,
            maxForecastRainfallMm: maxForecastRain,
            weatherRiskLevel: current?.weatherRisk || 'LOW',
          },
          aiEstimates: {
            analyzedReportsCount: reports.filter(r => r.aiAnalysis).length,
            floodedDetectedCount: reports.filter(r => r.aiAnalysis?.floodDetected).length,
          },
        },
      });
    } catch (err: any) {
      console.error('[FloodController] Risk calculation failure:', err);
      return res.status(500).json({
        error: 'Official flood data temporarily unavailable.',
        details: err.message,
      });
    }
  }

  async getFloodReports(req: Request, res: Response) {
    const reports = await prisma.floodReport.findMany({
      where: { status: 'VERIFIED' },
      include: { aiAnalysis: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ reports });
  }
}

export const floodController = new FloodController();
