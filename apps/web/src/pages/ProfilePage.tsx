import React, { useEffect, useState } from 'react';
import { User, MapPin, Plus, Trash2, Shield, Heart, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocLat, setNewLocLat] = useState('12.9805');
  const [newLocLng, setNewLocLng] = useState('80.2195');
  const [isAdding, setIsAdding] = useState(false);

  const loadSaved = async () => {
    try {
      const res = await api.getSavedLocations();
      setSavedLocations(res.locations || []);
    } catch {
      // Mock fallback
      setSavedLocations([
        { id: 'loc-1', name: 'Home', locationName: 'Velachery Bypass Road, Chennai', latitude: 12.978, longitude: 80.2207 },
        { id: 'loc-2', name: 'Office', locationName: 'Tidel Park, Tharamani, Chennai', latitude: 12.9892, longitude: 80.2483 },
      ]);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocAddress) return;

    try {
      await api.addSavedLocation({
        name: newLocName,
        locationName: newLocAddress,
        latitude: parseFloat(newLocLat),
        longitude: parseFloat(newLocLng),
      });
      setNewLocName('');
      setNewLocAddress('');
      setIsAdding(false);
      loadSaved();
    } catch (err) {
      alert('Failed to save location.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSavedLocation(id);
      setSavedLocations((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setSavedLocations((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Info Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-cyan-500/20">
          {user ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-white">{user?.name || 'Citizen User'}</h2>
          <div className="text-xs text-slate-400 font-mono">{user?.email || 'citizen@floodroute.ai'}</div>
          <div className="pt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Role: {user?.role || 'CITIZEN'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 hover:border-rose-800 rounded-xl text-xs font-semibold transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Saved Locations Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Saved Watchlist Locations</span>
            </h3>
            <p className="text-xs text-slate-400">
              Receive automatic notifications when flood alerts or hazard reports occur near these locations.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Location</span>
          </button>
        </div>

        {/* Add Location Form */}
        {isAdding && (
          <form onSubmit={handleAddLocation} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Label (e.g. Home, Office)</label>
                <input
                  type="text"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="Home"
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  placeholder="Velachery Bypass Road, Chennai"
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Latitude</label>
                <input
                  type="text"
                  value={newLocLat}
                  onChange={(e) => setNewLocLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Longitude</label>
                <input
                  type="text"
                  value={newLocLng}
                  onChange={(e) => setNewLocLng(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg font-bold"
              >
                Save Location
              </button>
            </div>
          </form>
        )}

        {/* Saved List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-bold text-xs text-white">{loc.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{loc.locationName}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1">
                  {loc.latitude}, {loc.longitude}
                </div>
              </div>
              <button
                onClick={() => handleDelete(loc.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
