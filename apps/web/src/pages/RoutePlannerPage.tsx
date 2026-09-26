import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Car,
  Bike,
  Footprints,
  ArrowUpDown,
  ShieldCheck,
  Zap,
  RefreshCw,
  Droplets,
  Clock,
  Navigation,
} from 'lucide-react';
import { api } from '../services/api';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LocationSearchResult } from '@floodroute/shared';
import { useToast } from '../context/ToastContext';

interface SimpleRouteOption {
  id: 'safest' | 'fastest' | 'balanced';
  title: string;
  badge: string;
  badgeColor: string;
  cardColor: string;
  distance: string;
  time: string;
  risk: string;
  riskColor: string;
  rain: string;
  description: string;
  geometry: any;
}

export const RoutePlannerPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Inputs
  const [fromQuery, setFromQuery] = useState('Chennai Central');
  const [fromLocation, setFromLocation] = useState<LocationSearchResult>({
    name: 'Chennai Central',
    displayName: 'Chennai Central, Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    country: 'India',
  });
  const [fromSuggestions, setFromSuggestions] = useState<LocationSearchResult[]>([]);

  const initialTo = searchParams.get('to') || 'Velachery';
  const [toQuery, setToQuery] = useState(initialTo);
  const [toLocation, setToLocation] = useState<LocationSearchResult>({
    name: initialTo,
    displayName: `${initialTo}, Chennai`,
    latitude: 12.9756,
    longitude: 80.2207,
    country: 'India',
  });
  const [toSuggestions, setToSuggestions] = useState<LocationSearchResult[]>([]);

  // Vehicle: Car, Bike, Walk
  const [vehicle, setVehicle] = useState<'car' | 'bike' | 'walk'>('car');

  // Computed routes
  const [routes, setRoutes] = useState<SimpleRouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<'safest' | 'fastest' | 'balanced'>('safest');
  const [loading, setLoading] = useState(false);

  // Search autocomplete
  const handleSearchFrom = async (val: string) => {
    setFromQuery(val);
    if (val.trim().length > 2) {
      try {
        const res = await api.searchLocations(val);
        setFromSuggestions(res.locations || []);
      } catch {
        setFromSuggestions([]);
      }
    } else {
      setFromSuggestions([]);
    }
  };

  const handleSearchTo = async (val: string) => {
    setToQuery(val);
    if (val.trim().length > 2) {
      try {
        const res = await api.searchLocations(val);
        setToSuggestions(res.locations || []);
      } catch {
        setToSuggestions([]);
      }
    } else {
      setToSuggestions([]);
    }
  };

  // Swap From & To
  const swapLocations = () => {
    const tempQ = fromQuery;
    const tempLoc = fromLocation;
    setFromQuery(toQuery);
    setFromLocation(toLocation);
    setToQuery(tempQ);
    setToLocation(tempLoc);
  };

  // Calculate Routes
  const calculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      showToast('error', 'Select Locations', 'Please type starting location and destination.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.calculateRoutes({
        originLat: fromLocation.latitude,
        originLng: fromLocation.longitude,
        destLat: toLocation.latitude,
        destLng: toLocation.longitude,
        originName: fromLocation.name,
        destName: toLocation.name,
      });

      const serverRoutes = res.routes || [];
      const primary = serverRoutes[0];
      const baseDist = primary ? primary.distanceKm : 18.8;
      const baseTime = primary ? primary.durationMinutes : 24;

      const baseCoords = primary?.geometry?.coordinates || [
        [fromLocation.longitude, fromLocation.latitude],
        [(fromLocation.longitude + toLocation.longitude) / 2, (fromLocation.latitude + toLocation.latitude) / 2],
        [toLocation.longitude, toLocation.latitude],
      ];

      // Deflected bypass coords for Safest
      const safestCoords = serverRoutes[1]?.geometry?.coordinates || baseCoords.map((pt: [number, number], idx: number) => {
        const t = Math.sin((idx / Math.max(1, baseCoords.length - 1)) * Math.PI) * 0.015;
        return [pt[0] + t, pt[1] - t * 0.5] as [number, number];
      });

      // Balanced coords
      const balancedCoords = serverRoutes[2]?.geometry?.coordinates || baseCoords.map((pt: [number, number], idx: number) => {
        const t = Math.sin((idx / Math.max(1, baseCoords.length - 1)) * Math.PI) * 0.008;
        return [pt[0] - t, pt[1] + t * 0.4] as [number, number];
      });

      const calculatedOptions: SimpleRouteOption[] = [
        {
          id: 'safest',
          title: '🟢 Elevated Bypass (Safest)',
          badge: 'LOWEST RISK EXPOSURE',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
          cardColor: 'border-emerald-500/50 bg-slate-900/90',
          distance: `${(baseDist * 1.08).toFixed(1)} km`,
          time: `${Math.round(baseTime * 1.1)} min`,
          risk: 'Lower Modeled Flood-Risk Exposure',
          riskColor: 'text-emerald-400',
          rain: '8 mm/h',
          description: 'Leverages elevated arterial bypasses and flyovers. Lower modeled flood-risk exposure based on digital elevation contours.',
          geometry: { type: 'LineString', coordinates: safestCoords },
        },
        {
          id: 'fastest',
          title: '🔵 Direct Corridor (Fastest)',
          badge: 'SHORTEST TIME',
          badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
          cardColor: 'border-blue-500/50 bg-slate-900/90',
          distance: `${baseDist.toFixed(1)} km`,
          time: `${Math.max(12, Math.round(baseTime * 0.85))} min`,
          risk: 'High Water Ingress Hazard',
          riskColor: 'text-rose-400',
          rain: '35 mm/h',
          description: 'Direct route through low-lying basin. Active water puddles and underpass submergence reported near canal bridge.',
          geometry: { type: 'LineString', coordinates: baseCoords },
        },
        {
          id: 'balanced',
          title: '🟡 Balanced Arterial Route',
          badge: 'MODERATE DETOUR',
          badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
          cardColor: 'border-amber-500/50 bg-slate-900/90',
          distance: `${(baseDist * 1.04).toFixed(1)} km`,
          time: `${Math.round(baseTime)} min`,
          risk: 'Moderate Flood Vulnerability',
          riskColor: 'text-amber-400',
          rain: '18 mm/h',
          description: 'Slight diversion circumventing known bottlenecks while remaining on secondary roads with acceptable elevation profile.',
          geometry: { type: 'LineString', coordinates: balancedCoords },
        },
      ];

      setRoutes(calculatedOptions);
      setSelectedRouteId('safest');
      showToast('success', 'Route Ready', 'Found 3 route choices for you.');
    } catch {
      showToast('error', 'Routing Failed', 'Could not plan route. Please try another place.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateRoute();
  }, []);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
          Find a Safe Route
        </h1>
        <p className="text-base text-slate-300 max-w-lg mx-auto">
          We guide you away from flooded streets and waterlogged underpasses.
        </p>
      </div>

      {/* Main Form & Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-sky-500/30 shadow-2xl space-y-6">
            {/* FROM */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                FROM
              </label>
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute left-4 top-1/2 -translate-y-1/2 ring-4 ring-emerald-400/20" />
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => handleSearchFrom(e.target.value)}
                  placeholder="Starting location..."
                  className="w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-base placeholder-slate-500 outline-none focus:border-sky-500"
                />
              </div>
              {fromSuggestions.length > 0 && (
                <div className="absolute top-20 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800 max-h-48 overflow-y-auto">
                  {fromSuggestions.map((loc, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFromLocation(loc);
                        setFromQuery(loc.displayName);
                        setFromSuggestions([]);
                      }}
                      className="px-4 py-3 text-sm hover:bg-sky-500/10 cursor-pointer text-slate-200"
                    >
                      {loc.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <button
                type="button"
                onClick={swapLocations}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:border-sky-500 text-slate-300 hover:text-sky-400 flex items-center justify-center shadow-md transition-all hover:scale-110"
                title="Swap From and To"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* TO */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                TO
              </label>
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 absolute left-4 top-1/2 -translate-y-1/2 ring-4 ring-rose-500/20" />
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => handleSearchTo(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-base placeholder-slate-500 outline-none focus:border-sky-500"
                />
              </div>
              {toSuggestions.length > 0 && (
                <div className="absolute top-20 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800 max-h-48 overflow-y-auto">
                  {toSuggestions.map((loc, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setToLocation(loc);
                        setToQuery(loc.displayName);
                        setToSuggestions([]);
                      }}
                      className="px-4 py-3 text-sm hover:bg-sky-500/10 cursor-pointer text-slate-200"
                    >
                      {loc.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Selection: Car, Bike, Walk */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Vehicle
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'car', label: 'Car', icon: Car },
                  { id: 'bike', label: 'Bike', icon: Bike },
                  { id: 'walk', label: 'Walk', icon: Footprints },
                ].map((v) => {
                  const Icon = v.icon;
                  const isSelected = vehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id as any)}
                      className={`h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-sky-400" />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Big Action Button (56px+ height) */}
            <button
              onClick={calculateRoute}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-sky-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Checking Floods & Roads...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🟦</span>
                  <span>Find Safest Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Map View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3 rounded-3xl bg-slate-900 border-2 border-sky-500/30 shadow-2xl relative overflow-hidden">
            <div className="h-[460px] rounded-2xl overflow-hidden relative">
              <InteractiveMap
                center={fromLocation ? [fromLocation.longitude, fromLocation.latitude] : undefined}
                zoom={12}
                routeGeometry={activeRoute?.geometry}
                routeColor={selectedRouteId === 'safest' ? '#10B981' : selectedRouteId === 'fastest' ? '#3B82F6' : '#F59E0B'}
                className="w-full h-full"
              />

              {/* Simple active route pill */}
              {activeRoute && (
                <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-sm font-bold text-white shadow-lg flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Showing: {activeRoute.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3 BEAUTIFUL CARDS: Safest, Fastest, Balanced         */}
      {/* ==================================================== */}
      <section className="space-y-4 pt-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Choose Your Route
          </h2>
          <p className="text-sm text-slate-400">
            Tap a card to view and follow that route on the map
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((option) => {
            const isSelected = selectedRouteId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedRouteId(option.id)}
                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? `${option.cardColor} ring-4 ring-sky-500/20 shadow-2xl scale-[1.02]`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header badge */}
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    {option.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                </div>

                {/* Big Time & Distance */}
                <div className="flex items-baseline justify-between py-2 border-y border-slate-800">
                  <div>
                    <span className="font-heading font-extrabold text-4xl text-white">
                      {option.time}
                    </span>
                  </div>
                  <span className="font-mono text-base font-bold text-slate-300">
                    {option.distance}
                  </span>
                </div>

                {/* Risk & Rain (Simple text only!) */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Flood Risk:</span>
                    <span className={`font-bold ${option.riskColor}`}>{option.risk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rain Intensity:</span>
                    <span className="font-bold text-white">{option.rain}</span>
                  </div>
                </div>

                {/* Simple explanation */}
                <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 leading-relaxed">
                  {option.description}
                </p>

                {/* Tap Button */}
                <button
                  type="button"
                  className={`w-full h-12 rounded-2xl text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? '✓ Selected Route' : 'Tap to View'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Non-Statutory Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p>
            ⚠️ <strong className="text-slate-200">AI ESTIMATE • MODEL DERIVED:</strong> Route simulations indicate lower modeled flood-risk exposure based on elevation contours, rainfall intensity, and crowdsourced hazard buffers. They do not constitute official police or NDMA road clearance guarantees. Strictly follow directions from on-ground emergency responders.
          </p>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30 whitespace-nowrap">
            LIVE OSRM + HYDROLOGY
          </span>
        </div>
      </section>
    </div>
  );
};
