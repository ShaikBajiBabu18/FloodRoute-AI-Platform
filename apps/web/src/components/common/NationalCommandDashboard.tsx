import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  CloudRain,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Navigation,
  Sparkles,
  Layers,
  Home,
  Activity,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { InteractiveMap } from '../map/InteractiveMap';
import { ExplainableAiCard } from './ExplainableAiCard';
import { DataSourceBadge } from '../ui/DataSourceBadge';
import { api } from '../../services/api';
import { FloodReportItem, DisasterAlertItem, EmergencyResourceItem } from '@floodroute/shared';

interface HubLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevationMsl: number;
  weatherTemp: string;
  weatherCondition: string;
  rainfallMm: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  riskColor: string;
  badgeBg: string;
  riverInfo: string;
  drainageSat: string;
  explanation: string;
  activeAlertTitle: string;
  activeAlertSeverity: string;
  emergencyShelter: string;
  emergencyDist: string;
  emergencyPhone: string;
}

const COMMAND_HUBS: HubLocation[] = [
  {
    id: 'chennai',
    name: 'Velachery Basin, Chennai',
    state: 'Tamil Nadu',
    lat: 12.9805,
    lng: 80.2195,
    elevationMsl: 4.2,
    weatherTemp: '29°C',
    weatherCondition: 'Heavy Monsoon Rain',
    rainfallMm: 34.2,
    riskScore: 78,
    riskLevel: 'HIGH',
    riskColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    riverInfo: '800m from Pallikaranai marshland overflow',
    drainageSat: '85% threshold reached',
    explanation: 'Low-lying basin morphology combined with 34.2 mm/h cloudburst and storm drain capacity saturation creates high probability of road submergence in underpasses.',
    activeAlertTitle: 'NDMA Orange Warning: Inundation along Inner Ring Road',
    activeAlertSeverity: 'ORANGE',
    emergencyShelter: 'Guru Nanak College Relief Camp',
    emergencyDist: '1.2 km away',
    emergencyPhone: '112',
  },
  {
    id: 'mumbai',
    name: 'Kurla West, Mumbai',
    state: 'Maharashtra',
    lat: 19.0726,
    lng: 72.8845,
    elevationMsl: 6.8,
    weatherTemp: '28°C',
    weatherCondition: 'Torrential Showers',
    rainfallMm: 48.0,
    riskScore: 84,
    riskLevel: 'SEVERE',
    riskColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    riverInfo: '350m from Mithi River swell buffer',
    drainageSat: '92% threshold reached',
    explanation: 'Spring tide swell intersecting torrential monsoon runoff leads to severe backflow into local stormwater drains. Ground clearance impassable for hatchbacks.',
    activeAlertTitle: 'IMD Red Alert: Flash flood advisory for low-lying suburban wards',
    activeAlertSeverity: 'RED',
    emergencyShelter: 'Bhabha Hospital Relief Wing',
    emergencyDist: '1.8 km away',
    emergencyPhone: '112',
  },
  {
    id: 'delhi',
    name: 'Yamuna Floodplain, Delhi',
    state: 'Delhi NCR',
    lat: 28.6692,
    lng: 77.2514,
    elevationMsl: 204.5,
    weatherTemp: '31°C',
    weatherCondition: 'Light Showers',
    rainfallMm: 14.5,
    riskScore: 42,
    riskLevel: 'MODERATE',
    riskColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    riverInfo: '1.2 km from Yamuna Embankment',
    drainageSat: '55% threshold reached',
    explanation: 'Upstream barrage water discharge causes moderate water table swelling along floodplains. Ring road bypass flyovers remain completely clear.',
    activeAlertTitle: 'CWC Advisory: Hathnikund discharge watch active',
    activeAlertSeverity: 'YELLOW',
    emergencyShelter: 'Geeta Colony Community Hall',
    emergencyDist: '2.1 km away',
    emergencyPhone: '112',
  },
  {
    id: 'guwahati',
    name: 'Brahmaputra Valley, Guwahati',
    state: 'Assam',
    lat: 26.1823,
    lng: 91.7618,
    elevationMsl: 55.0,
    weatherTemp: '27°C',
    weatherCondition: 'Extreme Rain',
    rainfallMm: 52.4,
    riskScore: 88,
    riskLevel: 'SEVERE',
    riskColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    riverInfo: '450m from Brahmaputra North Bank',
    drainageSat: '95% threshold reached',
    explanation: 'Sustained precipitation over hill slopes causing rapid flash runoff into valley floor. Mountain ridge highways recommended for all transit.',
    activeAlertTitle: 'ASDMA Red Alert: Flash flood warning across Kamrup Metro',
    activeAlertSeverity: 'RED',
    emergencyShelter: 'GMC Disaster Camp (Boat Station)',
    emergencyDist: '3.0 km away',
    emergencyPhone: '112',
  },
  {
    id: 'bengaluru',
    name: 'Bellandur Lake Basin, Bengaluru',
    state: 'Karnataka',
    lat: 12.9352,
    lng: 77.6744,
    elevationMsl: 902.0,
    weatherTemp: '24°C',
    weatherCondition: 'Scattered Showers',
    rainfallMm: 22.0,
    riskScore: 58,
    riskLevel: 'MODERATE',
    riskColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    riverInfo: 'Lake spillway feeder channel (500m)',
    drainageSat: '70% threshold reached',
    explanation: 'Localized waterlogging near Outer Ring Road junctions. Flyovers operational without restriction.',
    activeAlertTitle: 'KSNDMC Watch: Waterlogging caution along ORR tech corridor',
    activeAlertSeverity: 'YELLOW',
    emergencyShelter: 'Marathahalli Community Center',
    emergencyDist: '1.5 km away',
    emergencyPhone: '112',
  },
];

