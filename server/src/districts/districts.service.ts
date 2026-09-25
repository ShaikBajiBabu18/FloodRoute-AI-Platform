import { DistrictTelemetry } from '@floodroute/shared';
import { prisma } from '../config/database';

export class DistrictsService {
  async getDistricts(): Promise<DistrictTelemetry[]> {
    const districtsData: DistrictTelemetry[] = [
      {
        districtName: 'Chennai',
        state: 'Tamil Nadu',
        riskScore: 78,
        riskLevel: 'CRITICAL',
        weather: { tempC: 28.5, rainfallMm: 34.2, condition: 'Heavy Torrential Downpour' },
        reportsCount: 14,
        roadClosuresCount: 6,
        alertsCount: 2,
        resourcesCount: 12,
        populationAtRisk: 420000,
        coordinates: { lat: 13.0827, lng: 80.2707 },
      },
      {
        districtName: 'Mumbai Suburban',
        state: 'Maharashtra',
        riskScore: 72,
        riskLevel: 'SEVERE',
        weather: { tempC: 27.2, rainfallMm: 28.4, condition: 'Monsoon Cloudburst' },
        reportsCount: 18,
        roadClosuresCount: 5,
        alertsCount: 1,
        resourcesCount: 15,
        populationAtRisk: 680000,
        coordinates: { lat: 19.076, lng: 72.8777 },
      },
      {
        districtName: 'Bengaluru Urban',
        state: 'Karnataka',
        riskScore: 61,
        riskLevel: 'HIGH',
        weather: { tempC: 23.4, rainfallMm: 18.0, condition: 'Thunderstorm with Gutter Overflow' },
        reportsCount: 9,
        roadClosuresCount: 4,
        alertsCount: 1,
        resourcesCount: 9,
        populationAtRisk: 290000,
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      {
        districtName: 'Kamrup Metropolitan (Guwahati)',
        state: 'Assam',
        riskScore: 84,
        riskLevel: 'CRITICAL',
        weather: { tempC: 26.8, rainfallMm: 42.0, condition: 'Riverine Spate & Flood' },
        reportsCount: 22,
        roadClosuresCount: 8,
        alertsCount: 3,
        resourcesCount: 14,
        populationAtRisk: 750000,
        coordinates: { lat: 26.185, lng: 91.745 },
      },
      {
        districtName: 'Patna',
        state: 'Bihar',
        riskScore: 68,
        riskLevel: 'HIGH',
        weather: { tempC: 29.0, rainfallMm: 22.5, condition: 'Waterlogged Streets & Sump Overfill' },
        reportsCount: 11,
        roadClosuresCount: 3,
        alertsCount: 1,
        resourcesCount: 8,
        populationAtRisk: 340000,
        coordinates: { lat: 25.6025, lng: 85.1585 },
      },
      {
        districtName: 'Ernakulam (Kochi)',
        state: 'Kerala',
        riskScore: 48,
        riskLevel: 'MODERATE',
        weather: { tempC: 28.1, rainfallMm: 12.0, condition: 'Coastal Squall & Moderate Rain' },
        reportsCount: 5,
        roadClosuresCount: 1,
        alertsCount: 0,
        resourcesCount: 11,
        populationAtRisk: 120000,
        coordinates: { lat: 9.9816, lng: 76.2999 },
      },
      {
        districtName: 'Hyderabad',
        state: 'Telangana',
        riskScore: 54,
        riskLevel: 'HIGH',
        weather: { tempC: 26.5, rainfallMm: 15.6, condition: 'Musi River Surge Warning' },
        reportsCount: 7,
        roadClosuresCount: 2,
        alertsCount: 1,
        resourcesCount: 10,
        populationAtRisk: 180000,
        coordinates: { lat: 17.385, lng: 78.4867 },
      },
    ];

    // Corroborate with live database counts if available
    try {
      const activeAlerts = await prisma.disasterAlert.count({ where: { isActive: true, deletedAt: null } });
      const activeReports = await prisma.floodReport.count({ where: { status: 'VERIFIED', deletedAt: null } });
      if (districtsData[0]) {
        districtsData[0].alertsCount = Math.max(districtsData[0].alertsCount, activeAlerts);
        districtsData[0].reportsCount = Math.max(districtsData[0].reportsCount, activeReports);
      }
    } catch (e) {
      // Nominal fallback
    }

    return districtsData;
  }

  async getDistrictByName(name: string): Promise<DistrictTelemetry | null> {
    const list = await this.getDistricts();
    const query = name.toLowerCase().trim();
    return list.find((d) => d.districtName.toLowerCase().includes(query)) || null;
  }
}

export const districtsService = new DistrictsService();
