import React, { useEffect, useState } from 'react';
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
  const { lastEvent } = useAdminSocket();
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [roads, setRoads] = useState<RoadConditionItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected item for moderation drawer
  const [selectedReport, setSelectedReport] = useState<FloodReportItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [modSeverity, setModSeverity] = useState('HIGH');
  const [actionInProgress, setActionInProgress] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reps, als, rds, res] = await Promise.all([
        adminApi.getReports({ limit: 150 }),
        adminApi.getAlerts(),
        adminApi.getRoads(),
        adminApi.getResources(),
      ]);
      setReports(reps.reports || []);
      setAlerts(als.alerts || []);
      setRoads(rds.roads || []);
      setResources(res.resources || []);
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

  // Handle Moderation Action
  const handleModerate = async (status: string) => {
    if (!selectedReport) return;
    setActionInProgress(true);
    try {
      await adminApi.updateReportStatus(selectedReport.id, {
        status,
        severity: modSeverity,
        notes: adminNotes,
      });
      setSelectedReport(null);
      setAdminNotes('');
      loadData();
    } catch (err) {
      alert('Action failed');
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden p-4 gap-3 relative">
      {/* Control Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl admin-card border border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs text-white">INCIDENT COMMAND LIVE RADAR</span>
          <span className="text-[10px] font-mono text-cyan-400">All India Operational Nodes</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync Live Grid</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Map Container */}
      <div className="flex-1 relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <InteractiveMap
          center={[INDIA_MAP_BOUNDS.centerLon, INDIA_MAP_BOUNDS.centerLat]}
          zoom={INDIA_MAP_BOUNDS.defaultZoom}
          reports={reports}
          alerts={alerts}
          roads={roads}
          resources={resources}
          className="w-full h-full"
        />

        {/* Quick Pending Reports Carousel in Bottom Right for Rapid Dispatch */}
        <div className="absolute top-4 left-4 z-20 w-80 bg-navy-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Pending Moderation Queue ({reports.filter((r) => r.status === 'PENDING').length})
            </span>
          </div>

          <div className="space-y-2">
            {reports
              .filter((r) => r.status === 'PENDING')
              .slice(0, 5)
              .map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedReport(r);
                    setModSeverity(r.severity);
                  }}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer text-xs space-y-1 transition-all"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-cyan-400 font-bold">{r.reportCode}</span>
                    <span className="text-rose-400 font-bold">{r.severity}</span>
                  </div>
                  <div className="font-bold text-white line-clamp-1">{r.locationName}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{r.description}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Selected Report Moderation Action Drawer */}
        {selectedReport && (
          <div className="absolute top-4 right-4 z-30 w-96 bg-navy-900/95 backdrop-blur-lg border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-cyan-400">
                DISPATCH MODERATION: {selectedReport.reportCode}
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm">{selectedReport.locationName}</div>
              <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {selectedReport.description}
              </p>

              {/* AI Insight Badge */}
              {selectedReport.aiAnalysis && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-cyan-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Vision Telemetry (Confidence: {selectedReport.aiAnalysis.confidence}%)
                  </div>
                  <div className="text-[11px] text-slate-300">{selectedReport.aiAnalysis.explanation}</div>
                </div>
              )}

              {/* Severity Change Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-slate-400 block font-semibold text-[11px]">Override Severity Level:</label>
                <select
                  value={modSeverity}
                  onChange={(e) => setModSeverity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              {/* Admin Note */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold text-[11px]">Incident Command Notes:</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Verified against CCTV / SDRF patrol..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('VERIFIED')}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('REJECTED')}
                  className="py-2 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleModerate('RESOLVED')}
                  className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
