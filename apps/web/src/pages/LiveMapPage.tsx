import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  FloodReportItem,
  DisasterAlertItem,
  RoadConditionItem,
  EmergencyResourceItem,
  INDIA_MAP_BOUNDS,
} from '@floodroute/shared';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { lastEvent } = useSocket();

  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [roads, setRoads] = useState<RoadConditionItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse URL query coords if present (e.g. from hub links)
  const qLat = parseFloat(searchParams.get('lat') || '');
  const qLng = parseFloat(searchParams.get('lng') || '');
  const hasQueryCoords = !isNaN(qLat) && !isNaN(qLng);

  const center: [number, number] = hasQueryCoords
    ? [qLng, qLat]
    : [INDIA_MAP_BOUNDS.centerLon, INDIA_MAP_BOUNDS.centerLat];
  const zoom = hasQueryCoords ? 13 : INDIA_MAP_BOUNDS.defaultZoom;

  const loadMapData = async () => {
    setLoading(true);
    try {
      const [repsRes, alertsRes, roadsRes, resRes] = await Promise.all([
        api.getFloodReports({ limit: 150 }).catch(() => ({ reports: [] })),
        api.getAlerts({ activeOnly: true }).catch(() => ({ alerts: [] })),
        api.getRoadConditions().catch(() => ({ roads: [] })),
        api.getResources().catch(() => ({ resources: [] })),
      ]);

      setReports(repsRes.reports || []);
      setAlerts(alertsRes.alerts || []);
      setRoads(roadsRes.roads || []);
      setResources(resRes.resources || []);
    } catch (err) {
      console.error('Failed to load map layers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  // Reactive reload when socket events trigger
  useEffect(() => {
    if (lastEvent) {
      console.log('[LiveMap] Reactive update triggered by:', lastEvent.type);
      loadMapData();
    }
  }, [lastEvent]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-full overflow-hidden p-2 sm:p-4 gap-3">
      {/* Top Banner with Summary Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl glass-panel border border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>National Operations Live Map</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE RADAR
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              India Subcontinent Inundation & Incident Tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-3 text-slate-300">
            <span>Reports: <strong className="text-cyan-400">{reports.length}</strong></span>
            <span>Alerts: <strong className="text-purple-400">{alerts.length}</strong></span>
            <span>Blockages: <strong className="text-rose-400">{roads.length}</strong></span>
            <span>Resources: <strong className="text-blue-400">{resources.length}</strong></span>
          </div>

          <button
            onClick={loadMapData}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh All Map Layers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <InteractiveMap
          center={center}
          zoom={zoom}
          reports={reports}
          alerts={alerts}
          roads={roads}
          resources={resources}
          className="w-full h-full min-h-[500px]"
        />
      </div>
    </div>
  );
};
