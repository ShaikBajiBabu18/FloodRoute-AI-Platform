import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  MapPin,
  CloudRain,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  FileText,
  Activity,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'national' | 'state' | 'district' | 'timeline' | 'severity' | 'weather' | 'growth'
  >('national');

  const [dateRange, setDateRange] = useState('7d');

  // National Overview Trends
  const nationalTrends = [
    { date: 'Sep 18', reports: 14, verified: 12, closedRoads: 4, rainfall: 22 },
    { date: 'Sep 19', reports: 22, verified: 18, closedRoads: 7, rainfall: 45 },
    { date: 'Sep 20', reports: 38, verified: 34, closedRoads: 14, rainfall: 78 },
    { date: 'Sep 21', reports: 52, verified: 48, closedRoads: 21, rainfall: 112 },
    { date: 'Sep 22', reports: 68, verified: 62, closedRoads: 28, rainfall: 135 },
    { date: 'Sep 23', reports: 45, verified: 41, closedRoads: 19, rainfall: 62 },
    { date: 'Sep 24', reports: 32, verified: 29, closedRoads: 12, rainfall: 34 },
  ];

  // State Comparison Data
  const stateComparisonData = [
    { state: 'Tamil Nadu', reports: 142, alerts: 18, shelters: 85, evacuees: 4200 },
    { state: 'Maharashtra', reports: 118, alerts: 14, shelters: 62, evacuees: 3100 },
    { state: 'Assam', reports: 96, alerts: 22, shelters: 94, evacuees: 7800 },
    { state: 'Karnataka', reports: 54, alerts: 8, shelters: 38, evacuees: 1200 },
    { state: 'Delhi NCR', reports: 42, alerts: 6, shelters: 24, evacuees: 850 },
    { state: 'West Bengal', reports: 68, alerts: 12, shelters: 52, evacuees: 2400 },
  ];

  // Weather vs Flood Correlation Data
  const correlationData = [
    { hour: '00:00', rainIntensity: 8, floodRiskIndex: 22, waterloggedSites: 2 },
    { hour: '04:00', rainIntensity: 24, floodRiskIndex: 45, waterloggedSites: 5 },
    { hour: '08:00', rainIntensity: 68, floodRiskIndex: 78, waterloggedSites: 16 },
    { hour: '12:00', rainIntensity: 95, floodRiskIndex: 92, waterloggedSites: 28 },
    { hour: '16:00', rainIntensity: 54, floodRiskIndex: 82, waterloggedSites: 22 },
    { hour: '20:00', rainIntensity: 28, floodRiskIndex: 64, waterloggedSites: 14 },
    { hour: '23:59', rainIntensity: 14, floodRiskIndex: 48, waterloggedSites: 8 },
  ];

  // User Growth Data
  const userGrowthData = [
    { month: 'Apr', citizens: 4200, sentinels: 280, reports: 320 },
    { month: 'May', citizens: 12400, sentinels: 850, reports: 940 },
    { month: 'Jun', citizens: 38000, sentinels: 2400, reports: 3100 },
    { month: 'Jul', citizens: 84000, sentinels: 6200, reports: 8900 },
    { month: 'Aug', citizens: 142000, sentinels: 11400, reports: 16400 },
    { month: 'Sep', citizens: 218000, sentinels: 18200, reports: 24800 },
  ];

  // Severity Breakdown
  const severityBreakdown = [
    { name: 'Critical Inundation', value: 34, color: '#EF4444' },
    { name: 'High Danger', value: 48, color: '#F97316' },
    { name: 'Moderate Obstruction', value: 72, color: '#F59E0B' },
    { name: 'Low / Passable', value: 95, color: '#22C55E' },
  ];

  const getFormattedTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const timestamp = getFormattedTimestamp();
    const headers = ['Date', 'Total Reports', 'Verified Reports', 'Closed Roads', 'Rainfall (mm)'];
    const rows = nationalTrends.map((t) => [t.date, t.reports, t.verified, t.closedRoads, t.rainfall]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [`# FloodRoute AI Disaster Analytics Export - Timestamp: ${new Date().toISOString()}`,
       headers.join(','), 
       ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FloodRoute_AI_Analytics_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel (.xls) Handler
  const handleExportExcel = () => {
    const timestamp = getFormattedTimestamp();
    const headers = ['Date', 'Total Reports', 'Verified Reports', 'Closed Roads', 'Rainfall (mm)'];
    const rows = nationalTrends.map((t) => [t.date, t.reports, t.verified, t.closedRoads, t.rainfall]);
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body>
        <h3>FloodRoute AI National Disaster Analytics Report</h3>
        <p><strong>Generated At:</strong> ${new Date().toISOString()}</p>
        <table border="1">
          <thead>
            <tr style="background-color: #0284c7; color: white;">
              ${headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FloodRoute_AI_Analytics_${timestamp}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export JSON Summary Handler
  const handleExportJSON = () => {
    const timestamp = getFormattedTimestamp();
    const payload = {
      platform: 'FloodRoute AI Executive Command Center',
      exportType: 'Disaster Risk & Operations Summary',
      generatedAt: new Date().toISOString(),
      timestampUnix: Date.now(),
      nationalTrends,
      stateComparisonData,
      correlationData,
      userGrowthData,
      severityBreakdown,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FloodRoute_AI_Analytics_Summary_${timestamp}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF (Window Print layout)
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>EXECUTIVE DISASTER INTELLIGENCE</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            National Analytics & Correlation Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate meteorological correlations, district hazard timelines, state response comparisons, and citizen sentinel growth metrics.
          </p>
        </div>

        {/* 4 Timestamped Export Buttons: CSV, Excel, JSON, PDF */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            title="Export CSV data with timestamp"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            title="Export Microsoft Excel spreadsheet (.xls) with timestamp"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Excel (.xls)</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            title="Export JSON Telemetry Summary with timestamp"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            title="Export Printable PDF Report"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-800/80">
        {[
          { id: 'national', label: 'National Overview' },
          { id: 'state', label: 'State Comparison' },
          { id: 'district', label: 'District Trends' },
          { id: 'timeline', label: 'Reports Timeline' },
          { id: 'severity', label: 'Severity Analysis' },
          { id: 'weather', label: 'Weather vs Flood Correlation' },
          { id: 'growth', label: 'User & Sentinel Growth' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================================== */}
      {/* 1. NATIONAL OVERVIEW TAB */}
      {/* ==================================================== */}
      {activeTab === 'national' && (
        <div className="space-y-6">
          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Inundation Reports', val: '249', trend: '+14% past 24h', up: true, color: 'text-cyan-400' },
              { label: 'Ground-Truth Verified', val: '94.2%', trend: 'Validated by AI + Police', up: true, color: 'text-emerald-400' },
              { label: 'Active Road Closures', val: '28', trend: '-4 reopened', up: false, color: 'text-rose-400' },
              { label: 'Disaster Shelters Operational', val: '355', trend: '14,200 beds ready', up: true, color: 'text-blue-400' },
            ].map((k, i) => (
              <div key={i} className="glass-panel p-5 rounded-[22px] border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block">{k.label}</span>
                <div className={`font-heading font-extrabold text-3xl ${k.color}`}>{k.val}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono pt-1">
                  {k.up ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{k.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* National Incident & Rainfall Curve */}
          <div className="glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  National Inundation Volume vs Rainfall Accumulation (Past 7 Days)
                </h3>
                <p className="text-xs text-slate-400">Comparing citizen telemetry submissions with Doppler radar rainfall.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                AGGREGATE TIME-SERIES
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={nationalTrends}>
                  <defs>
                    <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="reports" stroke="#0EA5E9" strokeWidth={2.5} fillOpacity={1} fill="url(#reportsGrad)" name="Citizen Reports" />
                  <Area type="monotone" dataKey="rainfall" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#rainGrad)" name="Rainfall (mm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. STATE COMPARISON TAB */}
      {/* ==================================================== */}
      {activeTab === 'state' && (
        <div className="space-y-6">
          <div className="glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">
              State-wise Hazard Volume & Evacuee Mobilization
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="state" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend />
                  <Bar dataKey="reports" fill="#0EA5E9" name="Flood Reports" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="alerts" fill="#EF4444" name="Red/Orange Alerts" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="shelters" fill="#22C55E" name="Active Shelters" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. WEATHER VS FLOOD CORRELATION TAB */}
      {/* ==================================================== */}
      {activeTab === 'weather' && (
        <div className="space-y-6">
          <div className="glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Diurnal Rain Intensity (mm/h) vs Real-Time Ground Flood Risk Index
                </h3>
                <p className="text-xs text-slate-400">Lag correlation between cloudburst events and downstream road inundation.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400">R = 0.94 CORRELATION</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="rainIntensity" stroke="#38BDF8" strokeWidth={3} name="Rain Intensity (mm/h)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="floodRiskIndex" stroke="#EF4444" strokeWidth={3} name="Flood Risk Score (0-100)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="waterloggedSites" stroke="#F59E0B" strokeWidth={2} name="Waterlogged Roads" strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. SEVERITY BREAKDOWN TAB */}
      {/* ==================================================== */}
      {activeTab === 'severity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Hazard Classification Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={6} dataKey="value">
                    {severityBreakdown.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-3">
            <h3 className="font-heading font-bold text-base text-white">Severity Metrics & Actions</h3>
            {severityBreakdown.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="font-bold text-white">{s.name}</span>
                </div>
                <div className="font-mono text-slate-300">{s.value} Active Locations</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. USER & SENTINEL GROWTH TAB */}
      {/* ==================================================== */}
      {activeTab === 'growth' && (
        <div className="glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              Citizen Sentinel Network Expansion (Monsoon 2026)
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">+520% Network Growth</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="citizens" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" name="Registered Citizens" />
                <Area type="monotone" dataKey="sentinels" stroke="#06B6D4" strokeWidth={2} fillOpacity={0.5} fill="#06B6D4" name="Verified Sentinels" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fallback for district / timeline */}
      {(activeTab === 'district' || activeTab === 'timeline') && (
        <div className="glass-panel p-8 rounded-[24px] border border-slate-800 text-center space-y-2">
          <h3 className="font-heading font-bold text-base text-white">Granular District Telemetry Synchronized</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Reviewing live spatial vectors across 742 Indian administrative districts. All data ingested under [OFFICIAL DATA] and [COMMUNITY DATA].
          </p>
        </div>
      )}
    </div>
  );
};
