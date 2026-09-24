import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LocationSearchResult, RouteOption, RISK_LEVELS } from '@floodroute/shared';

export const RoutePlannerPage: React.FC = () => {
  // Search Inputs
  const [originQuery, setOriginQuery] = useState('Velachery, Chennai');
  const [originLocation, setOriginLocation] = useState<LocationSearchResult | null>({
    name: 'Velachery',
    displayName: 'Velachery, Chennai, Tamil Nadu',
    latitude: 12.9805,
    longitude: 80.2195,
    country: 'India',
  });
  const [originSuggestions, setOriginSuggestions] = useState<LocationSearchResult[]>([]);

  const [destQuery, setDestQuery] = useState('Tidel Park, Chennai');
  const [destLocation, setDestLocation] = useState<LocationSearchResult | null>({
    name: 'Tidel Park',
    displayName: 'Tidel Park, Tharamani, Chennai, Tamil Nadu',
    latitude: 12.9892,
    longitude: 80.2483,
    country: 'India',
  });
  const [destSuggestions, setDestSuggestions] = useState<LocationSearchResult[]>([]);

  // Routing Options
  const [avoidFlooded, setAvoidFlooded] = useState(true);
  const [avoidHighRisk, setAvoidHighRisk] = useState(true);
  const [preferSafer, setPreferSafer] = useState(true);

  // Results State
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete searches
  const handleOriginSearch = async (val: string) => {
    setOriginQuery(val);
    if (val.trim().length > 2) {
      try {
        const res = await api.searchLocations(val);
        setOriginSuggestions(res.locations);
      } catch {
        setOriginSuggestions([]);
      }
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestSearch = async (val: string) => {
    setDestQuery(val);
    if (val.trim().length > 2) {
      try {
        const res = await api.searchLocations(val);
        setDestSuggestions(res.locations);
      } catch {
        setDestSuggestions([]);
      }
    } else {
      setDestSuggestions([]);
    }
  };

  const selectOrigin = (loc: LocationSearchResult) => {
    setOriginLocation(loc);
    setOriginQuery(loc.displayName);
    setOriginSuggestions([]);
  };

  const selectDest = (loc: LocationSearchResult) => {
    setDestLocation(loc);
    setDestQuery(loc.displayName);
    setDestSuggestions([]);
  };

  const calculateSafeRoute = async () => {
    if (!originLocation || !destLocation) {
      setError('Please select both Origin and Destination locations.');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const res = await api.calculateRoutes({
        originLat: originLocation.latitude,
        originLng: originLocation.longitude,
        destLat: destLocation.latitude,
        destLng: destLocation.longitude,
        originName: originLocation.name,
        destName: destLocation.name,
        avoidFlooded,
        avoidHighRisk,
        preferSafer,
        preferFastest: !preferSafer,
      });

      setRoutes(res.routes);
      // Select the recommended route by default
      const recIdx = res.routes.findIndex((r) => r.isRecommended);
      setSelectedRouteIndex(recIdx >= 0 ? recIdx : 0);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Route could not be calculated. Try another location.');
    } finally {
      setIsCalculating(false);
    }
  };

  const selectedRoute = routes[selectedRouteIndex] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>Flood-Aware Route Planner</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real transit corridor analysis evaluating rainfall, active river stages, official alerts, and verified road inundation.
          </p>
        </div>

        {/* Quick Location Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Test Presets:</span>
          <button
            type="button"
            onClick={() => {
              setOriginLocation({ name: 'Velachery', displayName: 'Velachery, Chennai', latitude: 12.9805, longitude: 80.2195, country: 'India' });
              setOriginQuery('Velachery, Chennai');
              setDestLocation({ name: 'Tidel Park', displayName: 'Tidel Park, Tharamani, Chennai', latitude: 12.9892, longitude: 80.2483, country: 'India' });
              setDestQuery('Tidel Park, Chennai');
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors"
          >
            Chennai Inundation Corridor
          </button>
          <button
            type="button"
            onClick={() => {
              setOriginLocation({ name: 'Kurla West', displayName: 'Kurla West, Mumbai', latitude: 19.0688, longitude: 72.8790, country: 'India' });
              setOriginQuery('Kurla West, Mumbai');
              setDestLocation({ name: 'Nariman Point', displayName: 'Nariman Point, Mumbai', latitude: 18.9256, longitude: 72.8242, country: 'India' });
              setDestQuery('Nariman Point, Mumbai');
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors"
          >
            Mumbai Monsoon Transit
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Origin & Destination Inputs Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
            {/* Origin Input */}
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Origin Point
              </label>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => handleOriginSearch(e.target.value)}
                placeholder="Search starting city, road, or landmark..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {originSuggestions.length > 0 && (
                <div className="absolute top-16 left-0 right-0 z-30 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {originSuggestions.map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectOrigin(loc)}
                      className="w-full text-left p-2.5 hover:bg-slate-800 text-xs border-b border-slate-800/60 last:border-b-0"
                    >
                      <div className="font-semibold text-slate-200">{loc.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{loc.displayName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-rose-400" />
                Destination Point
              </label>
              <input
                type="text"
                value={destQuery}
                onChange={(e) => handleDestSearch(e.target.value)}
                placeholder="Search destination..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {destSuggestions.length > 0 && (
                <div className="absolute top-16 left-0 right-0 z-30 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {destSuggestions.map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectDest(loc)}
                      className="w-full text-left p-2.5 hover:bg-slate-800 text-xs border-b border-slate-800/60 last:border-b-0"
                    >
                      <div className="font-semibold text-slate-200">{loc.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{loc.displayName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Routing Preferences Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                Corridor Safety Constraints
              </span>

              <div className="space-y-1.5">
                <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50">
                  <span className="text-slate-300">Avoid Flooded Roads</span>
                  <input
                    type="checkbox"
                    checked={avoidFlooded}
                    onChange={(e) => setAvoidFlooded(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50">
                  <span className="text-slate-300">Avoid High-Risk Weather Sectors</span>
                  <input
                    type="checkbox"
                    checked={avoidHighRisk}
                    onChange={(e) => setAvoidHighRisk(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50">
                  <span className="text-cyan-300 font-medium">Prefer Safest Route (Over Fastest)</span>
                  <input
                    type="checkbox"
                    checked={preferSafer}
                    onChange={(e) => setPreferSafer(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={calculateSafeRoute}
              disabled={isCalculating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Compass className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>{isCalculating ? 'Evaluating Hazard Matrices...' : 'Calculate Safe Routes'}</span>
            </button>
          </div>

          {/* Route Options Comparison List */}
          {routes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Calculated Alternatives ({routes.length})
                </span>
                <span className="text-[11px] font-mono text-cyan-400">Click to preview route</span>
              </div>

              {routes.map((r, idx) => {
                const isSelected = selectedRouteIndex === idx;
                const riskConfig = RISK_LEVELS[r.overallRisk as keyof typeof RISK_LEVELS] || RISK_LEVELS.LOW;

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRouteIndex(idx)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{r.title}</span>
                        {r.isRecommended && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Sparkles className="w-2.5 h-2.5" />
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskConfig.bg} ${riskConfig.border} ${riskConfig.text}`}>
                        {riskConfig.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-2 bg-slate-950/40 rounded-lg px-2.5">
                      <div>
                        <span className="text-slate-500 block text-[10px]">DISTANCE</span>
                        <span className="text-white font-semibold">{r.distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">DURATION</span>
                        <span className="text-white font-semibold">
                          {Math.floor(r.durationMinutes / 60)}h {r.durationMinutes % 60}m
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">HAZARDS</span>
                        <span className={r.hazardsCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          {r.hazardsCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ALERTS</span>
                        <span className={r.officialAlertsCount > 0 ? 'text-purple-400 font-bold' : 'text-slate-400'}>
                          {r.officialAlertsCount}
                        </span>
                      </div>
                    </div>

                    {/* Explainable Risk Reasons Summary */}
                    {isSelected && r.riskReasons && r.riskReasons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                          Why this route has this risk:
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-400">
                          {r.riskReasons.map((reason, ri) => (
                            <li key={ri} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Column */}
        <div className="lg:col-span-7 h-[550px] lg:h-[700px] sticky top-20">
          <InteractiveMap
            center={originLocation ? [originLocation.longitude, originLocation.latitude] : undefined}
            zoom={12}
            routeGeometry={selectedRoute ? selectedRoute.geometry : null}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
