import {
  CalculatedRisk,
  DataSourceMeta,
  DisasterAlertItem,
  FloodReportItem,
  RiskFactor,
  RiskLevel,
  RoadConditionItem,
  WeatherCurrent,
} from './types';

export interface RiskEngineWeights {
  rainfallCurrentWeight: number; // e.g. 0.25
  rainfallForecastWeight: number; // e.g. 0.15
  officialAlertWeight: number; // e.g. 0.30
  verifiedReportsWeight: number; // e.g. 0.20
  roadClosureWeight: number; // e.g. 0.25
  pendingReportsWeight: number; // e.g. 0.05
}

export const DEFAULT_RISK_WEIGHTS: RiskEngineWeights = {
  rainfallCurrentWeight: 0.25,
  rainfallForecastWeight: 0.15,
  officialAlertWeight: 0.30,
  verifiedReportsWeight: 0.20,
  roadClosureWeight: 0.25,
  pendingReportsWeight: 0.05,
};

export interface RiskCalculationInput {
  latitude: number;
  longitude: number;
  locationName?: string;
  weather?: WeatherCurrent | null;
  forecastMaxRainfallMm?: number;
  officialAlerts?: DisasterAlertItem[];
  verifiedReports?: FloodReportItem[];
  pendingReports?: FloodReportItem[];
  roadConditions?: RoadConditionItem[];
  customWeights?: Partial<RiskEngineWeights>;
}

