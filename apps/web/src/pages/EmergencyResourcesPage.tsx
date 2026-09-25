import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyResourceItem } from '@floodroute/shared';
import { useToast } from '../context/ToastContext';

export const EmergencyResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HOSPITAL' | 'POLICE' | 'FIRE_STATION' | 'SHELTER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
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
        params.radiusKm = 50;
      }
      const res = await api.getResources(params);
      setResources(res.resources || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
      showToast('error', 'Error', 'Failed to retrieve emergency facilities.');
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
      showToast('error', 'Location Error', 'Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(c);
        showToast('success', 'Location Detected', 'Sorted emergency facilities by straight-line distance.');
      },
      () => {
        setIsLocating(false);
        showToast('warning', 'Location Failed', 'Could not access GPS coordinates.');
      }
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HOSPITAL':
        return <Hospital className="w-5 h-5 text-rose-400" />;
      case 'POLICE':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'FIRE_STATION':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'SHELTER':
        return <LifeBuoy className="w-5 h-5 text-emerald-400" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'HOSPITAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'POLICE':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'FIRE_STATION':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'SHELTER':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    }
  };

  const filteredResources = resources.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      item.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>DISASTER LIFELINE NETWORK</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Emergency Resources & Shelters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            24/7 verified hospital trauma centers, police stations, fire battalions, and district flood relief camps.
          </p>
        </div>

        {/* GPS Locate Button */}
        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{userCoords ? 'GPS Active (Sorting by Distance)' : 'Sort by My Location'}</span>
        </button>
      </div>

      {/* Top 4 Rapid Dial Helplines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'National Emergency', num: '112', type: 'Police • Fire • Ambulance', accent: 'border-rose-500/30 hover:border-rose-500/60' },
          { name: 'NDMA Central Hub', num: '1070', type: 'National Disaster Relief', accent: 'border-blue-500/30 hover:border-blue-500/60' },
          { name: 'District Flood Desk', num: '1077', type: 'Local Evacuation Cell', accent: 'border-cyan-500/30 hover:border-cyan-500/60' },
          { name: 'Medical / Trauma', num: '108', type: 'Boat Ambulance & Critical', accent: 'border-emerald-500/30 hover:border-emerald-500/60' },
        ].map((h, i) => (
          <a
            key={i}
            href={`tel:${h.num}`}
            className={`glass-panel p-4 rounded-[20px] border ${h.accent} transition-all block group hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">{h.name}</span>
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-heading font-extrabold text-2xl text-white mt-1 group-hover:text-rose-400 transition-colors">
              {h.num}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{h.type}</div>
          </a>
        ))}
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs: Hospitals, Police, Fire, Shelters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Lifelines', icon: HeartHandshake },
            { id: 'HOSPITAL', label: 'Hospitals', icon: Hospital },
            { id: 'POLICE', label: 'Police', icon: Shield },
            { id: 'FIRE_STATION', label: 'Fire & Rescue', icon: Flame },
            { id: 'SHELTER', label: 'Relief Shelters', icon: LifeBuoy },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Filter */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by facility name or district..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* FACILITY CARDS GRID (Hospitals, Police, Fire, Shelters) */}
      {/* ==================================================== */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-400">
          Scanning national lifeline database...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="glass-panel p-12 rounded-[24px] border border-slate-800 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No facilities match your search criteria.</p>
          <p className="text-xs text-slate-400">Try choosing another category or clearing search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <motion.div
              key={res.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-[22px] border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Icon, Badge, Distance */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    {getCategoryIcon(res.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getCategoryBadge(res.category)}`}>
                      {res.category.replace('_', ' ')}
                    </span>
                    {res.distanceKm !== undefined && (
                      <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {res.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Location */}
                <h3 className="font-heading font-bold text-base text-white leading-snug">
                  {res.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{res.address}, {res.city || 'Emergency Zone'}</span>
                </div>

                {/* Live Capacity / Info */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex justify-between items-center font-mono">
                  <span className="text-slate-400">Operational Readiness:</span>
                  <strong className="text-emerald-400">{res.notes || '24/7 Verified Ready'}</strong>
                </div>
              </div>

              {/* Action Buttons: Call Now & Navigate Safely */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href={`tel:${res.phone}`}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700/80 hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Call {res.phone}</span>
                </a>

                <Link
                  to={`/route-planner?destLat=${res.latitude}&destLng=${res.longitude}&destName=${encodeURIComponent(res.name)}`}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate Here</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
