import React, { useEffect, useState } from 'react';
import {
  BellRing,
  Plus,
  ShieldCheck,
  AlertTriangle,
  X,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { DisasterAlertItem, AlertSeverity } from '@floodroute/shared';

export const AlertsManagerPage: React.FC = () => {
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('WARNING');
  const [locationName, setLocationName] = useState('Central Silk Board Junction, Bengaluru');
  const [latitude, setLatitude] = useState('12.9177');
  const [longitude, setLongitude] = useState('77.6238');
  const [radiusKm, setRadiusKm] = useState('10');

  const fetchAlerts = async () => {
    try {
      const res = await adminApi.getAlerts();
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createPlatformAlert({
        title,
        description,
        severity,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radiusKm: parseFloat(radiusKm),
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchAlerts();
    } catch {
      alert('Failed to publish platform alert.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-purple-400" />
            <span>Disaster Warning & Alert Orchestration</span>
          </h1>
          <p className="text-xs text-slate-400">
            Monitor official NDMA/IMD bulletins and publish verified FloodRoute AI platform advisories.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Platform Alert</span>
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Compliance Notice: Platform-created advisories will be unambiguously stamped as <strong>FloodRoute AI Platform Alert</strong> on all public maps to ensure total source integrity.
        </span>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    alert.isOfficial
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {alert.isOfficial ? 'OFFICIAL SOURCE' : 'FLOODROUTE PLATFORM ALERT'}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white">{alert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {alert.description}
              </p>

              <div className="text-[11px] font-mono text-slate-400 space-y-0.5 pt-1">
                <div>Source: <span className="text-cyan-400">{alert.sourceLabel}</span></div>
                <div>Location: {alert.locationName}</div>
                <div>Issued: {new Date(alert.startTime).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreate}
            className="bg-navy-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Issue New FloodRoute AI Platform Alert</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block">Alert Headline Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Critical Underpass Inundation with Stalled Commercial Transit"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 block">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                >
                  <option value="INFO">INFO</option>
                  <option value="CAUTION">CAUTION</option>
                  <option value="WARNING">WARNING</option>
                  <option value="DANGER">DANGER</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Affected Radius (km)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block">Target Location Name</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 block">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 block">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block">Description & Evacuation Advisory</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the hazard and advise alternative routes..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
              >
                Broadcast Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