export function calculateLocationRisk(input: RiskCalculationInput): CalculatedRisk {
  const weights = { ...DEFAULT_RISK_WEIGHTS, ...input.customWeights };
  const factors: RiskFactor[] = [];
  const sources: DataSourceMeta[] = [];
  const reasons: string[] = [];

  let totalScore = 0;

  // 1. Current Rainfall Factor
  if (input.weather) {
    sources.push({
      source: input.weather.source || 'Open-Meteo / IMD Integration',
      sourceType: input.weather.isDemo ? 'DEMO' : 'OFFICIAL',
      lastUpdated: input.weather.timestamp || new Date().toISOString(),
      status: input.weather.isDemo ? 'DEMO' : 'LIVE',
    });

    const rain = input.weather.rainfallMm || 0;
    if (rain > 35) {
      const score = Math.min(30, rain * 0.8) * (weights.rainfallCurrentWeight / 0.25);
      totalScore += score;
      factors.push({
        factor: 'Torrential Rainfall Observed',
        scoreImpact: Math.round(score),
        description: `Current rainfall at ${rain.toFixed(1)} mm/hr indicates rapid surface runoff risk.`,
        source: input.weather.source,
        category: 'WEATHER',
      });
      reasons.push(`Torrential downpour (${rain.toFixed(1)} mm/hr) in surrounding area`);
    } else if (rain > 15) {
      const score = 18 * (weights.rainfallCurrentWeight / 0.25);
      totalScore += score;
      factors.push({
        factor: 'Heavy Rainfall',
        scoreImpact: Math.round(score),
        description: `Active rainfall of ${rain.toFixed(1)} mm/hr elevates waterlogging potential.`,
        source: input.weather.source,
        category: 'WEATHER',
      });
      reasons.push(`Heavy rainfall active (${rain.toFixed(1)} mm/hr)`);
    } else if (rain > 5) {
      const score = 8 * (weights.rainfallCurrentWeight / 0.25);
      totalScore += score;
      factors.push({
        factor: 'Moderate Rainfall',
        scoreImpact: Math.round(score),
        description: `Moderate rain (${rain.toFixed(1)} mm/hr) may cause localized puddling.`,
        source: input.weather.source,
        category: 'WEATHER',
      });
    }
  }

  // 2. Forecast Rainfall
  if (input.forecastMaxRainfallMm && input.forecastMaxRainfallMm > 20) {
    const score = Math.min(20, input.forecastMaxRainfallMm * 0.5) * (weights.rainfallForecastWeight / 0.15);
    totalScore += score;
    factors.push({
      factor: 'Severe Rainfall Forecast',
      scoreImpact: Math.round(score),
      description: `Predictive models indicate up to ${input.forecastMaxRainfallMm.toFixed(1)} mm precipitation in next 24h.`,
      source: 'Meteorological Forecast Model',
      category: 'WEATHER',
    });
    reasons.push(`Heavy rainfall forecast of up to ${input.forecastMaxRainfallMm.toFixed(1)} mm`);
  }

  // 3. Official Disaster Warnings (NDMA / IMD / CWC)
  if (input.officialAlerts && input.officialAlerts.length > 0) {
    const activeOfficial = input.officialAlerts.filter(a => a.isActive);
    if (activeOfficial.length > 0) {
      sources.push({
        source: 'NDMA / IMD Official Weather & Disaster Warning Bulletin',
        sourceType: 'OFFICIAL',
        lastUpdated: activeOfficial[0].startTime,
        status: activeOfficial[0].isDemo ? 'DEMO' : 'LIVE',
      });

      let alertScore = 0;
      activeOfficial.forEach(alert => {
        if (alert.severity === 'CRITICAL' || alert.severity === 'DANGER') alertScore += 35;
        else if (alert.severity === 'WARNING') alertScore += 22;
        else if (alert.severity === 'CAUTION') alertScore += 10;
        else alertScore += 5;
      });
      alertScore = Math.min(45, alertScore) * (weights.officialAlertWeight / 0.30);
      totalScore += alertScore;

      factors.push({
        factor: 'Official Meteorological Warning Active',
        scoreImpact: Math.round(alertScore),
        description: `${activeOfficial.length} active official disaster warnings for this region: ${activeOfficial.map(a => a.title).join(', ')}`,
        source: 'NDMA / IMD / CWC',
        category: 'OFFICIAL_ALERT',
      });
      reasons.push(`${activeOfficial.length} active official disaster warnings issued by authorities`);
    }
  }

  // 4. Verified Community & Field Flood Reports
  if (input.verifiedReports && input.verifiedReports.length > 0) {
    sources.push({
      source: 'Verified Community Reports',
      sourceType: 'COMMUNITY',
      lastUpdated: input.verifiedReports[0].reportedAt,
      status: 'LIVE',
    });

    let verifiedScore = 0;
    input.verifiedReports.forEach(report => {
      if (report.severity === 'CRITICAL') verifiedScore += 30;
      else if (report.severity === 'HIGH') verifiedScore += 20;
      else if (report.severity === 'MEDIUM') verifiedScore += 10;
      else verifiedScore += 5;
    });
    verifiedScore = Math.min(40, verifiedScore) * (weights.verifiedReportsWeight / 0.20);
    totalScore += verifiedScore;

    factors.push({
      factor: 'Verified Field Inundation Reports',
      scoreImpact: Math.round(verifiedScore),
      description: `${input.verifiedReports.length} verified ground reports confirming standing water / inundated roads nearby.`,
      source: 'Community Field Data',
      category: 'REPORTS',
    });
    reasons.push(`${input.verifiedReports.length} verified flood reports in immediate vicinity`);
  }

  // 5. Road Closures and Critical Conditions
  if (input.roadConditions && input.roadConditions.length > 0) {
    const impassable = input.roadConditions.filter(r => r.condition === 'FLOODED' || r.condition === 'BLOCKED');
    if (impassable.length > 0) {
      sources.push({
        source: 'Municipal & Traffic Road Condition Registry',
        sourceType: 'OFFICIAL',
        lastUpdated: impassable[0].updatedAt,
        status: 'LIVE',
      });

      const roadScore = Math.min(35, impassable.length * 20) * (weights.roadClosureWeight / 0.25);
      totalScore += roadScore;
      factors.push({
        factor: 'Confirmed Road Closures / Impassable Segments',
        scoreImpact: Math.round(roadScore),
        description: `${impassable.length} critical road closure(s) or submerged corridors on record.`,
        source: 'Traffic & Municipal Authority',
        category: 'ROAD_CLOSURE',
      });
      reasons.push(`${impassable.length} verified road closure(s) or blocked segments`);
    }
  }

  // 6. Pending Community Reports (low impact until verified)
  if (input.pendingReports && input.pendingReports.length > 0) {
    const pendingScore = Math.min(8, input.pendingReports.length * 2) * (weights.pendingReportsWeight / 0.05);
    totalScore += pendingScore;
    factors.push({
      factor: 'Unverified Community Submissions',
      scoreImpact: Math.round(pendingScore),
      description: `${input.pendingReports.length} pending reports awaiting verification by disaster analysts.`,
      source: 'Citizen Crowdsourcing',
      category: 'REPORTS',
    });
  }

  // Normalize final score
  const finalScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 75) riskLevel = 'CRITICAL';
  else if (finalScore >= 50) riskLevel = 'HIGH';
  else if (finalScore >= 25) riskLevel = 'MODERATE';

  if (reasons.length === 0) {
    reasons.push('No severe weather anomalies or active flood reports detected along this sector.');
  }

  return {
    riskScore: finalScore,
    riskLevel,
    reasons,
    factors,
    sources,
    timestamp: new Date().toISOString(),
    disclaimer: 'FloodRoute AI risk estimate. Not an official statutory disaster determination. Cross-verify with NDMA and local authorities during emergencies.',
  };
}
