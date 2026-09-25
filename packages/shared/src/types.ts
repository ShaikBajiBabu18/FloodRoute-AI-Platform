export type UserRole = 'CITIZEN' | 'ANALYST' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type HazardType = 
  | 'FLOODED_ROAD'
  | 'WATERLOGGING'
  | 'ROAD_BLOCKED'
  | 'BRIDGE_CLOSED'
  | 'LANDSLIDE'
  | 'FALLEN_TREE'
  | 'ACCIDENT'
  | 'OTHER';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WaterLevel = 
  | 'PASSABLE'
  | 'DIFFICULT_SMALL'
  | 'DIFFICULT_CARS'
  | 'IMPASSABLE'
  | 'UNKNOWN';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';

export type RoadConditionStatus = 'SAFE' | 'CAUTION' | 'FLOODED' | 'BLOCKED' | 'UNKNOWN';

export type AlertSeverity = 'INFO' | 'CAUTION' | 'WARNING' | 'DANGER' | 'CRITICAL';

export type AlertSourceType = 'NDMA_SACHET' | 'IMD' | 'CWC' | 'PLATFORM_FLOODROUTE' | 'COMMUNITY';

export type ResourceCategory = 
  | 'HOSPITAL' 
  | 'POLICE_STATION' 
  | 'FIRE_STATION' 
  | 'SHELTER' 
  | 'RELIEF_CENTER' 
  | 'EMERGENCY_SERVICE';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataSourceType = 'OFFICIAL' | 'COMMUNITY' | 'WEATHER_DERIVED' | 'AI_ESTIMATE' | 'DEMO';

export interface DataSourceMeta {
  source: string;
  sourceType: DataSourceType;
  lastUpdated: string;
  isStale?: boolean;
  status: 'LIVE' | 'STALE' | 'UNAVAILABLE' | 'DEMO';
  confidence?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationSearchResult {
  id?: string;
  displayName: string;
  name: string;
  district?: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  type?: string;
}

export interface AIAnalysisResult {
  id?: string;
  floodDetected: boolean;
  estimatedSeverity: SeverityLevel;
  roadVisibility: 'CLEAR' | 'PARTIALLY_SUBMERGED' | 'COMPLETELY_SUBMERGED' | 'UNKNOWN';
  vehicleAccessibility: 'PASSABLE' | 'DIFFICULT' | 'IMPASSABLE' | 'UNKNOWN';
  confidence: number;
  waterCoveragePercent?: number;
  dominantColor?: string;
  explanation: string;
  disclaimer: string;
  analyzedAt: string;
}

export interface RiskFactor {
  factor: string;
  scoreImpact: number;
  description: string;
  source: string;
  category: 'WEATHER' | 'REPORTS' | 'ROAD_CLOSURE' | 'OFFICIAL_ALERT' | 'TOPOGRAPHY';
}

export interface CalculatedRisk {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  reasons: string[];
  factors: RiskFactor[];
  sources: DataSourceMeta[];
  timestamp: string;
  disclaimer: string;
}

export interface RouteStep {
  instruction: string;
  distanceKm: number;
  durationMin: number;
  startLocation: [number, number]; // [lng, lat]
  endLocation: [number, number];
}

export interface RouteOption {
  id: string;
  title: string;
  distanceKm: number;
  durationMinutes: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [longitude, latitude]
  };
  steps: RouteStep[];
  floodRisk: RiskLevel;
  weatherRisk: RiskLevel;
  overallRisk: RiskLevel;
  hazardsCount: number;
  officialAlertsCount: number;
  riskReasons: string[];
  riskScore: number;
  isRecommended: boolean;
}

export interface WeatherCurrent {
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  pressureHpa: number;
  cloudCoverPercent: number;
  rainfallMm: number;
  visibilityKm: number;
  condition: string;
  weatherRisk: RiskLevel;
  source: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  isDemo?: boolean;
}

export interface WeatherHourlyForecast {
  time: string;
  temperatureC: number;
  rainfallMm: number;
  popPercent: number;
  condition: string;
  windSpeedKmh: number;
}

export interface WeatherDailyForecast {
  date: string;
  minTempC: number;
  maxTempC: number;
  rainfallMm: number;
  condition: string;
  riskLevel: RiskLevel;
}

export interface WeatherForecast {
  current: WeatherCurrent;
  hourly: WeatherHourlyForecast[];
  daily: WeatherDailyForecast[];
  sourceMeta: DataSourceMeta;
}

