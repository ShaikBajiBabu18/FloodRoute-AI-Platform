import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Hospital,
  Shield,
  Flame,
  LifeBuoy,
  Phone,
  MapPin,
  Crosshair,
  Navigation,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyResourceItem, ResourceCategory } from '@floodroute/shared';

export const EmergencyResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResources = async (coords?: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      const params: any = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
        params.radiusKm = 40;
      }
      const res = await api.getResources(params);
      setResources(res.resources || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(userCoords || undefined);
  }, [categoryFilter, userCoords]);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(c);
        fetchResources(c);
      },
      () => {
        setIsLocating(false);
        alert('Location permission was not granted. Search for a location manually.');
      }
    );
  };

  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'HOSPITAL':
        return <Hospital className="w-5 h-5 text-rose-400" />;
      case 'POLICE_STATION':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'FIRE_STATION':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'SHELTER':
      case 'RELIEF_CENTER':
        return <LifeBuoy className="w-5 h-5 text-emerald-400" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-rose-400" />
            <span>Emergency Relief & Critical Facilities Directory</span>
          </h1>
          <p className="text-xs text-slate-400">
            Hospitals, evacuation shelters, SDRF rescue outposts, and police emergency response hubs.
          </p>
        </div>

        {/* Locate Near Me */}
        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors shrink-0"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{userCoords ? 'Location Filter Active' : 'Filter by My Location'}</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'ALL', label: 'All Resources' },
          { id: 'HOSPITAL', label: 'Hospitals' },
          { id: 'SHELTER', label: 'Shelters & Relief' },
          { id: 'POLICE_STATION', label: 'Police Stations' },
          { id: 'FIRE_STATION', label: 'Fire & Rescue' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === tab.id
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      {item.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  </div>
                </div>

                {item.distanceKm != null && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.distanceKm} km
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{item.address}</span>
              </p>

              {item.notes && (
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {item.notes}
                </div>
              )}
            </div>

            {/* Actions: Call & Navigate */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              {item.phone ? (
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.phone}</span>
                </a>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">No phone listed</span>
              )}

              <button
                onClick={() => navigate(`/live-map?lat=${item.latitude}&lng=${item.longitude}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate Here</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
