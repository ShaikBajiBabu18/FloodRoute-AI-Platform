import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { adminApi } from '../services/api';
import { useAdminSocket } from '../context/AdminSocketContext';

export const DashboardOverview: React.FC = () => {
  const { lastEvent } = useAdminSocket();
  const [kpis, setKpis] = useState<any>({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    rejectedReports: 0,
    resolvedReports: 0,
    activeAlerts: 0,
    activeRoadClosures: 0,
    highRiskLocations: 0,
  });

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiRes, anaRes] = await Promise.all([
        adminApi.getKpis(),
        adminApi.getAnalytics(),
      ]);
      setKpis(kpiRes.kpis);
      setAnalytics(anaRes);
    } catch (err) {
      console.error('Failed to load admin KPI dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (lastEvent) {
      loadData();
    }
  }, [lastEvent]);

  const PIE_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#38BDF8'];

  return (
    <div className="p-6 space-y-6">
      {/* Title & Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Incident Command Operational Overview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              LIVE SQL TELEMETRY
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time aggregate disaster metrics derived from PostgreSQL database records.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 8 Required KPI Cards from DB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Users */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Total Users</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{kpis.totalUsers}</div>
        </div>

        {/* Total Reports */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Total Reports</span>
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{kpis.totalReports}</div>
        </div>

        {/* Pending Reports */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Pending Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{kpis.pendingReports}</div>
        </div>

        {/* Verified Reports */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{kpis.verifiedReports}</div>
        </div>

        {/* Rejected Reports */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Rejected</span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{kpis.rejectedReports}</div>
        </div>

        {/* Active Flood Alerts */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Active Alerts</span>
            <BellRing className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400">{kpis.activeAlerts}</div>
        </div>

        {/* Active Road Closures */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Road Closures</span>
            <Construction className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-black text-orange-400">{kpis.activeRoadClosures}</div>
        </div>

        {/* High Risk Locations */}
        <div className="admin-card p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">High Risk Hubs</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-500">{kpis.highRiskLocations}</div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Severity Distribution */}
          <div className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
              Flood Inundation Severity Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.severityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Reports by State */}
          <div className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
              Reports by State Jurisdiction
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.stateDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="state" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Moderation Status (Verified vs Pending vs Rejected) */}
          <div className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
              Verification Workflow Status Breakdown
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    fontSize={10}
                  >
                    {analytics.statusDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#334155', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Road Condition Distribution */}
          <div className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
              Roadway Condition Status
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.roadConditionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
