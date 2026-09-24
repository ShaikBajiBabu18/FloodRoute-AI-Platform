import React, { useEffect, useState } from 'react';
import {
  Waves,
  ShieldCheck,
  Users,
  CloudRain,
  Sparkles,
  AlertTriangle,
  Info,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { DEMO_SAMPLE_LOCATIONS, RISK_LEVELS, CalculatedRisk } from '@floodroute/shared';
import { DataSourceBadge } from '../components/ui/DataSourceBadge';

export const FloodIntelligencePage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(DEMO_SAMPLE_LOCATIONS[0]);
  const [riskData, setRiskData] = useState<(CalculatedRisk & { breakdown: any }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getFloodRisk(selectedCity.lat, selectedCity.lng, selectedCity.name)
      .then((data) => setRiskData(data))
      .catch((err) => console.error('Flood risk fetch failed:', err))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const riskBadge = riskData
    ? (RISK_LEVELS[riskData.riskLevel as keyof typeof RISK_LEVELS] || RISK_LEVELS.LOW)
    : RISK_LEVELS.LOW;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Waves className="w-6 h-6 text-cyan-400" />
            <span>Flood Intelligence & Inundation Matrix</span>
          </h1>
          <p className="text-xs text-slate-400">
            Multi-vector risk engine combining river discharge bulletins, verified crowdsourcing, and meteorological models.
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_SAMPLE_LOCATIONS.slice(0, 6).map((loc) => (
            <button
              key={loc.name}
              onClick={() => setSelectedCity(loc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedCity.name === loc.name
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {riskData && (
        <div className="space-y-6">
          {/* Main Risk Overview Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Sector Risk Evaluation: {selectedCity.name}, {selectedCity.state}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-3xl font-black text-white">{riskBadge.label}</h2>
                  <div className="px-3 py-1 rounded-lg font-mono font-black text-base bg-slate-950 border border-slate-800 text-cyan-400">
                    Score: {riskData.riskScore} / 100
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-slate-400">
                <div>Evaluated: {new Date(riskData.timestamp).toLocaleTimeString()}</div>
                <div className="text-cyan-400 mt-0.5">Status: LIVE TELEMETRY</div>
              </div>
            </div>

            {/* Why this risk exists (Reasons) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Underlying Correlative Risk Determinants:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {riskData.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5 font-bold">›</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              {riskData.disclaimer}
            </p>
          </div>

          {/* 4 Dedicated Telemetry Streams Required by Prompt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stream 1: OFFICIAL DATA */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  OFFICIAL DATA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  CWC / NDMA
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-white">
                  {riskData.breakdown?.officialData?.alertsCount || 0}
                </div>
                <div className="text-xs text-slate-400">Active Statutory Bulletins</div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                River gauge telemetry & dam discharge monitored via Central Water Commission standards.
              </p>
            </div>

            {/* Stream 2: COMMUNITY DATA */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  COMMUNITY DATA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-white">
                  {riskData.breakdown?.communityData?.verifiedReportsCount || 0}
                </div>
                <div className="text-xs text-slate-400">Verified Citizen Reports</div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                Submissions moderated and cross-checked by incident command before elevating road status.
              </p>
            </div>

            {/* Stream 3: WEATHER-DERIVED RISK */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  WEATHER RISK
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  IMD / SATELLITE
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-white">
                  {riskData.breakdown?.weatherDerivedRisk?.currentRainfallMm || 0} mm/h
                </div>
                <div className="text-xs text-slate-400">Active Rainfall Rate</div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                Max 24h forecast: {riskData.breakdown?.weatherDerivedRisk?.maxForecastRainfallMm || 0} mm precipitation.
              </p>
            </div>

            {/* Stream 4: AI ESTIMATE */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AI ESTIMATE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  VISION MODEL
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-white">
                  {riskData.breakdown?.aiEstimates?.floodedDetectedCount || 0}
                </div>
                <div className="text-xs text-slate-400">Inundations Detected via Vision</div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                Computer vision multi-band segmenter inspecting water line and axle clearance.
              </p>
            </div>
          </div>

          {/* Factor Breakdown Table */}
          {riskData.factors && riskData.factors.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
                Detailed Explainable Weight Matrix
              </h3>
              <div className="space-y-2">
                {riskData.factors.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-xs text-white">{f.factor}</div>
                      <div className="text-[11px] text-slate-400">{f.description}</div>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">Source: {f.source}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-rose-400">+{f.scoreImpact} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
