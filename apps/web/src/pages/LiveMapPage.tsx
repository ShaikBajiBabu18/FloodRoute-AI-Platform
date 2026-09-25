import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Plus,
  Minus,
  Compass,
  Crosshair,
  CloudRain,
  ShieldCheck,
  PhoneCall,
  Home,
  X,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Navigation,
} from 'lucide-react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { api } from '../services/api';
import {
  FloodReportItem,
  DisasterAlertItem,
  EmergencyResourceItem,
  LocationSearchResult,
} from '@floodroute/shared';
import { useToast } from '../context/ToastContext';

export const LiveMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Search State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Map Center & Zoom
  const [mapCenter, setMapCenter] = useState<[number, number]>([80.2707, 13.0827]); // Default Chennai
  const [mapZoom, setMapZoom] = useState<number>(12);

  // Active Bottom Sheet Data
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    weather: string;
    temp: string;
    risk: 'Low' | 'Moderate' | 'High';
    riskColor: string;
    emergency: string;
    emergencyPhone: string;
  }>({
    name: 'Chennai Central, Tamil Nadu',
    weather: 'Moderate Rain',
    temp: '29°C',
    risk: 'Low',
    riskColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
    emergency: 'Government General Hospital (1.1 km)',
    emergencyPhone: '112',
  });

  // Active Entity Popover / Card
  const [activeMarker, setActiveMarker] = useState<any | null>(null);

  // Data layers
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);

  useEffect(() => {
    Promise.all([
      api.getFloodReports().catch(() => ({ reports: [] })),
      api.getAlerts().catch(() => ({ alerts: [] })),
      api.getResources().catch(() => ({ resources: [] })),
    ]).then(([repRes, altRes, rscRes]) => {
      setReports(repRes.reports || []);
      setAlerts(altRes.alerts || []);
      setResources(rscRes.resources || []);
    });
  }, []);

  // Search autocomplete
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 2) {
      setIsSearching(true);
      try {
        const res = await api.searchLocations(val);
        setSuggestions(res.locations || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectLocation = (loc: LocationSearchResult) => {
    setMapCenter([loc.longitude, loc.latitude]);
    setMapZoom(13);
    setSearchQuery(loc.displayName);
    setSuggestions([]);
    setSelectedPlace({
      name: loc.displayName,
      weather: 'Cloudy with Light Rain',
      temp: '28°C',
      risk: 'Low',
      riskColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      emergency: 'Local Emergency Center (Nearby)',
      emergencyPhone: '112',
    });
    setBottomSheetOpen(true);
    showToast('info', 'Location Selected', loc.name);
  };

  // 📍 My Location Action
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('error', 'Location Error', 'GPS is not supported by your browser.');
      return;
    }
    showToast('info', 'Finding Location', 'Locating your current GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter([lng, lat]);
        setMapZoom(14);
        setSelectedPlace({
          name: `My GPS Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
          weather: 'Live Forecast',
          temp: '29°C',
          risk: 'Low',
          riskColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
          emergency: 'Call 112 for direct dispatch',
          emergencyPhone: '112',
        });
        showToast('success', 'Location Found', 'Map centered on your position.');
      },
      () => {
        showToast('error', 'GPS Timeout', 'Could not detect current location.');
      }
    );
  };

  // Zoom controls
  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 4));
  const handleCompassReset = () => {
    setMapCenter([80.2707, 13.0827]);
    setMapZoom(12);
    showToast('info', 'Compass Reset', 'Reset view to default orientation.');
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-[#020617] overflow-hidden">
      {/* ==================================================== */}
      {/* 1. FULL SCREEN MAP                                   */}
      {/* ==================================================== */}
      <InteractiveMap
        center={mapCenter}
        zoom={mapZoom}
        reports={reports}
        alerts={alerts}
        resources={resources}
        onEntitySelect={(entity) => {
          if (entity) {
            setActiveMarker(entity);
          }
        }}
        onLocationSelect={(loc) => {
          setSelectedPlace({
            name: loc.name,
            weather: 'Showers Reported',
            temp: '29°C',
            risk: 'Low',
            riskColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
            emergency: 'Nearest Hospital 2 km',
            emergencyPhone: '112',
          });
          setBottomSheetOpen(true);
        }}
        className="w-full h-full"
      />

      {/* ==================================================== */}
      {/* 2. SEARCH AT TOP                                     */}
      {/* ==================================================== */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:w-96 z-30">
        <div className="relative">
          <div className="flex items-center h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-sky-500/40 shadow-2xl px-4 gap-3">
            <Search className="w-5 h-5 text-sky-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search city, town, or road..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-16 left-0 right-0 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl z-40 max-h-56 overflow-y-auto divide-y divide-slate-800">
              {suggestions.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => selectLocation(loc)}
                  className="px-4 py-3 text-sm hover:bg-sky-500/10 cursor-pointer text-slate-200 flex items-center gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">{loc.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. ONLY 4 FLOATING BUTTONS (On Right)                */}
      {/* 📍 My Location, ➕ Zoom In, ➖ Zoom Out, 🧭 Compass */}
      {/* ==================================================== */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex flex-col gap-2.5">
        {/* 📍 My Location */}
        <button
          onClick={handleMyLocation}
          className="w-14 h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 hover:border-sky-500 text-sky-400 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
          title="Find My Location"
        >
          <Crosshair className="w-6 h-6" />
        </button>

        {/* ➕ Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-14 h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 hover:border-sky-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl font-bold"
          title="Zoom In"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* ➖ Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-14 h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 hover:border-sky-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl font-bold"
          title="Zoom Out"
        >
          <Minus className="w-6 h-6" />
        </button>

        {/* 🧭 Compass Reset */}
        <button
          onClick={handleCompassReset}
          className="w-14 h-14 rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 hover:border-sky-500 text-sky-400 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
          title="Reset Compass / View"
        >
          <Compass className="w-6 h-6" />
        </button>
      </div>

      {/* ==================================================== */}
      {/* 4. BOTTOM SHEET (Location, Weather, Risk, Emergency)  */}
      {/* ==================================================== */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:max-w-xl z-30">
        <div className="rounded-3xl bg-slate-900/95 backdrop-blur-2xl border-2 border-sky-500/30 shadow-2xl p-4 sm:p-6 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 truncate pr-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white truncate">
                {selectedPlace.name}
              </h3>
            </div>
            <button
              onClick={() => setBottomSheetOpen(!bottomSheetOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              {bottomSheetOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>

          {bottomSheetOpen && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Weather */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    <span>Weather</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">{selectedPlace.temp}</div>
                  <div className="text-xs text-slate-300 truncate">{selectedPlace.weather}</div>
                </div>

                {/* Flood Risk */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Flood Risk</span>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400">{selectedPlace.risk} Risk</div>
                  <div className="text-xs text-slate-300">Elevated roads open</div>
                </div>
              </div>

              {/* Emergency Nearby */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{selectedPlace.emergency}</div>
                    <div className="text-[10px] text-slate-400">Available 24/7</div>
                  </div>
                </div>
                <a
                  href={`tel:${selectedPlace.emergencyPhone}`}
                  className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              {/* Action: Plan Route to this location */}
              <button
                onClick={() => navigate(`/route-planner?to=${encodeURIComponent(selectedPlace.name)}`)}
                className="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Plan Safe Route Here</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 5. SIMPLE MARKER INFO CARD MODAL                     */}
      {/* ==================================================== */}
      {activeMarker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-sky-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                {activeMarker.type || 'Hazard Report'}
              </span>
              <button onClick={() => setActiveMarker(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-lg text-white">
                {activeMarker.data?.locationName || activeMarker.data?.title || 'Reported Location'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeMarker.data?.description || 'Water accumulation reported by community. Caution advised.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  navigate(`/route-planner?to=${encodeURIComponent(activeMarker.data?.locationName || 'Destination')}`);
                  setActiveMarker(null);
                }}
                className="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate Around</span>
              </button>
              <button
                onClick={() => setActiveMarker(null)}
                className="px-4 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
