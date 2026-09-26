export interface DemoLocationConfig {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  elevationMsl: number;
  drainageBasin: string;
}

export interface DemoRouteConfig {
  originName: string;
  originLat: number;
  originLng: number;
  destinationName: string;
  destLat: number;
  destLng: number;
}

export interface DemoScenarioData {
  location: DemoLocationConfig;
  route: DemoRouteConfig;
  weather: {
    tempC: number;
    condition: string;
    rainfallMmH: number;
    accumulation24hMm: number;
    windSpeedKmh: number;
    humidity: number;
  };
  floodRisk: {
    score: number;
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
    confidence: number;
    timestamp: string;
    factors: {
      name: string;
      weight: string;
      score: number;
      impact: string;
      description: string;
    }[];
  };
  alerts: {
    id: string;
    title: string;
    severity: 'RED' | 'ORANGE' | 'YELLOW';
    issuedBy: string;
    description: string;
    guidance: string;
  }[];
  emergencyServices: {
    name: string;
    type: string;
    distance: string;
    elevationMsl: number;
    capacity: number;
    status: string;
    phone: string;
  }[];
  routeComparison: {
    safestRoute: {
      name: string;
      distanceKm: number;
      durationMins: number;
      riskExposure: string;
      elevationSummary: string;
      hazardNotes: string;
    };
    directRoute: {
      name: string;
      distanceKm: number;
      durationMins: number;
      riskExposure: string;
      elevationSummary: string;
      hazardNotes: string;
    };
  };
  aiExplanation: {
    initialSummary: string;
    sampleQuestions: string[];
    factorDetails: string;
  };
}

// Configurable via Vite environment variables with robust fallbacks
const DEMO_LOCATION_NAME =
  import.meta.env.VITE_DEMO_LOCATION_NAME || 'Velachery Basin, Chennai';
const DEMO_LATITUDE = parseFloat(
  import.meta.env.VITE_DEMO_LATITUDE || '12.9805'
);
const DEMO_LONGITUDE = parseFloat(
  import.meta.env.VITE_DEMO_LONGITUDE || '80.2195'
);

const DEMO_DEST_NAME =
  import.meta.env.VITE_DEMO_DEST_NAME || 'Chennai Central Station';
const DEMO_DEST_LAT = parseFloat(
  import.meta.env.VITE_DEMO_DEST_LAT || '13.0827'
);
const DEMO_DEST_LNG = parseFloat(
  import.meta.env.VITE_DEMO_DEST_LNG || '80.2707'
);

export const DEMO_CONFIG: DemoScenarioData = {
  location: {
    name: DEMO_LOCATION_NAME,
    state: 'Tamil Nadu',
    latitude: DEMO_LATITUDE,
    longitude: DEMO_LONGITUDE,
    elevationMsl: 4.2,
    drainageBasin: 'Pallikaranai Marshland Catchment',
  },
  route: {
    originName: DEMO_LOCATION_NAME,
    originLat: DEMO_LATITUDE,
    originLng: DEMO_LONGITUDE,
    destinationName: DEMO_DEST_NAME,
    destLat: DEMO_DEST_LAT,
    destLng: DEMO_DEST_LNG,
  },
  weather: {
    tempC: 28.5,
    condition: 'Torrential Monsoon Cloudburst',
    rainfallMmH: 34.2,
    accumulation24hMm: 110.5,
    windSpeedKmh: 42.0,
    humidity: 94,
  },
  floodRisk: {
    score: 78,
    level: 'HIGH',
    confidence: 94,
    timestamp: 'Model-estimated (Simulated Demo Scenario)',
    factors: [
      {
        name: 'Heavy Cloudburst Rainfall',
        weight: '35%',
        score: 85,
        impact: 'High',
        description:
          '34.2 mm/h rain rate with 110mm 24-hr antecedent accumulation exceeding local culvert discharge.',
      },
      {
        name: 'Low Topographical Elevation',
        weight: '25%',
        score: 90,
        impact: 'Critical',
        description:
          'Terrain elevation is 4.2m MSL in a saucer-shaped basin surrounded by higher residential plateaus.',
      },
      {
        name: 'Drainage Canal Saturation',
        weight: '20%',
        score: 75,
        impact: 'Elevated',
        description:
          'Municipal stormwater discharge channels operating at 85% capacity with backflow risk.',
      },
      {
        name: 'Basin & Lake Proximity',
        weight: '15%',
        score: 65,
        impact: 'Moderate',
        description:
          'Located 800m from Pallikaranai marshland overflow channel.',
      },
      {
        name: 'Crowdsourced Ground Reports',
        weight: '5%',
        score: 70,
        impact: 'Corroborated',
        description:
          '3 verified citizen reports of 35cm standing water in low-lying underpasses.',
      },
    ],
  },
  alerts: [
    {
      id: 'ALERT-DEMO-01',
      title: 'NDMA Inundation Advisory: Velachery Low Basin',
      severity: 'ORANGE',
      issuedBy: 'SDMA / NDMA Prototype Simulation',
      description:
        'Continuous localized rain causing water accumulation in road underpasses. Low-clearance hatchbacks and two-wheelers avoid inner link roads.',
      guidance:
        'Avoid low-lying subways. Follow elevated bypass routes. Emergency shelters open on high ground.',
    },
  ],
  emergencyServices: [
    {
      name: 'Guru Nanak College Relief Shelter',
      type: 'High-Ground Community Shelter',
      distance: '1.2 km away',
      elevationMsl: 14.5,
      capacity: 450,
      status: 'Open 24/7 • Power & Water Active',
      phone: '112',
    },
    {
      name: 'Velachery Municipal Health Post',
      type: 'Trauma & First Aid Station',
      distance: '0.8 km away',
      elevationMsl: 9.8,
      capacity: 120,
      status: 'Open 24/7 • Paramedic On-site',
      phone: '112',
    },
  ],
  routeComparison: {
    safestRoute: {
      name: 'OMR Elevated Bypass Flyover',
      distanceKm: 19.4,
      durationMins: 26,
      riskExposure: 'Lower Modeled Flood-Risk Exposure',
      elevationSummary: 'Average 12m MSL via elevated viaduct',
      hazardNotes: 'Bypasses 2 submerged subways and low-lying railway underpass.',
    },
    directRoute: {
      name: 'Direct Mount Road Corridor',
      distanceKm: 18.0,
      durationMins: 20,
      riskExposure: 'High Water Ingress Hazard',
      elevationSummary: 'Depression basin 3.8m MSL at km 4.2',
      hazardNotes: 'Passes directly through 45cm standing water near canal bridge.',
    },
  },
  aiExplanation: {
    initialSummary:
      'The current flood risk for Velachery Basin is evaluated at 78/100 (HIGH). This model-estimated risk is primarily driven by 34.2 mm/h heavy rain falling on a low-lying 4.2m MSL saucer basin with 85% saturated storm drains. Elevated bypass routes avoid critical waterlogging points.',
    sampleQuestions: [
      'Why is the flood risk elevated?',
      'How is this score calculated?',
      'What should I check before travelling?',
      'Where is the nearest high-ground shelter?',
    ],
    factorDetails:
      'Calculated via multi-factor deterministic equation: Rain (35%) + Elevation (25%) + Drainage (20%) + River Proximity (15%) + Crowd Ground Truth (5%).',
  },
};
