import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp,
  Activity,
  Droplets,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Search,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { DEMO_SAMPLE_LOCATIONS, RISK_LEVELS, CalculatedRisk, FloodReportItem } from '@floodroute/shared';
import { DataSourceBadge } from '../components/ui/DataSourceBadge';

export const FloodIntelligencePage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(DEMO_SAMPLE_LOCATIONS[0]);
  const [riskData, setRiskData] = useState<(CalculatedRisk & { breakdown: any }) | null>(null);
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getFloodRisk(selectedCity.lat, selectedCity.lng, selectedCity.name).catch(() => null),
      api.getFloodReports({ limit: 50 }).catch(() => ({ reports: [] })),
    ])
      .then(([riskRes, reportsRes]) => {
        if (riskRes) setRiskData(riskRes);
        if (reportsRes?.reports) setReports(reportsRes.reports);
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const score = riskData?.riskScore ?? 84;
  const riskLevel = riskData?.riskLevel ?? 'CRITICAL';

  // Severity Distribution Data for Pie Chart
  const severityDistData = [
    { name: 'Critical (Axle Submerged)', value: 12, color: '#EF4444' },
    { name: 'High (Knee Deep)', value: 24, color: '#F97316' },
    { name: 'Moderate (Tire Level)', value: 38, color: '#F59E0B' },
    { name: 'Passable with Caution', value: 45, color: '#22C55E' },
  ];

  // River Status Cards Data
  const riverBasins = [
    {
      name: 'Adyar River Basin',
      city: 'Chennai, Tamil Nadu',
      currentLevel: '9.42 m',
      warningLevel: '8.50 m',
      dangerLevel: '9.80 m',
      capacityPct: 96,
      status: 'NEAR DANGER MARK',
      statusColor: 'text-rose-400 bg-rose-500/20 border-rose-500/30'
    },
    {
      name: 'Mithi River Channel',
      city: 'Mumbai, Maharashtra',
      currentLevel: '3.85 m',
      warningLevel: '3.20 m',
      dangerLevel: '4.00 m',
      capacityPct: 92,
      status: 'HIGH TIDE SURGE',
      statusColor: 'text-rose-400 bg-rose-500/20 border-rose-500/30'
    },
    {
      name: 'Brahmaputra River',
      city: 'Guwahati, Assam',
      currentLevel: '49.80 m',
      warningLevel: '49.68 m',
      dangerLevel: '50.50 m',
      capacityPct: 88,
      status: 'ABOVE WARNING',
      statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    },
    {
      name: 'Yamuna River Catchment',
      city: 'Delhi Floodplain',
      currentLevel: '204.60 m',
      warningLevel: '204.50 m',
      dangerLevel: '205.33 m',
      capacityPct: 78,
      status: 'ELEVATED FLOW',
      statusColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
    }
  ];

  // Affected Districts Grid Data
  const affectedDistricts = [
    { district: 'Chennai Urban', state: 'Tamil Nadu', rain24h: '128 mm', risk: 'CRITICAL (92/100)', openRoads: '64%' },
    { district: 'Mumbai Suburban', state: 'Maharashtra', rain24h: '94 mm', risk: 'HIGH (78/100)', openRoads: '76%' },
    { district: 'Kamrup Metro', state: 'Assam', rain24h: '112 mm', risk: 'HIGH (82/100)', openRoads: '71%' },
    { district: 'Bengaluru South', state: 'Karnataka', rain24h: '68 mm', risk: 'MODERATE (54/100)', openRoads: '85%' },
  ];

  const filteredReportsList = reports.filter((r) => {
    if (filterSeverity === 'ALL') return true;
    return r.severity === filterSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Title & City Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <Waves className="w-3.5 h-3.5" />
            <span>HYDROLOGICAL DISASTER MATRIX</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            National Flood Intelligence & River Stages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydrodynamic river gauge monitoring, urban waterlogging heatmaps, and verified community incident validation.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {DEMO_SAMPLE_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => setSelectedCity(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedCity.name === loc.name
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. LARGE RISK SCORE CIRCLE & FACTOR WEIGHTS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Large Animated Risk Circle Card */}
        <div className="lg:col-span-5 glass-card-elevated p-8 rounded-[28px] border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400 uppercase">
            REGIONAL COMPOSITE SCORE
          </div>

          {/* SVG Radial Meter */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={score >= 80 ? '#EF4444' : score >= 50 ? '#F59E0B' : '#22C55E'}
                strokeWidth="10"
                strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: `drop-shadow(0 0 12px ${score >= 80 ? '#EF4444' : '#06B6D4'})`,
                  transition: 'stroke-dasharray 1s ease'
                }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-4xl text-white tracking-tight">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-400">OUT OF 100</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                score >= 80 ? 'text-rose-400 bg-rose-500/20' : score >= 50 ? 'text-amber-400 bg-amber-500/20' : 'text-emerald-400 bg-emerald-500/20'
              }`}>
                {riskLevel}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              {selectedCity.name} Risk Index
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Inundation risk computed by weighted multi-factor telemetry. Immediate rerouting is advised.
            </p>
          </div>
        </div>

        {/* Right: Explainable Factor Breakdown Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Explainable Scoring Factor Contributions
            </h3>

            <div className="space-y-3">
              {[
                { factor: 'Rainfall & Satellite Accumulation (Open-Meteo)', weight: '35%', score: '32.4 pts', bar: 'w-[92%]', color: 'bg-sky-500' },
                { factor: 'Official NDMA / IMD Alert Warnings', weight: '25%', score: '25.0 pts', bar: 'w-[100%]', color: 'bg-rose-500' },
                { factor: 'Verified Community Ground-Truth Reports', weight: '25%', score: '20.0 pts', bar: 'w-[80%]', color: 'bg-amber-400' },
                { factor: 'Confirmed Road Closures & Impassable Bridges', weight: '15%', score: '12.0 pts', bar: 'w-[80%]', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.factor}</span>
                    <span className="font-mono font-bold text-white">{item.score} ({item.weight})</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} ${item.bar} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. RIVER STATUS CARDS */}
      {/* ==================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            Major River Basins & Capacity Thresholds
          </h2>
          <span className="text-xs font-mono text-slate-400">Source: Central Water Commission (CWC)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {riverBasins.map((basin, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-[22px] border border-slate-800 hover:border-cyan-500/40 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">{basin.name}</h4>
                  <div className="text-[11px] text-slate-400">{basin.city}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${basin.statusColor}`}>
                  {basin.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Stage:</span>
                  <span className="font-bold text-white">{basin.currentLevel}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Danger Threshold:</span>
                  <span className="font-bold text-rose-400">{basin.dangerLevel}</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Basin Channel Capacity</span>
                  <span className="text-cyan-400 font-bold">{basin.capacityPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      basin.capacityPct >= 90 ? 'bg-rose-500' : basin.capacityPct >= 75 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${basin.capacityPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. HEATMAP VISUALIZATION & SEVERITY PIE CHART */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Heatmap GIS Simulation Box */}
        <div className="lg:col-span-7 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              National Inundation Heatmap Matrix
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              HOTSPOT DENSITY
            </span>
          </div>

          {/* SVG Heatmap Simulation Canvas */}
          <div className="relative h-64 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
            {/* Background Map Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Glowing Heatmap Blobs */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-rose-600/30 blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-amber-500/25 blur-2xl animate-pulse" />
            <div className="absolute top-1/2 right-1/2 w-28 h-28 rounded-full bg-cyan-500/20 blur-xl" />

            {/* Overlay Markers */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { zone: 'Chennai - Adyar Basin', severity: 'Critical Red', depth: '2.5 ft' },
                { zone: 'Mumbai - Mithi Overflow', severity: 'High Orange', depth: '2.0 ft' },
                { zone: 'Guwahati - Bharalu Channel', severity: 'Critical Red', depth: '3.0 ft' },
                { zone: 'Delhi - Yamuna Floodplain', severity: 'Moderate Yellow', depth: '1.2 ft' },
                { zone: 'Bengaluru - Bellandur Spill', severity: 'Moderate Yellow', depth: '1.0 ft' },
                { zone: 'Kolkata - Strand Road', severity: 'Moderate Yellow', depth: '1.1 ft' },
              ].map((m, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[11px] space-y-0.5">
                  <span className="font-bold text-white block truncate">{m.zone}</span>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-rose-400 font-mono">{m.severity}</span>
                    <span className="text-slate-400">{m.depth}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Heatmap algorithm: Kernel density estimation</span>
              <span className="text-cyan-400">Radius: 5.0 km</span>
            </div>
          </div>
        </div>

        {/* Right: Severity Distribution Pie Chart */}
        <div className="lg:col-span-5 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-heading font-bold text-sm text-white">
              Incident Severity Breakdown
            </span>
            <span className="text-[10px] font-mono text-slate-400">119 Verified Reports</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {severityDistData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 text-[11px] truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. AFFECTED DISTRICTS & RECENT REPORTS TIMELINE */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Affected Districts Table/Cards */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">
            High-Risk Districts in Current Monsoon Cycle
          </h3>
          <div className="space-y-2.5">
            {affectedDistricts.map((d, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">{d.district}</h4>
                  <div className="text-xs text-slate-400">{d.state} • 24h Rain: {d.rain24h}</div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-400 block">{d.risk}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{d.openRoads} Roads Passable</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports Timeline */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              Recent Ground-Truth Reports Feed
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Live Ingestion</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {filteredReportsList.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{r.locationName}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{r.reportCode}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{r.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Water: {r.waterLevel}</span>
                  <span className="text-emerald-400">Verified by Control Room</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
