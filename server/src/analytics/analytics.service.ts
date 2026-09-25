import { AnalyticsRepository, analyticsRepository } from './analytics.repository';

export class AnalyticsService {
  constructor(private repo: AnalyticsRepository = analyticsRepository) {}

  async getDashboardAnalytics() {
    const [kpis, reportsByHour, reportsByState, severityBreakdown, aiAccuracy, auditLogs] = await Promise.all([
      this.repo.getSystemKPIs(),
      this.repo.getReportsByHour(),
      this.repo.getReportsByState(),
      this.repo.getSeverityBreakdown(),
      this.repo.getAIAccuracyMetrics(),
      this.repo.getRecentAuditLogs(15),
    ]);

    return {
      kpis,
      reportsByHour,
      reportsByState,
      severityBreakdown,
      aiAccuracy,
      auditLogs,
      timestamp: new Date().toISOString(),
    };
  }

  async getStats() {
    return this.repo.getSystemKPIs();
  }
}

export const analyticsService = new AnalyticsService();