export interface FloodReportItem {
  id: string;
  reportCode: string;
  title?: string | null;
  hazardType: HazardType;
  severity: SeverityLevel;
  waterLevel: WaterLevel;
  latitude: number;
  longitude: number;
  locationName: string;
  district?: string | null;
  state?: string | null;
  description: string;
  imageUrl?: string | null;
  status: ReportStatus;
  reportedAt: string;
  verifiedAt?: string | null | Date;
  userId?: string | null;
  reporterName?: string | null;
  aiAnalysis?: any;
  isDemo?: boolean;
  upvotes?: number;
  corroboratingReportsCount?: number;
}

export interface DisasterAlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: AlertSourceType;
  sourceLabel: string;
  locationName: string;
  state?: string | null;
  district?: string | null;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  startTime: string;
  expiryTime: string;
  isActive: boolean;
  isOfficial: boolean;
  isDemo?: boolean;
}

export interface EmergencyResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  categoryLabel: string;
  address: string;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  isOpen?: boolean;
  notes?: string | null;
  isDemo?: boolean;
}

export interface RoadConditionItem {
  id: string;
  roadName: string;
  locationName: string;
  condition: RoadConditionStatus;
  severity: SeverityLevel;
  reason: string;
  latitude: number;
  longitude: number;
  startLatitude?: number | null;
  startLongitude?: number | null;
  endLatitude?: number | null;
  endLongitude?: number | null;
  source: string;
  isOfficial: boolean;
  startTime: string;
  expectedResolutionTime?: string | null | Date;
  updatedAt: string;
  isDemo?: boolean;
}

// ==========================================
// 1. AI Flood Prediction Engine Types
// ==========================================
export type PredictiveRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'CRITICAL';

export interface PredictiveInput {
  currentRainfallMm: number;
  forecastRainfallMm: number;
  historicalRainfallMm?: number;
  elevationM: number;
  riverProximityKm: number;
  drainageDensityIndex: number; // 0 (poor/blocked) to 1 (optimal)
  communityReportsCount: number;
  activeRoadClosuresCount: number;
  soilSaturationIndex?: number; // 0 to 1 (placeholder architecture)
  officialWarningsCount: number;
  locationName?: string;
  latitude?: number;
  longitude?: number;
}

export interface ExplainableFactorContribution {
  name: string;
  contributionPercent: number; // e.g. 35
  description: string;
  isElevated: boolean;
  category: 'METEOROLOGICAL' | 'HYDROLOGICAL' | 'TOPOGRAPHICAL' | 'COMMUNITY' | 'INFRASTRUCTURE';
}

export interface PredictiveOutput {
  floodProbability: number; // 0 - 100%
  confidence: number; // 0 - 100%
  riskLevel: PredictiveRiskLevel;
  explanation: string;
  affectedRadius: number; // in km
  timestamp: string;
  label: 'AI FLOOD PREDICTION' | 'AI ESTIMATE';
  disclaimer: string;
  factors: ExplainableFactorContribution[];
  accessibility: VehicleAccessibilityResult;
}

// ==========================================
// 2. Road Accessibility Model Types
// ==========================================
export type VehicleAccessibilityCategory =
  | 'WALKABLE'
  | 'BIKE_ONLY'
  | 'CAR_DIFFICULT'
  | 'SUV_RECOMMENDED'
  | 'IMPASSABLE';

export interface VehicleAccessibilityResult {
  category: VehicleAccessibilityCategory;
  categoryLabel: string;
  iconName: string;
  estimatedWaterDepthCm: number;
  explanation: string;
  recommendedAction: string;
}

// ==========================================
// 3. AI Chat Assistant (FloodRoute Copilot)
// ==========================================
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    params?: any;
  }[];
  sources?: string[];
}

// ==========================================
// 4. River Monitoring Dashboard Types
// ==========================================
export interface RiverStation {
  id: string;
  riverName: string;
  station: string;
  state: string;
  district: string;
  currentLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  hflLevelM: number; // Highest Flood Level
  trend: 'RISING' | 'STEADY' | 'FALLING';
  status: 'NORMAL' | 'WARNING' | 'DANGER';
  dischargeCusecs: number;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

// ==========================================
// 5. District Command Telemetry Types
// ==========================================
export interface DistrictTelemetry {
  districtName: string;
  state: string;
  riskScore: number;
  riskLevel: PredictiveRiskLevel;
  weather: {
    tempC: number;
    rainfallMm: number;
    condition: string;
  };
  reportsCount: number;
  roadClosuresCount: number;
  alertsCount: number;
  resourcesCount: number;
  populationAtRisk: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// ==========================================
// 6. Gamification & Community Badges
// ==========================================
export interface ContributionBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'SENTINEL';
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  district: string;
  reportsSubmitted: number;
  reportsVerified: number;
  points: number;
  badge: string;
}

// ==========================================
// 7. Multilingual Support
// ==========================================
export type LanguageLocale = 'en' | 'ta' | 'te' | 'hi' | 'kn';
