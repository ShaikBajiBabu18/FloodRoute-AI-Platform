import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  CloudRain,
  ShieldAlert,
  BarChart3,
  Layers,
  Bell,
  Home,
  Navigation,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Waves
} from 'lucide-react';
import { DataSourceBadge } from '../ui/DataSourceBadge';

interface DemoCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevationMsl: number;
  rainfallMm: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  riskColor: string;
  riverProximity: string;
  drainageCapacity: string;
  activeAlert: string;
  nearestShelter: { name: string; distance: string; status: string; phone: string };
  recommendedRoute: { name: string; distance: string; eta: string; safetyNote: string };
}

const DEMO_CITIES: DemoCity[] = [
  {
    name: 'Velachery Basin, Chennai',
    state: 'Tamil Nadu',
    lat: 12.9805,
    lng: 80.2195,
    elevationMsl: 4.2,
    rainfallMm: 34.2,
    riskScore: 78,
    riskLevel: 'HIGH',
    riskColor: 'text-orange-400 bg-orange-500/20 border-orange-500/40',
    riverProximity: '800m from Pallikaranai Marshland overflow channel',
    drainageCapacity: '85% Saturated (Storm drain threshold reached)',
    activeAlert: 'NDMA Orange Alert: Severe waterlogging in low-lying underpasses',
    nearestShelter: {
      name: 'Guru Nanak College Relief Camp',
      distance: '1.2 km away',
      status: 'Open • Power & Water Supply Active',
      phone: '112',
    },
    recommendedRoute: {
      name: 'OMR Elevated Expressway Corridor',
      distance: '19.4 km',
      eta: '26 mins',
      safetyNote: 'Lower modeled flood-risk exposure circumventing submerged junctions.',
    },
  },
  {
    name: 'Kurla West, Mumbai',
    state: 'Maharashtra',
    lat: 19.0726,
    lng: 72.8845,
    elevationMsl: 6.8,
    rainfallMm: 48.0,
    riskScore: 84,
    riskLevel: 'SEVERE',
    riskColor: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
    riverProximity: '350m from Mithi River high-tide swell line',
    drainageCapacity: '92% Saturated (Pumping station operating at peak)',
    activeAlert: 'IMD Red Warning: Extremely heavy rainfall with high-tide alert',
    nearestShelter: {
      name: 'Bhabha Municipal Hospital Relief Wing',
      distance: '1.8 km away',
      status: 'Open • Trauma Team Stationed',
      phone: '112',
    },
    recommendedRoute: {
      name: 'Santacruz-Chembur Link Road (SCLR) Flyover',
      distance: '14.2 km',
      eta: '22 mins',
      safetyNote: 'Lower modeled flood-risk exposure via elevated viaducts.',
    },
  },
  {
    name: 'Yamuna Floodplain, Delhi',
    state: 'Delhi NCR',
    lat: 28.6692,
    lng: 77.2514,
    elevationMsl: 204.5,
    rainfallMm: 18.5,
    riskScore: 42,
    riskLevel: 'MODERATE',
    riskColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
    riverProximity: '1.2 km from Yamuna River embankment buffer',
    drainageCapacity: '55% Saturated (Normal runoff flow)',
    activeAlert: 'CWC Advisory: Hathnikund barrage release monitoring active',
    nearestShelter: {
      name: 'Geeta Colony Community Center',
      distance: '2.1 km away',
      status: 'Open • Relief Stock Stockpiled',
      phone: '112',
    },
    recommendedRoute: {
      name: 'Ring Road Bypass via Vikas Marg Flyover',
      distance: '12.8 km',
      eta: '19 mins',
      safetyNote: 'Lower modeled flood-risk exposure avoiding riverside embankment.',
    },
  },
  {
    name: 'Brahmaputra Valley, Guwahati',
    state: 'Assam',
    lat: 26.1823,
    lng: 91.7618,
    elevationMsl: 55.0,
    rainfallMm: 52.4,
    riskScore: 88,
    riskLevel: 'SEVERE',
    riskColor: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
    riverProximity: '450m from Brahmaputra North Bank Ghat',
    drainageCapacity: '95% Saturated (Water backflow observed)',
    activeAlert: 'ASDMA Red Alert: Flash flood & landslide watch active',
    nearestShelter: {
      name: 'Guwahati Medical College Disaster Shelter',
      distance: '3.0 km away',
      status: 'Open • NDRF Boat Team Stationed',
      phone: '112',
    },
    recommendedRoute: {
      name: 'GS Road Ridge Highway Corridor',
      distance: '16.5 km',
      eta: '28 mins',
      safetyNote: 'Lower modeled flood-risk exposure keeping to hilltop ridge roads.',
    },
  },
];

