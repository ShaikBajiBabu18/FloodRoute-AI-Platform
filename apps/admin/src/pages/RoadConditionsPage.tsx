import React, { useEffect, useState } from 'react';
import {
  Construction,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { RoadConditionItem, RoadConditionStatus, SeverityLevel } from '@floodroute/shared';

export const RoadConditionsPage: React.FC = () => {
  const [roads, setRoads] = useState<RoadConditionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [roadName, setRoadName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [condition, setCondition] = useState<RoadConditionStatus>('FLOODED');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [reason, setReason] = useState('');
  const [latitude, setLatitude] = useState('12.9815');
  const [longitude, setLongitude] = useState('80.2180');

  const fetchRoads = async () => {
    try {
      const res = await adminApi.getRoads();
      setRoads(res.roads || []);
    } catch (err) {
      console.error('Failed to load roads:', err);
    }
  };

  useEffect(() => {
    fetchRoads();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminApi.updateRoad(editingId, {
          condition,
          severity,
          reason,
        });
      } else {
        await adminApi.createRoad({
          roadName,
          locationName,
          condition,
          severity,
          reason,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchRoads();
    } catch (err) {
      alert('Failed to save road condition.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this road condition advisory?')) return;
    try {
      await adminApi.deleteRoad(id);
      fetchRoads();
    } catch {
      alert('Delete failed.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Construction className="w-5 h-5 text-orange-400" />
            <span>Road Condition & Closure Registry</span>
          </h1>
          <p className="text-xs text-slate-400">
            Define impassable corridors and hazardous road sectors. The routing engine directly factors these in.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setRoadName('');
            setLocationName('');
            setReason('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Road Advisory</span>
        </button>
      </div>

      {/* Grid of Road Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roads.map((road) => (
          <div
            key={road.id}
            className="admin-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{road.roadName}</h3>
                  <div className="text-[11px] text-slate-400">{road.locationName}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    road.condition === 'BLOCKED'
                      ? 'bg-slate-900 border border-slate-700 text-slate-200'
                      : road.condition === 'FLOODED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {road.condition}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                {road.reason}
              </p>

              <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                <div>Source: <span className="text-cyan-400">{road.source}</span></div>
                <div>Coordinates: {road.latitude}, {road.longitude}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setEditingId(road.id);
                  setRoadName(road.roadName);
                  setLocationName(road.locationName);
                  setCondition(road.condition);
                  setSeverity(road.severity);
                  setReason(road.reason);
                  setIsModalOpen(true);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Edit Condition"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(road.id)}
                className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-300"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSave}
            className="bg-navy-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">
                {editingId ? 'Edit Road Condition' : 'Create Road Closure Advisory'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!editingId && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-300 block">Road / Highway Name</label>
                  <input
                    type="text"
                    required
                    value={roadName}
                    onChange={(e) => setRoadName(e.target.value)}
                    placeholder="Velachery 100 Feet Main Road"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 block">Location / City Area</label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Velachery, Chennai"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 block">Road Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as RoadConditionStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                >
                  <option value="SAFE">SAFE</option>
                  <option value="CAUTION">CAUTION</option>
                  <option value="FLOODED">FLOODED</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block">Operational Reason / Detour Advice</label>
              <textarea
                required
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="2.5 feet standing water, traffic diverted..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            {!editingId && (
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
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
              >
                Save Advisory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
