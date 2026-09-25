import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { DisasterAlertItem } from '@floodroute/shared';

export const DisasterAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts()
      .then((res) => setAlerts(res.alerts || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const getSeverityBadge = (severity: string) => {
    const s = severity?.toUpperCase();
    if (s === 'CRITICAL' || s === 'DANGER' || s === 'HIGH') {
      return {
        dot: '🔴',
        label: 'Flood Alert',
        border: 'border-rose-500/50',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      };
    }
    if (s === 'WARNING' || s === 'MEDIUM') {
      return {
        dot: '🟡',
        label: 'Caution Warning',
        border: 'border-amber-500/50',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      };
    }
    return {
      dot: '🔵',
      label: 'Weather Notice',
      border: 'border-sky-500/50',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
          Active Flood Alerts
        </h1>
        <p className="text-base text-slate-300 max-w-lg mx-auto">
          Official weather bulletins and flood warnings for your safety.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading live alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="text-4xl">🟢</span>
          <h3 className="font-heading font-extrabold text-xl text-white">All Clear</h3>
          <p className="text-sm text-slate-400">There are no severe flood alerts active in your region right now.</p>
        </div>
      ) : (
        /* Cards Only layout */
        <div className="space-y-4">
          {alerts.map((alert) => {
            const sev = getSeverityBadge(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 ${sev.border} shadow-2xl space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:scale-[1.01]`}
              >
                <div className="space-y-2 flex-1">
                  {/* Badge & Dot */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sev.dot}</span>
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-white">
                      {sev.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sev.badgeBg}`}>
                      {alert.sourceLabel || 'Official'}
                    </span>
                  </div>

                  {/* City / Location Name */}
                  <div className="flex items-center gap-1.5 text-base font-bold text-sky-400">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.locationName || alert.district || 'India'}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                    {alert.title}: {alert.description}
                  </p>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated recently</span>
                  </div>
                </div>

                {/* View on Map Button (56px height) */}
                <button
                  onClick={() => navigate(`/live-map?lat=${alert.latitude}&lng=${alert.longitude}`)}
                  className="h-14 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
