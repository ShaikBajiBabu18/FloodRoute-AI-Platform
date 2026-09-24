import React, { useEffect, useState } from 'react';
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  Radio,
  ExternalLink,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { DisasterAlertItem } from '@floodroute/shared';
import { DataSourceBadge } from '../components/ui/DataSourceBadge';

export const DisasterAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'OFFICIAL' | 'PLATFORM'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts()
      .then((res) => setAlerts(res.alerts || []))
      .catch((err) => console.error('Alerts failed to load:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'OFFICIAL') return a.isOfficial;
    if (filterType === 'PLATFORM') return !a.isOfficial;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-400" />
            <span>Disaster Bulletins & Official Inundation Alerts</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authoritative early warnings issued by NDMA, IMD, and Central Water Commission.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bulletins ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('OFFICIAL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'OFFICIAL' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Official Government Only
          </button>
          <button
            onClick={() => setFilterType('PLATFORM')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'PLATFORM' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Platform Advisories
          </button>
        </div>
      </div>

      {/* Notice differentiating sources */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Data Provenance Guarantee:</span> Official alerts originate directly from National Disaster Management Authority (NDMA SACHET), Central Water Commission, or India Meteorological Department bulletins. Internal system advisories are unambiguously tagged as &ldquo;FloodRoute AI Platform Alert&rdquo;.
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider border ${
                      alert.isOfficial
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {alert.isOfficial ? 'OFFICIAL ALERT' : 'FLOODROUTE PLATFORM ALERT'}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{alert.title}</h3>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  {alert.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[10px]">AFFECTED SECTOR</span>
                    <span className="text-slate-200">{alert.locationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ISSUING AUTHORITY</span>
                    <span className="text-cyan-400">{alert.sourceLabel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ISSUED TIME</span>
                    <span className="text-slate-300">{new Date(alert.startTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPIRY WINDOW</span>
                    <span className="text-slate-300">{new Date(alert.expiryTime).toLocaleString()}</span>
                  </div>
                </div>

                <DataSourceBadge
                  source={alert.sourceLabel}
                  dataType={alert.isOfficial ? 'Official Statutory Broadcast' : 'Platform Field Advisory'}
                  updatedAt={alert.startTime}
                  status={alert.isDemo ? 'DEMO' : 'LIVE'}
                  isDemo={alert.isDemo}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No active official alerts found for this location.</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Monitored river discharge levels and rainfall indices currently reside below statutory emergency thresholds.
          </p>
        </div>
      )}
    </div>
  );
};
