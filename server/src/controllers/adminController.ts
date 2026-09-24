import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class AdminController {
  async getDashboardKpis(req: Request, res: Response) {
    const [
      totalUsers,
      totalReports,
      pendingReports,
      verifiedReports,
      rejectedReports,
      resolvedReports,
      activeAlerts,
      activeRoadClosures,
      criticalReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.floodReport.count(),
      prisma.floodReport.count({ where: { status: 'PENDING' } }),
      prisma.floodReport.count({ where: { status: 'VERIFIED' } }),
      prisma.floodReport.count({ where: { status: 'REJECTED' } }),
      prisma.floodReport.count({ where: { status: 'RESOLVED' } }),
      prisma.disasterAlert.count({ where: { isActive: true } }),
      prisma.roadCondition.count({ where: { condition: { in: ['FLOODED', 'BLOCKED'] } } }),
      prisma.floodReport.count({ where: { severity: 'CRITICAL', status: { in: ['PENDING', 'VERIFIED'] } } }),
    ]);

    return res.json({
      kpis: {
        totalUsers,
        totalReports,
        pendingReports,
        verifiedReports,
        rejectedReports,
        resolvedReports,
        activeAlerts,
        activeRoadClosures,
        highRiskLocations: criticalReports,
      },
    });
  }

  async getAnalytics(req: Request, res: Response) {
    const allReports = await prisma.floodReport.findMany({
      select: {
        id: true,
        hazardType: true,
        severity: true,
        status: true,
        state: true,
        createdAt: true,
      },
    });

    const allRoads = await prisma.roadCondition.findMany({
      select: { condition: true, severity: true },
    });

    // 1. Severity Distribution
    const severityCount: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    allReports.forEach(r => {
      if (severityCount[r.severity] !== undefined) severityCount[r.severity]++;
    });
    const severityDistribution = Object.entries(severityCount).map(([name, value]) => ({ name, value }));

    // 2. Status Distribution (Verified vs Rejected vs Pending)
    const statusCount: Record<string, number> = { PENDING: 0, UNDER_REVIEW: 0, VERIFIED: 0, REJECTED: 0, RESOLVED: 0 };
    allReports.forEach(r => {
      if (statusCount[r.status] !== undefined) statusCount[r.status]++;
    });
    const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

    // 3. Hazard Type Distribution
    const hazardCount: Record<string, number> = {};
    allReports.forEach(r => {
      const type = r.hazardType.replace('_', ' ');
      hazardCount[type] = (hazardCount[type] || 0) + 1;
    });
    const hazardDistribution = Object.entries(hazardCount).map(([name, value]) => ({ name, value }));

    // 4. Reports by State
    const stateCount: Record<string, number> = {};
    allReports.forEach(r => {
      const state = r.state || 'Other State';
      stateCount[state] = (stateCount[state] || 0) + 1;
    });
    const stateDistribution = Object.entries(stateCount).map(([name, count]) => ({ state: name, count }));

    // 5. Road Condition Distribution
    const roadCount: Record<string, number> = { SAFE: 0, CAUTION: 0, FLOODED: 0, BLOCKED: 0 };
    allRoads.forEach(r => {
      if (roadCount[r.condition] !== undefined) roadCount[r.condition]++;
    });
    const roadConditionDistribution = Object.entries(roadCount).map(([name, value]) => ({ name, value }));

    // 6. Reports over time (grouped by day)
    const dailyMap: Record<string, number> = {};
    allReports.forEach(r => {
      const day = r.createdAt.toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const reportsOverTime = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    return res.json({
      severityDistribution,
      statusDistribution,
      hazardDistribution,
      stateDistribution,
      roadConditionDistribution,
      reportsOverTime,
    });
  }

  async getAiAnalytics(req: Request, res: Response) {
    const analyses = await prisma.aIAnalysis.findMany();

    const totalAnalyzed = analyses.length;
    const floodDetected = analyses.filter(a => a.floodDetected).length;
    const notFlood = totalAnalyzed - floodDetected;

    const highSeverity = analyses.filter(a => a.estimatedSeverity === 'HIGH' || a.estimatedSeverity === 'CRITICAL').length;
    const mediumSeverity = analyses.filter(a => a.estimatedSeverity === 'MEDIUM').length;
    const lowSeverity = analyses.filter(a => a.estimatedSeverity === 'LOW').length;

    const avgConfidence = totalAnalyzed > 0
      ? Math.round(analyses.reduce((acc, curr) => acc + curr.confidence, 0) / totalAnalyzed)
      : 0;

    return res.json({
      aiStats: {
        totalAnalyzed,
        floodDetected,
        notFlood,
        highSeverity,
        mediumSeverity,
        lowSeverity,
        averageConfidence: avgConfidence,
      },
    });
  }

  async getAuditLogs(req: Request, res: Response) {
    const logs = await prisma.auditLog.findMany({
      include: {
        admin: {
          select: { name: true, email: true, role: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return res.json({ logs });
  }
}

export const adminController = new AdminController();
