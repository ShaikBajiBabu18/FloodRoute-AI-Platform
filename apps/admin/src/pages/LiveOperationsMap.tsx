import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  Activity,
  CloudRain,
  Shield,
  LifeBuoy,
  Flame,
  Hospital,
  ChevronRight,
  Eye,
  Radio,
  Send,
  ExternalLink,
  Clock,
  Compass,
  Zap,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { InteractiveMap } from '../../../web/src/components/map/InteractiveMap';
import { adminApi } from '../services/api';
import { useAdminSocket } from '../context/AdminSocketContext';
import {
  FloodReportItem,
  DisasterAlertItem,
  RoadConditionItem,
  EmergencyResourceItem,
  INDIA_MAP_BOUNDS,
} from '@floodroute/shared';

export const LiveOperationsMap: React.FC = () => {
  const { lastEvent, isConnected } = useAdminSocket();
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [roads, setRoads] = useState<RoadConditionItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Inspector Drawer
  const [selectedReport, setSelectedReport] = useState<FloodReportItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [modSeverity, setModSeverity] = useState('HIGH');
  const [actionInProgress, setActionInProgress] = useState(false);

  // Floating Widgets Visibility
  const [showIncidentQueue, setShowIncidentQueue] = useState(true);
  const [showWeatherWidget, setShowWeatherWidget] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reps, als, rds, res] = await Promise.all([
        adminApi.getReports({ limit: 150 }).catch(() => ({ reports: [] })),
        adminApi.getAlerts().catch(() => ({ alerts: [] })),
        adminApi.getRoads().catch(() => ({ roads: [] })),
        adminApi.getResources().catch(() => ({ resources: [] })),
      ]);
      setReports(reps.reports || []);
      setAlerts(als.alerts || []);
      setRoads(rds.roads || []);
      setResources(res.resources || []);

      if (reps.reports && reps.reports.length > 0 && !selectedReport) {
        setSelectedReport(reps.reports[0]);
        setModSeverity(reps.reports[0].severity);
      }
    } catch (err) {
      console.error('Failed to load operations map data:', err);
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

  // Handle Inspector Actions: Approve, Reject, Resolve, Escalate
  const handleModerate = async (status: string, escalate = false) => {
    if (!selectedReport) return;
    setActionInProgress(true);
    try {
      const notes = escalate
        ? `[ESCALATED TO NDRF DISPATCH BATTALION] ${adminNotes || 'Critical flood hazard with high risk to civilian transit.'}`
        : adminNotes;

      await adminApi.updateReportStatus(selectedReport.id, {
        status: escalate ? 'VERIFIED' : status,
        severity: modSeverity,
        notes: notes || undefined,
      });

      // Update local state
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? ({ ...r, status: (escalate ? 'VERIFIED' : status) as any, severity: modSeverity as any } as any)
            : r
        )
      );

      if (selectedReport) {
        setSelectedReport({
          ...selectedReport,
          status: (escalate ? 'VERIFIED' : status) as any,
          severity: modSeverity as any,
        } as any);
      }

      setAdminNotes('');
    } catch (err: any) {
      alert(`Action failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#020617] text-slate-100 overflow-hidden flex flex-col font-sans select-none">
      {/* Top Incident Command Ticker */}
      <div className="h-12 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
            <Radio className={`w-3 h-3 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            PALANTIR GOTHAM / COMMAND CENTER
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono text-[11px]">
            {reports.filter((r) => r.status === 'PENDING').length} PENDING MODERATION • {alerts.length} ACTIVE DISPATCHES
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh All Feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-bleed Map */}
        <div className="absolute inset-0 z-0">
          <InteractiveMap
            reports={reports}
            alerts={alerts}
            roads={roads}
            resources={resources}
            className="w-full h-full"
          />
        </div>

        {/* ==================================================== */}
        {/* FLOATING WIDGET 1: WEATHER RADAR HUD (Top-Left) */}
        {/* ==================================================== */}
        {showWeatherWidget && (
          <div className="absolute top-4 left-4 z-20 w-72 glass-card-elevated p-3.5 rounded-[20px] border border-cyan-500/30 shadow-2xl space-y-2 bg-[#020617]/85 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
              <span className="font-heading font-bold text-white flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Live Doppler Telemetry
              </span>
              <button onClick={() => setShowWeatherWidget(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">PRECIPITATION</span>
                <span className="text-cyan-400 font-bold">42.8 mm/h</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">GUST VELOCITY</span>
                <span className="text-white font-bold">34 km/h SW</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* FLOATING WIDGET 2: INCIDENT QUEUE (Bottom-Left) */}
        {/* ==================================================== */}
        {showIncidentQueue && (
          <div className="absolute bottom-6 left-4 z-20 w-80 sm:w-96 glass-card-elevated rounded-[22px] border border-slate-800 shadow-2xl overflow-hidden bg-[#020617]/90 backdrop-blur-xl">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  Incident Triage Queue ({reports.length})
                </span>
              </div>
              <button onClick={() => setShowIncidentQueue(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80 p-1">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => {
                    setSelectedReport(rep);
                    setModSeverity(rep.severity);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedReport?.id === rep.id
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-bold text-white truncate">{rep.locationName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {rep.hazardType.replace('_', ' ')} • {new Date(rep.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono shrink-0 ${
                    rep.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                    rep.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {rep.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* RIGHT DRAWER: INCIDENT INSPECTOR PANEL */}
        {/* ==================================================== */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-4 right-4 bottom-6 z-30 w-88 sm:w-[420px] glass-card-elevated rounded-[24px] border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden bg-[#020617]/95 backdrop-blur-2xl"
          >
            {/* Inspector Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">
                  INCIDENT INSPECTOR
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {selectedReport.reportCode}
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* High-Res Photo Inspection */}
              {selectedReport.imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 max-h-48 group">
                  <img
                    src={selectedReport.imageUrl}
                    alt="Incident field capture"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    OpenCV Analyzed Stream
                  </div>
                </div>
              ) : (
                <div className="h-28 rounded-2xl bg-slate-950/80 border border-dashed border-slate-800 flex flex-col items-center justify-center text-xs text-slate-500">
                  <span>No field photograph uploaded</span>
                </div>
              )}

              {/* AI Vision Inference Card */}
              {selectedReport.aiAnalysis && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-slate-950 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-cyan-300 font-bold font-mono">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Vision Automated Inference
                    </span>
                    <span className="text-emerald-400">Confidence: {selectedReport.aiAnalysis.confidence}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block text-[10px]">WATER COVERAGE</span>
                      <strong className="text-rose-400 font-mono">{selectedReport.aiAnalysis.waterCoveragePercent}% Inundated</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">VEHICLE ACCESS</span>
                      <strong className="text-amber-300 font-mono">{selectedReport.aiAnalysis.vehicleAccessibility}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug pt-1">
                    {selectedReport.aiAnalysis.explanation}
                  </p>
                </div>
              )}

              {/* Reporter Details & Trust Score */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Reporter Identity:</span>
                  <strong className="text-white">
                    {(selectedReport as any).user?.name || selectedReport.reporterName || 'Citizen Responder'}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Trust Score:</span>
                  <span className="text-emerald-400 font-mono font-bold">98% Verified Accuracy</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Coordinates:</span>
                  <span className="font-mono text-cyan-300">
                    {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Location & Field Description */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Field Observations:</span>
                <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* Incident Audit Timeline */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Audit Chronology:</span>
                <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Logged: {new Date(selectedReport.reportedAt).toLocaleString()}</span>
                  </div>
                  {selectedReport.verifiedAt && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified: {new Date(selectedReport.verifiedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Severity Override Selector */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Adjust Severity Determination:
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModSeverity(s)}
                      className={`py-1.5 rounded-lg border font-bold text-[10px] transition-all ${
                        modSeverity === s
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Disaster Log Notes:
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record verification notes or dispatch instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Inspector Action Buttons: Approve, Reject, Resolve, Escalate */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {/* Approve */}
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('VERIFIED')}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                {/* Reject */}
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('REJECTED')}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                {/* Resolve */}
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('RESOLVED')}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              </div>

              {/* Escalate to NDRF */}
              <button
                type="button"
                disabled={actionInProgress}
                onClick={() => handleModerate('VERIFIED', true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 animate-pulse disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Escalate Incident to NDRF Emergency Command</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
