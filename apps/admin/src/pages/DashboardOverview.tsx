import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  BellRing,
  Construction,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Waves,
  Eye,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { adminApi } from '../services/api';
import { useAdminSocket } from '../context/AdminSocketContext';

export const DashboardOverview: React.FC = () => {
  const { lastEvent } = useAdminSocket();

  const [kpis, setKpis] = useState<any>({
    totalUsers: 1480,
    totalReports: 142,
    pendingReports: 6,
    verifiedReports: 118,
    activeAlerts: 5,
    activeFloodZones: 12,
    activeRoadClosures: 8,
    aiAnalyses: 138,
  });

  const [loading, setLoading] = useState(false);

  // Time-series for Area Chart
  const incidentAreaSeries = [
    { time: '02:00', reports: 4, verified: 3, resolved: 1 },
    { time: '06:00', reports: 12, verified: 10, resolved: 4 },
    { time: '10:00', reports: 28, verified: 26, resolved: 12 },
    { time: '14:00', reports: 45, verified: 42, resolved: 24 },
    { time: '18:00', reports: 38, verified: 34, resolved: 30 },
    { time: '22:00', reports: 15, verified: 13, resolved: 18 },
  ];

  // Rainfall vs Inundation Line Chart
  const rainfallWaterLevelLine = [
    { hour: '00:00', rainfallMm: 8, avgWaterDepthFt: 0.4 },
    { hour: '04:00', rainfallMm: 18, avgWaterDepthFt: 0.9 },
    { hour: '08:00', rainfallMm: 45, avgWaterDepthFt: 2.1 },
    { hour: '12:00', rainfallMm: 62, avgWaterDepthFt: 2.8 },
    { hour: '16:00', rainfallMm: 38, avgWaterDepthFt: 2.3 },
    { hour: '20:00', rainfallMm: 14, avgWaterDepthFt: 1.5 },
  ];

  // District Distribution Bar Chart
  const districtBarData = [
    { district: 'Chennai', reports: 48, closedRoads: 4 },
    { district: 'Mumbai', reports: 36, closedRoads: 2 },
    { district: 'Guwahati', reports: 28, closedRoads: 1 },
    { district: 'Bengaluru', reports: 18, closedRoads: 1 },
    { district: 'Delhi NCR', reports: 12, closedRoads: 0 },
  ];

  // Donut Chart: Severity
  const donutData = [
    { name: 'Critical (Axle Depth)', value: 24, color: '#EF4444' },
    { name: 'High Hazard', value: 42, color: '#F97316' },
    { name: 'Moderate Depth', value: 52, color: '#F59E0B' },
    { name: 'Passable with Caution', value: 24, color: '#22C55E' },
  ];

  // Heatmap Matrix: Hours vs Days activity
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = ['00-06h', '06-12h', '12-18h', '18-24h'];

  const getHeatmapColor = (val: number) => {
    if (val > 8) return 'bg-rose-500/80 text-white';
    if (val > 5) return 'bg-amber-500/70 text-slate-950';
    if (val > 2) return 'bg-cyan-500/40 text-cyan-200';
    return 'bg-slate-900/60 text-slate-500';
  };

  const heatmapMatrix = [
    [1, 6, 9, 3],
    [2, 7, 11, 4],
    [3, 8, 14, 6],
    [5, 12, 18, 8],
    [4, 10, 15, 7],
    [2, 5, 8, 4],
    [1, 4, 6, 2],
  ];

  // Timeline Activity
  const timelineEvents = [
    { id: 1, text: 'NDMA Red Warning issued for Adyar River Catchment Zone', time: '12 mins ago', type: 'alert', icon: BellRing, color: 'text-rose-400' },
    { id: 2, text: 'Report FR-2026-000186 (T. Nagar) verified via live CCTV feed', time: '28 mins ago', type: 'verified', icon: CheckCircle2, color: 'text-emerald-400' },
    { id: 3, text: 'OpenCV Microservice segmented 78.4% water coverage on Kurla image', time: '42 mins ago', type: 'ai', icon: Sparkles, color: 'text-cyan-400' },
    { id: 4, text: 'Velachery 100 Feet Main Road marked Impassable for sedans', time: '1 hr ago', type: 'road', icon: Construction, color: 'text-amber-400' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>DISASTER OPERATIONS OVERVIEW</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Incident Command Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time situation awareness across monitored river basins, road inundation reports, and automated vision inferences.
          </p>
        </div>

        <button
          onClick={() => setLoading(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TOP 6 REQUIRED KPIS: Users, Reports, Alerts, Flood Zones, Road Closures, AI Analyses */}
      {/* ==================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Users', val: kpis.totalUsers, icon: Users, color: 'text-cyan-400', badge: '+12% wk' },
          { label: 'Flood Reports', val: kpis.totalReports, icon: FileCheck2, color: 'text-emerald-400', badge: `${kpis.pendingReports} Pending` },
          { label: 'Official Alerts', val: kpis.activeAlerts, icon: BellRing, color: 'text-rose-400', badge: 'NDMA Red' },
          { label: 'Flood Zones', val: kpis.activeFloodZones, icon: Waves, color: 'text-blue-400', badge: 'Monitored' },
          { label: 'Road Closures', val: kpis.activeRoadClosures, icon: Construction, color: 'text-amber-400', badge: 'Impassable' },
          { label: 'AI Analyses', val: kpis.aiAnalyses, icon: Sparkles, color: 'text-indigo-400', badge: 'OpenCV 93%' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-4 rounded-[20px] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 truncate">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="font-heading font-extrabold text-2xl text-white">
                {kpi.val}
              </div>
              <div className="text-[10px] font-mono text-cyan-400">
                {kpi.badge}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* CHARTS ROW 1: AREA CHART & LINE CHART */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Area Chart: Incident Flow */}
        <div className="lg:col-span-7 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                24-Hour Incident Triage Volume
              </h3>
              <p className="text-xs text-slate-400">Citizen submissions vs verified clearances.</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              AREA TELEMETRY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incidentAreaSeries}>
                <defs>
                  <linearGradient id="areaRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaVer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="reports" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#areaRep)" name="Total Reports" />
                <Area type="monotone" dataKey="verified" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#areaVer)" name="Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Rainfall vs Water Depth */}
        <div className="lg:col-span-5 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Precipitation vs Inundation Depth
              </h3>
              <p className="text-xs text-slate-400">Rain rate mm/h vs standing road water.</p>
            </div>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              CORRELATION LINE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallWaterLevelLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="rainfallMm" stroke="#0EA5E9" strokeWidth={2.5} name="Rainfall (mm)" />
                <Line type="monotone" dataKey="avgWaterDepthFt" stroke="#EF4444" strokeWidth={2.5} name="Water Depth (ft)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* CHARTS ROW 2: BAR CHART & DONUT CHART */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart: Districts */}
        <div className="lg:col-span-6 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">
            Hazard Reports by Indian Metropolitan District
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="district" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend />
                <Bar dataKey="reports" fill="#0EA5E9" name="Report Count" radius={[6, 6, 0, 0]} />
                <Bar dataKey="closedRoads" fill="#EF4444" name="Closed Stretches" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Severity */}
        <div className="lg:col-span-6 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">
            Severity Classification Breakdown
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {donutData.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* ROW 3: HEATMAP MATRIX & RECENT AUDIT TIMELINE */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Heatmap Matrix: Day of week vs Hour block */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              7-Day Peak Incident Heatmap Matrix
            </h3>
            <span className="text-xs font-mono text-cyan-400">HOUR-BY-HOUR</span>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 text-[10px] font-mono text-slate-400 text-center">
              <div>Day</div>
              {heatmapHours.map((h) => <div key={h}>{h}</div>)}
            </div>
            {heatmapDays.map((day, dIdx) => (
              <div key={day} className="grid grid-cols-5 gap-1.5 items-center text-xs font-mono">
                <span className="text-slate-400 text-[11px] font-bold">{day}</span>
                {heatmapMatrix[dIdx].map((val, hIdx) => (
                  <div
                    key={hIdx}
                    className={`h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${getHeatmapColor(val)} transition-transform hover:scale-105`}
                    title={`${day} ${heatmapHours[hIdx]}: ${val} incidents`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline: Live Operational Audit Feed */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              Command Audit Chronology
            </h3>
            <span className="text-xs font-mono text-slate-500">Live Trace</span>
          </div>

          <div className="space-y-3">
            {timelineEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs"
                >
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-700/80 ${evt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium leading-snug">{evt.text}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{evt.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
