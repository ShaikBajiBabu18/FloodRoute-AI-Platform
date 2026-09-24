import { calculateLocationRisk } from '@floodroute/shared';

describe('FloodRoute AI Explainable Risk Engine', () => {
  it('should return LOW risk when conditions are dry and no hazards are present', () => {
    const assessment = calculateLocationRisk({
      latitude: 13.08,
      longitude: 80.27,
      weather: {
        temperatureC: 30,
        feelsLikeC: 32,
        humidityPercent: 60,
        windSpeedKmh: 10,
        windDirectionDeg: 180,
        pressureHpa: 1012,
        cloudCoverPercent: 20,
        rainfallMm: 0,
        visibilityKm: 10,
        condition: 'Clear',
        weatherRisk: 'LOW',
        source: 'Test Sensor',
        timestamp: new Date().toISOString(),
        latitude: 13.08,
        longitude: 80.27,
      },
      forecastMaxRainfallMm: 2,
      officialAlerts: [],
      verifiedReports: [],
      pendingReports: [],
      roadConditions: [],
    });

    expect(assessment.riskLevel).toBe('LOW');
    expect(assessment.riskScore).toBeLessThan(25);
    expect(assessment.reasons.length).toBeGreaterThan(0);
    expect(assessment.disclaimer).toContain('FloodRoute AI risk estimate');
  });

  it('should elevate risk to HIGH or CRITICAL when heavy rainfall, verified reports and official alerts coincide', () => {
    const assessment = calculateLocationRisk({
      latitude: 12.98,
      longitude: 80.22,
      weather: {
        temperatureC: 27,
        feelsLikeC: 31,
        humidityPercent: 95,
        windSpeedKmh: 45,
        windDirectionDeg: 180,
        pressureHpa: 998,
        cloudCoverPercent: 100,
        rainfallMm: 42,
        visibilityKm: 2.0,
        condition: 'Torrential Downpour',
        weatherRisk: 'CRITICAL',
        source: 'IMD Coastal Doppler',
        timestamp: new Date().toISOString(),
        latitude: 12.98,
        longitude: 80.22,
      },
      forecastMaxRainfallMm: 65,
      officialAlerts: [
        {
          id: 'alert-1',
          title: 'Red Alert: Adyar River Breach',
          description: 'Evacuation advisory',
          severity: 'CRITICAL',
          source: 'NDMA_SACHET',
          sourceLabel: 'NDMA',
          locationName: 'Saidapet',
          latitude: 12.98,
          longitude: 80.22,
          radiusKm: 15,
          startTime: new Date().toISOString(),
          expiryTime: new Date(Date.now() + 86400000).toISOString(),
          isActive: true,
          isOfficial: true,
        },
      ],
      verifiedReports: [
        {
          id: 'rep-1',
          reportCode: 'FR-2026-000182',
          hazardType: 'FLOODED_ROAD',
          severity: 'HIGH',
          waterLevel: 'DIFFICULT_CARS',
          latitude: 12.98,
          longitude: 80.22,
          locationName: 'Velachery',
          description: 'Submerged street',
          status: 'VERIFIED',
          reportedAt: new Date().toISOString(),
        },
      ],
      roadConditions: [
        {
          id: 'road-1',
          roadName: 'Velachery 100 Feet Rd',
          locationName: 'Velachery',
          condition: 'FLOODED',
          severity: 'CRITICAL',
          reason: 'Canal breach',
          latitude: 12.98,
          longitude: 80.22,
          source: 'Traffic Control',
          isOfficial: true,
          startTime: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    expect(assessment.riskScore).toBeGreaterThanOrEqual(50);
    expect(['HIGH', 'CRITICAL']).toContain(assessment.riskLevel);
    expect(assessment.factors.length).toBeGreaterThanOrEqual(3);
    expect(assessment.sources.length).toBeGreaterThan(0);
  });
});