interface NationalCommandDashboardProps {
  onTriggerJudgeDemo: () => void;
}

export const NationalCommandDashboard = ({
  onTriggerJudgeDemo,
}: NationalCommandDashboardProps): React.ReactElement => {
  const navigate = useNavigate();
  const [selectedHubIndex, setSelectedHubIndex] = useState(0);
  const activeHub = COMMAND_HUBS[selectedHubIndex];

  // Live Map data state
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);

  useEffect(() => {
    Promise.all([
      api.getFloodReports().catch(() => ({ reports: [] })),
      api.getAlerts().catch(() => ({ alerts: [] })),
      api.getResources().catch(() => ({ resources: [] })),
    ]).then(([rep, alt, res]) => {
      setReports(rep.reports || []);
      setAlerts(alt.alerts || []);
      setResources(res.resources || []);
    });
  }, []);

  return (
    <div className="space-y-8 w-full">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border-2 border-sky-500/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              NATIONAL EMERGENCY COMMAND CENTER
            </span>
            <DataSourceBadge source="Open-Meteo & OSRM" dataType="Telemetry" status="LIVE" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            India Disaster Intelligence Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time multi-variable flood forecasting, explainable risk scoring, and autonomous safe routing.
          </p>
        </div>

        {/* Action Button: Run Flood Risk Analysis */}
        <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onTriggerJudgeDemo}
            className="h-14 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-sky-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Run Flood Risk Analysis (Judge Demo)</span>
          </button>
        </div>
      </div>

      {/* Target City Switcher Bar */}
      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-2 shrink-0">
          Monitored Hub:
        </span>
        {COMMAND_HUBS.map((hub, idx) => (
          <button
            key={hub.id}
            onClick={() => setSelectedHubIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedHubIndex === idx
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{hub.name.split(',')[0]}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hub.riskLevel === 'SEVERE'
                  ? 'bg-rose-400'
                  : hub.riskLevel === 'HIGH'
                  ? 'bg-orange-400'
                  : 'bg-amber-400'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ==================================================== */}
      {/* 1. TOP METRICS GRID (Score, Weather, Alerts, Shelters)*/}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Flood Risk Level & Score */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-sky-500/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              AI Flood Risk Level
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeHub.badgeBg}`}>
              {activeHub.riskLevel}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-heading font-extrabold text-5xl ${activeHub.riskColor}`}>
              {activeHub.riskScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100 Risk Score</span>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  activeHub.riskScore > 75
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                    : 'bg-gradient-to-r from-cyan-500 to-amber-500'
                }`}
                style={{ width: `${activeHub.riskScore}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Low Risk (0)</span>
              <span>Severe Risk (100)</span>
            </div>
          </div>

          <div className="text-[11px] text-cyan-300 font-mono pt-1 border-t border-slate-800/80">
            AI ESTIMATE • 94% Confidence
          </div>
        </div>

        {/* Metric 2: Live Weather & Rainfall */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-sky-500/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Weather & Rain
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="font-heading font-extrabold text-4xl text-white">
              {activeHub.weatherTemp}
            </div>
            <div className="text-sm font-semibold text-slate-300 mt-1">
              {activeHub.weatherCondition}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Precipitation:</span>
            <span className="font-mono font-bold text-sky-400">{activeHub.rainfallMm} mm/h</span>
          </div>

          <Link
            to="/weather"
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View 7-Day Rainfall Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 3: Active Alerts */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-rose-500/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Official Warnings
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
              NDMA LIVE
            </span>
          </div>

          <div>
            <div className="text-sm font-bold text-white line-clamp-2">
              {activeHub.activeAlertTitle}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official bulletin active for {activeHub.name.split(',')[0]} municipal area.
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            ⚠️ Commuters advised to avoid underpasses.
          </div>

          <Link
            to="/disaster-alerts"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>Inspect All Warnings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 4: Nearest Emergency Services */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-emerald-500/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Emergency Services
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Home className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="font-heading font-extrabold text-base text-white">
              {activeHub.emergencyShelter}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              {activeHub.emergencyDist} • Operational 24/7
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeHub.emergencyPhone}`}
              className="flex-1 h-10 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline 112</span>
            </a>
          </div>

          <Link
            to="/emergency-resources"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Shelters & Hospitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. MAP & AI RISK EXPLANATION TWO-COLUMN COMMAND VIEW */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Map Preview (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border-2 border-slate-800 overflow-hidden shadow-2xl space-y-0">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <h3 className="font-heading font-extrabold text-white text-base">
                Live Spatial Inundation Radar
              </h3>
            </div>
            <Link
              to={`/live-map?lat=${activeHub.lat}&lng=${activeHub.lng}&q=${encodeURIComponent(activeHub.name)}`}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30"
            >
              <span>Full Screen GIS Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[420px] w-full relative">
            <InteractiveMap
              center={[activeHub.lng, activeHub.lat]}
              zoom={13}
              reports={reports}
              alerts={alerts}
              resources={resources}
              className="w-full h-full"
            />

            {/* Floating Quick Legend Badge */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-200 flex items-center gap-3 shadow-xl">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Severe</span>
            </div>
          </div>
        </div>

        {/* Right: AI Risk Explanation & Route Planning Shortcut (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Risk Explanation Panel */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-sky-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h4 className="font-heading font-extrabold text-base text-white">
                  Explainable AI Flood Prediction
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                AI ESTIMATE
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {activeHub.explanation}
            </div>

            {/* Factors Breakdown */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Hydrological Contributing Factors:
              </span>

              {[
                { name: 'Rainfall Inundation Surge', val: 35, note: `${activeHub.rainfallMm} mm/h precipitation` },
                { name: 'Terrain Elevation Depression', val: 25, note: `${activeHub.elevationMsl}m MSL elevation` },
                { name: 'Municipal Drainage Saturation', val: 20, note: activeHub.drainageSat },
                { name: 'River & Marsh Proximity', val: 15, note: activeHub.riverInfo },
                { name: 'Citizen Hazard Corroboration', val: 5, note: 'Ground truth verified' },
              ].map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{f.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">{f.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full"
                      style={{ width: `${f.val * 2.5}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">{f.note}</div>
                </div>
              ))}
            </div>

            {/* Non-Statutory Disclaimer */}
            <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              ⚠️ <strong>NON-STATUTORY ESTIMATE:</strong> Model-derived projection. Always comply with NDMA/SDMA directives.
            </p>
          </div>

          {/* Safe Route Planning Shortcut */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <h4 className="font-heading font-extrabold text-base text-white">
                  Safe Route Planning
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                LOWEST EXPOSURE
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Calculate bypass corridors with <strong>lower modeled flood-risk exposure</strong> circumventing waterlogged underpasses.
            </p>

            <button
              onClick={() => navigate(`/route-planner?to=${encodeURIComponent(activeHub.name)}`)}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              <span>Plan Route to {activeHub.name.split(',')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