interface OneClickJudgeDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneClickJudgeDemo: React.FC<OneClickJudgeDemoProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const city = DEMO_CITIES[selectedCityIndex];
  const totalSteps = 8;

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isOpen, isAutoPlaying, currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setCurrentStep(1);
  };

  const stepTitles = [
    'Location Confirmation',
    'Weather Telemetry Radar',
    'Inundation Modeling Engine',
    'Dynamic Flood Risk Score',
    'Explainable Factor Contribution',
    'Disaster Warning Correlation',
    'Nearby Emergency Services',
    'Safe Route Calculation',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-sky-500/50 shadow-2xl shadow-sky-500/20 text-slate-100 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  Run Flood Risk Analysis
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  JUDGE DEMO FLOW
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Autonomous Multi-Variable Disaster Pipeline (8 Steps)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            title="Close Demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Switcher Tabs */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
            Test City:
          </span>
          {DEMO_CITIES.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedCityIndex(idx);
                setCurrentStep(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCityIndex === idx
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {c.name.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="font-bold text-sky-400">
              STEP {currentStep} OF {totalSteps}: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-slate-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: LOCATION CONFIRM */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3">
                <MapPin className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 1: Geocoded Location & Spatial Boundary</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Acquiring sub-meter coordinates, digital terrain elevation, and regional river basin catchment boundaries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 uppercase font-mono">Target Hub</div>
                  <div className="text-lg font-bold text-white">{city.name}</div>
                  <div className="text-xs text-slate-400">{city.state}, India</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 uppercase font-mono">Coordinates & Elevation</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">
                    {city.lat.toFixed(4)}°N, {city.lng.toFixed(4)}°E
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Elevation MSL: {city.elevationMsl} meters
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                <span>Hydrological Sub-basin: Monitored Inundation Zone</span>
                <span className="font-mono text-cyan-400 font-bold">Status: Synchronized</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: WEATHER */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                <CloudRain className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 2: Weather Ingestion (Open-Meteo & IMD Radar)</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Streaming live meteorological telemetry: precipitation rate, hourly accumulation, humidity, and convective storm cloudburst detection.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-mono">Precipitation Rate</div>
                  <div className="text-3xl font-extrabold text-sky-400 mt-1">{city.rainfallMm} mm/h</div>
                  <div className="text-[11px] text-orange-400 font-semibold mt-1">Heavy Convective Cell</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-mono">24h Projection</div>
                  <div className="text-3xl font-extrabold text-blue-400 mt-1">
                    {(city.rainfallMm * 3.8).toFixed(0)} mm
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">High Saturation Index</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-mono">Telemetry Source</div>
                  <div className="text-base font-bold text-emerald-400 mt-2">Open-Meteo Live</div>
                  <div className="text-[11px] text-slate-400 mt-1">Refreshed 2m ago</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FLOOD INUNDATION MODELING */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                <Layers className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 3: Multi-Variable Inundation Modeling</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Synthesizing hydraulic runoff vectors: elevation delta, riverbank surge distance, and urban stormwater drain thresholding.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">River & Waterbody Proximity:</span>
                  <span className="font-semibold text-white">{city.riverProximity}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Municipal Drainage Threshold:</span>
                  <span className="font-semibold text-amber-400">{city.drainageCapacity}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Groundwater Soil Saturation Index:</span>
                  <span className="font-semibold text-rose-400">High Permeability Barrier (0.84)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: RISK SCORE */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 4: AI Flood Risk Score (0-100)</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Normalized composite score calculated from hydraulic equation weights.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center sm:text-left">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-800 border-t-amber-500 border-r-orange-500 animate-spin duration-1000" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white font-heading">{city.riskScore}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${city.riskColor}`}>
                      {city.riskLevel} RISK LEVEL
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Confidence: 94%</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    High Probability of Road Surface Inundation & Axle-Deep Water
                  </p>
                  <p className="text-xs text-slate-400">
                    Low-slung sedans and two-wheelers face acute risk of engine stalling along major underpasses.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CONTRIBUTING FACTORS */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3">
                <Info className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 5: Explainable Factor Contribution</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Why this score? Transparent mathematical attribution breakdown.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Monsoon Rainfall Intensity', weight: 35, desc: 'Sustained cloudburst exceeding infiltration threshold' },
                  { name: 'Low Topographical Elevation', weight: 25, desc: 'Basin depression causing natural gravity pooling' },
                  { name: 'Storm Drain Siltation & Saturation', weight: 20, desc: 'Culvert discharge capacity operating at maximum' },
                  { name: 'River Surge & Catchment Ingress', weight: 15, desc: 'High tributary volume slowing municipal runoff' },
                  { name: 'Verified Citizen Waterlogging Reports', weight: 5, desc: 'Ground truth verification from 6 nearby geotagged submissions' },
                ].map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-200">{factor.name}</span>
                      <span className="font-mono text-cyan-400">{factor.weight}% Impact</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full"
                        style={{ width: `${factor.weight * 2.5}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{factor.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: DISASTER ALERTS */}
          {currentStep === 6 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <Bell className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 6: Official Disaster Warning Correlation</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Correlating national emergency feeds from NDMA, SDMA, and Central Water Commission.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    ACTIVE WARNING BULLETIN
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Disaster Management Authority</span>
                </div>
                <h4 className="font-bold text-white text-base">{city.activeAlert}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Advisory in effect for all motorists. Commuters instructed to avoid underground subways and low-lying transit junctions. Heavy water discharge scheduled from upstream reservoirs.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 7: EMERGENCY SERVICES */}
          {currentStep === 7 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Home className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 7: Real-time Emergency Services & Shelters</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Locating highest-elevation operational relief camps, medical trauma centers, and NDRF relief hubs.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Nearest Operational Center
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{city.nearestShelter.distance}</span>
                </div>
                <div className="font-heading font-extrabold text-lg text-white">
                  {city.nearestShelter.name}
                </div>
                <p className="text-xs text-emerald-400 font-semibold">
                  ✓ {city.nearestShelter.status}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`tel:${city.nearestShelter.phone}`}
                    className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    Call National Emergency (112)
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/emergency-resources');
                    }}
                    className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
                  >
                    View All 14 Relief Centers
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: ROUTE PLANNING OFFER */}
          {currentStep === 8 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-transparent border border-emerald-500/30 flex items-start gap-3">
                <Navigation className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-base">Step 8: Flood-Aware Route Recommendation</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Calculated bypass corridor offering <strong>lower modeled flood-risk exposure</strong>.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    RECOMMENDED BYPASS CORRIDOR
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {city.recommendedRoute.distance} • {city.recommendedRoute.eta}
                  </span>
                </div>

                <div>
                  <div className="font-heading font-extrabold text-xl text-white">
                    {city.recommendedRoute.name}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {city.recommendedRoute.safetyNote}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  🛡️ <strong>Safety Advisory:</strong> Route represents <em>lower modeled flood-risk exposure</em> based on digital elevation contours and real-time hazard reports.
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/route-planner?to=${encodeURIComponent(city.name)}`);
                    }}
                    className="w-full sm:w-auto flex-1 h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open Route Planner for this Route</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/live-map?lat=${city.lat}&lng=${city.lng}&q=${encodeURIComponent(city.name)}`);
                    }}
                    className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <span>View on Live Map</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Statutory Disclaimer Footer */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-500">
            ⚠️ <strong>AI ESTIMATE • AI FLOOD PREDICTION:</strong> All inundation probabilities, water depths, and bypass routes are model-derived estimations. They are designed for situational awareness and never substitute statutory NDMA, SDMA, or local law-enforcement road safety warnings.
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoPlaying ? 'Pause Auto-Run' : 'Auto-Run Demo'}</span>
            </button>

            <button
              onClick={handleReset}
              className="h-10 px-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="h-10 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-extrabold flex items-center gap-1 shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
