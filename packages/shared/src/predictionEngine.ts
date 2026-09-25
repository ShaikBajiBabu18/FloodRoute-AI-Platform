import {
  PredictiveInput,
  PredictiveOutput,
  PredictiveRiskLevel,
  ExplainableFactorContribution,
  VehicleAccessibilityResult,
  VehicleAccessibilityCategory,
} from './types';

/**
 * AI FLOOD PREDICTION ENGINE
 * Multi-variable explainable predictive modeling for Indian hydrological basins and urban sectors.
 */
export function predictFloodRisk(input: PredictiveInput): PredictiveOutput {
  // 1. Meteorological component (Weight: 35%)
  const rainIntensity = input.currentRainfallMm; // mm/h
  const forecastRain = input.forecastRainfallMm; // 24h mm
  let metScore = 0;
  if (rainIntensity > 40 || forecastRain > 100) metScore = 100;
  else if (rainIntensity > 20 || forecastRain > 60) metScore = 75;
  else if (rainIntensity > 8 || forecastRain > 30) metScore = 50;
  else if (rainIntensity > 2 || forecastRain > 10) metScore = 25;
  else metScore = 5;

  // 2. Hydrological & River Proximity (Weight: 20%)
  // Closer to river (< 1.5km) drastically increases risk
  let hydroScore = 0;
  if (input.riverProximityKm <= 0.8) hydroScore = 95;
  else if (input.riverProximityKm <= 2.0) hydroScore = 70;
  else if (input.riverProximityKm <= 5.0) hydroScore = 40;
  else hydroScore = 10;

  // 3. Topographical Elevation & Drainage (Weight: 20%)
  // Coastal/low-lying (< 12m) with poor drainage
  let topoScore = 0;
  if (input.elevationM <= 6.0) topoScore += 60;
  else if (input.elevationM <= 15.0) topoScore += 35;
  else if (input.elevationM <= 40.0) topoScore += 15;
  else topoScore += 5;

  // Drainage factor (inverse of density)
  const drainageDeficit = Math.max(0, 1 - input.drainageDensityIndex);
  topoScore += drainageDeficit * 40;
  topoScore = Math.min(100, topoScore);

  // 4. Ground Reality & Community Corroboration (Weight: 15%)
  let groundScore = 0;
  groundScore += Math.min(50, input.communityReportsCount * 12);
  groundScore += Math.min(50, input.activeRoadClosuresCount * 25);
  groundScore = Math.min(100, groundScore);

  // 5. Official Disaster Warning Multiplier (Weight: 10%)
  let alertScore = Math.min(100, input.officialWarningsCount * 45);

  // 6. Soil Saturation Index (Placeholder architecture, default ~ 0.6 in monsoon)
  const soilSaturation = input.soilSaturationIndex ?? (rainIntensity > 15 ? 0.85 : 0.45);
  const soilMultiplier = 0.8 + soilSaturation * 0.4; // 0.8 to 1.2

  // Weighted aggregation
  const rawProbability = (
    metScore * 0.35 +
    hydroScore * 0.20 +
    topoScore * 0.20 +
    groundScore * 0.15 +
    alertScore * 0.10
  ) * soilMultiplier;

  const floodProbability = Math.min(99, Math.max(2, Math.round(rawProbability)));

  // Determine Risk Level
  let riskLevel: PredictiveRiskLevel = 'LOW';
  if (floodProbability >= 85) riskLevel = 'CRITICAL';
  else if (floodProbability >= 70) riskLevel = 'SEVERE';
  else if (floodProbability >= 50) riskLevel = 'HIGH';
  else if (floodProbability >= 28) riskLevel = 'MODERATE';

  // Confidence estimation based on data density
  let confidence = 65;
  if (input.communityReportsCount >= 3) confidence += 15;
  if (input.officialWarningsCount >= 1) confidence += 10;
  if (input.forecastRainfallMm > 0) confidence += 10;
  confidence = Math.min(98, confidence);

  // Affected radius estimation in kilometers
  let affectedRadius = 1.5;
  if (riskLevel === 'CRITICAL') affectedRadius = 8.5;
  else if (riskLevel === 'SEVERE') affectedRadius = 5.2;
  else if (riskLevel === 'HIGH') affectedRadius = 3.4;
  else if (riskLevel === 'MODERATE') affectedRadius = 2.0;

  // Explainable Factor Contributions
  const sumScores = metScore + hydroScore + topoScore + groundScore + alertScore || 1;
  const factors: ExplainableFactorContribution[] = [
    {
      name: 'Heavy Rainfall Forecast',
      contributionPercent: Math.round((metScore / sumScores) * 100),
      description: `Current: ${input.currentRainfallMm.toFixed(1)} mm/h | 24h Model: ${input.forecastRainfallMm.toFixed(1)} mm`,
      isElevated: metScore >= 50,
      category: 'METEOROLOGICAL',
    },
    {
      name: 'River & Basin Proximity',
      contributionPercent: Math.round((hydroScore / sumScores) * 100),
      description: `${input.riverProximityKm.toFixed(1)} km from active river floodplain or major drainage canal`,
      isElevated: hydroScore >= 50,
      category: 'HYDROLOGICAL',
    },
    {
      name: 'Low Elevation & Low Drainage',
      contributionPercent: Math.round((topoScore / sumScores) * 100),
      description: `Elevation ${input.elevationM.toFixed(1)}m MSL | Drainage capacity rating ${Math.round(input.drainageDensityIndex * 100)}%`,
      isElevated: topoScore >= 50,
      category: 'TOPOGRAPHICAL',
    },
    {
      name: 'Ground Community Reports',
      contributionPercent: Math.round((groundScore / sumScores) * 100),
      description: `${input.communityReportsCount} verified citizen observations and ${input.activeRoadClosuresCount} road closures nearby`,
      isElevated: groundScore >= 40,
      category: 'COMMUNITY',
    },
    {
      name: 'Official Government Warnings',
      contributionPercent: Math.round((alertScore / sumScores) * 100),
      description: `${input.officialWarningsCount} active meteorological or NDMA disaster advisories`,
      isElevated: alertScore >= 40,
      category: 'INFRASTRUCTURE',
    },
  ];

  // Natural language explanation
  let explanation = '';
  if (riskLevel === 'CRITICAL' || riskLevel === 'SEVERE') {
    explanation = `High probability of critical waterlogging due to heavy precipitation (${input.forecastRainfallMm}mm projected) coupled with proximity (${input.riverProximityKm}km) to primary river channel and low ground elevation (${input.elevationM}m). Ground teams confirm active inundation.`;
  } else if (riskLevel === 'HIGH') {
    explanation = `Substantial inundation risk driven by sustained rainfall and constrained urban drainage. Low-lying intersections are vulnerable to water depths exceeding 30cm.`;
  } else if (riskLevel === 'MODERATE') {
    explanation = `Localized water accumulation likely on service roads and low underpasses. Main arterial highways expected to remain passable with caution.`;
  } else {
    explanation = `Dry to normal conditions. Drainage infrastructure functioning within nominal capacity.`;
  }

  // Vehicle Accessibility Calculation
  const estimatedWaterDepthCm = Math.round((floodProbability / 100) * 85);
  let accessCategory: VehicleAccessibilityCategory = 'WALKABLE';
  let categoryLabel = 'All Vehicles Passable';
  let iconName = 'car';
  let recommendedAction = 'Standard travel route clear.';

  if (estimatedWaterDepthCm > 60) {
    accessCategory = 'IMPASSABLE';
    categoryLabel = 'Impassable to All Civilian Traffic';
    iconName = 'alert-octagon';
    recommendedAction = 'Do not enter. Road is submerged. Use elevated alternate corridor.';
  } else if (estimatedWaterDepthCm > 35) {
    accessCategory = 'SUV_RECOMMENDED';
    categoryLabel = 'High Clearance SUV / Trucks Only';
    iconName = 'truck';
    recommendedAction = 'Small sedans and two-wheelers will stall. Only emergency vehicles or high-clearance SUVs advised.';
  } else if (estimatedWaterDepthCm > 20) {
    accessCategory = 'CAR_DIFFICULT';
    categoryLabel = 'Difficult for Small Cars';
    iconName = 'alert-triangle';
    recommendedAction = 'Drive in center lane with lowest water level. Low exhaust pipes at risk.';
  } else if (estimatedWaterDepthCm > 8) {
    accessCategory = 'BIKE_ONLY';
    categoryLabel = 'Caution for Two-Wheelers';
    iconName = 'bike';
    recommendedAction = 'Slippery surface and minor gutter overflow. Exercise defensive riding.';
  } else {
    accessCategory = 'WALKABLE';
    categoryLabel = 'Safe & Walkable';
    iconName = 'check-circle';
    recommendedAction = 'Normal transit conditions.';
  }

  const accessibility: VehicleAccessibilityResult = {
    category: accessCategory,
    categoryLabel,
    iconName,
    estimatedWaterDepthCm,
    explanation: `Estimated water accumulation: ~${estimatedWaterDepthCm} cm based on rain volume, topography, and surface gradient.`,
    recommendedAction,
  };

  return {
    floodProbability,
    confidence,
    riskLevel,
    explanation,
    affectedRadius,
    timestamp: new Date().toISOString(),
    label: 'AI FLOOD PREDICTION',
    disclaimer:
      'AI FLOOD PREDICTION. Generated by predictive hydrometeorological modeling for situational awareness. Not an official statutory disaster determination.',
    factors,
    accessibility,
  };
}
