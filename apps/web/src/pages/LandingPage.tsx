import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Compass,
  PlusCircle,
  Activity,
  CheckCircle2,
  AlertCircle,
  Radio,
  ArrowRight,
  CloudRain,
  Waves,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { DEMO_SAMPLE_LOCATIONS } from '@floodroute/shared';

interface SystemHealth {
  status: string;
  timestamp: string;
  services: {
    database: { status: string; engine: string };
    weatherService: { status: string; provider: string };
    floodData: { status: string; provider: string };
    routing: { status: string; provider: string };
    alertSystem: { status: string; provider: string };
    communityReports: { status: string; totalSubmissions: number };
    aiService: { status: string; engine: string };
  };
}

export const LandingPage: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealth(data))
      .catch((err) => console.warn('Health check failed:', err))
      .finally(() => setLoadingHealth(false));
  }, []);

  const getStatusBadge = (status?: string) => {
    if (loadingHealth) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
          Checking...
        </span>
      );
    }
    if (status === 'CONNECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Connected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertCircle className="w-3 h-3 text-amber-400" />
        {status || 'Data Temporarily Unavailable'}
      </span>
    );
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>India-Wide Real-Time Disaster Intelligence Network</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Navigate Safer. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            Respond Faster.
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
          FloodRoute AI combines live maps, weather intelligence, flood-risk information, community reports and emergency alerts to help people make safer travel decisions during flood events.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
          <Link
            to="/live-map"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MapPin className="w-4 h-4" />
            Open Live Map
          </Link>

          <Link
            to="/route-planner"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            Plan Safe Route
          </Link>

          <Link
            to="/report-hazard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            Report Hazard
          </Link>
        </div>
      </section>

      {/* Live System Status Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
              Live System Status
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Real verification • Zero fake telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Weather Service */}
          <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">Weather Service</span>
              {getStatusBadge(health?.services.weatherService.status)}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {health?.services.weatherService.provider || 'IMD / Satellite Stream'}
            </p>
          </div>

          {/* Card 2: Flood Data */}
          <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">Flood Data</span>
              {getStatusBadge(health?.services.floodData.status)}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {health?.services.floodData.provider || 'Central Water Commission'}
            </p>
          </div>

          {/* Card 3: Routing */}
          <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">Routing</span>
              {getStatusBadge(health?.services.routing.status)}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {health?.services.routing.provider || 'OSRM Highway Corridor'}
            </p>
          </div>

          {/* Card 4: Alert System */}
          <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">Alert System</span>
              {getStatusBadge(health?.services.alertSystem.status)}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {health?.services.alertSystem.provider || 'NDMA / SACHET Broadcasts'}
            </p>
          </div>

          {/* Card 5: Community Reports */}
          <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">Community Reports</span>
              {getStatusBadge(health?.services.communityReports.status)}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {health?.services.communityReports.totalSubmissions != null
                ? `${health.services.communityReports.totalSubmissions} Field Reports Verified`
                : 'Crowdsourced Field Grid'}
            </p>
          </div>
        </div>
      </section>

      {/* Sample Monitored Hubs Across India */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl glass-panel-elevated space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Sample Monitored Disaster & Inundation Hubs</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DEMO DATA AVAILABLE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore pre-seeded test incident records, weather radars, and safe evacuation corridors.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">10 Hubs Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {DEMO_SAMPLE_LOCATIONS.map((loc) => (
              <Link
                key={loc.name}
                to={`/live-map?lat=${loc.lat}&lng=${loc.lng}&location=${encodeURIComponent(loc.name)}`}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
              >
                <div className="font-semibold text-xs text-white group-hover:text-cyan-400 transition-colors">
                  {loc.name}
                </div>
                <div className="text-[11px] text-slate-400">{loc.state}</div>
                <div className="mt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <span>Inspect Sector</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Dynamic Flood-Aware Routing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike standard navigation apps, FloodRoute AI checks every kilometer against active inundation alerts, verified standing water, and road closures, computing an explainable risk score.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">AI-Assisted Vision Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Citizens upload photos of flooded corridors. Our OpenCV image processing pipeline automatically measures water coverage, vehicle accessibility, and severity to aid disaster analysts.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Zero Fake Telemetry Transparency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every card displays the issuing authority (IMD, CWC, NDMA), timestamp, and data type. If an external service is unavailable, we explicitly show the standby state rather than inventing numbers.
          </p>
        </div>
      </section>
    </div>
  );
};
