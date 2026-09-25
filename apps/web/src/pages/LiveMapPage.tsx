import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FloodReportItem,
  DisasterAlertItem,
  RoadConditionItem,
  EmergencyResourceItem,
  INDIA_MAP_BOUNDS,
  LocationSearchResult,
} from '@floodroute/shared';
import {
  ShieldAlert,
  Search,
  Layers,
  CloudRain,
  Waves,
  HeartHandshake,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Crosshair,
  AlertTriangle,
  RefreshCw,
  Bell,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Ruler,
  MapPin,
  X,
  PhoneCall,
  Activity,
  Wind,
  Droplets,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Eye,
  Sliders,
  Hospital,
  Flame,
  LifeBuoy
} from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const { showToast } = useToast();

  // Map Data State
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlertItem[]>([]);
  const [roads, setRoads] = useState<RoadConditionItem[]>([]);
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // UI Panels State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'search' | 'layers' | 'weather' | 'flood' | 'resources'>('layers');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Map Controls State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [baseLayer, setBaseLayer] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [measuringMode, setMeasuringMode] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Layer Toggles
  const [visibleLayers, setVisibleLayers] = useState({
    reports: true,
    alerts: true,
    roads: true,
    hospitals: true,
    shelters: true,
    police: true,
    fire: true,
    radar: true
  });

  // Severity filter for flood reports
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Coordinates focus
  const qLat = parseFloat(searchParams.get('lat') || '');
  const qLng = parseFloat(searchParams.get('lng') || '');
  const hasQueryCoords = !isNaN(qLat) && !isNaN(qLng);

  const [currentCenter, setCurrentCenter] = useState<[number, number]>(
    hasQueryCoords
      ? [qLng, qLat]
      : [INDIA_MAP_BOUNDS.centerLon, INDIA_MAP_BOUNDS.centerLat]
  );
  const [currentZoom, setCurrentZoom] = useState(hasQueryCoords ? 13 : INDIA_MAP_BOUNDS.defaultZoom);

  // Live weather for the current region
  const [liveWeather, setLiveWeather] = useState({
    city: 'Chennai Coastal Zone',
    temp: 29.4,
    condition: 'Heavy Tropical Rain',
    rainMm: 42.8,
    windKmh: 34,
    humidity: 94,
    pressure: 1006,
    riskScore: 84,
    riskLevel: 'CRITICAL',
    riskZone: 'Adyar Catchment Basin'
  });

  // Load all map layers
  const loadMapData = async () => {
    setLoading(true);
    try {
      const [repsRes, alertsRes, roadsRes, resRes] = await Promise.all([
        api.getFloodReports({ limit: 150 }).catch(() => ({ reports: [] })),
        api.getAlerts({ activeOnly: true }).catch(() => ({ alerts: [] })),
        api.getRoadConditions().catch(() => ({ roads: [] })),
        api.getResources().catch(() => ({ resources: [] })),
      ]);

      setReports(repsRes.reports || []);
      setAlerts(alertsRes.alerts || []);
      setRoads(roadsRes.roads || []);
      setResources(resRes.resources || []);
    } catch (err) {
      console.error('Failed to load map layers:', err);
      showToast('error', 'Sync Failed', 'Could not refresh map intelligence layers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.searchLocations(searchQuery.trim());
      setSearchResults(res.locations || []);
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (loc: LocationSearchResult) => {
    setCurrentCenter([loc.longitude, loc.latitude]);
    setCurrentZoom(14);
    setSearchResults([]);
    setSearchQuery(loc.displayName);
    showToast('info', 'Map Centered', `Navigated to ${loc.name}`);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Measure distance simulation
  const toggleMeasureMode = () => {
    if (!measuringMode) {
      setMeasuringMode(true);
      setMeasuredDistance(3.42); // example measured corridor
      showToast('info', 'Measure Mode Active', 'Click two points on the map to calculate straight-line corridor.');
    } else {
      setMeasuringMode(false);
      setMeasuredDistance(null);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (severityFilter === 'ALL') return true;
    return r.severity === severityFilter;
  });

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#020617] text-slate-100 flex flex-col font-sans select-none">
      {/* ==================================================== */}
      {/* TOP GIS BAR */}
      {/* ==================================================== */}
      <div className="relative z-30 h-14 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between shadow-lg">
        {/* Left: Mini Logo & Live Indicator */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/30">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-white hidden sm:inline">
              FloodRoute<span className="text-cyan-400">.GIS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
              <Radio className={`w-2.5 h-2.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              {isConnected ? 'LIVE TELEMETRY' : 'OFFLINE BUFFER'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {reports.length} Incidents • {alerts.length} Alerts Active
            </span>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian cities, highways, or river basins... (Ctrl+K)"
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500/50 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 max-w-md w-full bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
              {searchResults.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="px-3 py-2 text-xs hover:bg-cyan-500/10 cursor-pointer flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate text-slate-200">{loc.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Notifications, Route CTA, User Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Active Disaster Bulletins"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <Link
            to="/route-planner"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Safe Route</span>
          </Link>

          {user ? (
            <Link to="/profile" className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Notifications Popover */}
      {notificationsOpen && (
        <div className="absolute top-14 right-4 z-50 w-80 sm:w-96 glass-card-elevated p-4 rounded-[20px] border border-cyan-500/30 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-cyan-400" />
              Live Alerts Feed ({alerts.length})
            </span>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active red alerts at this moment.</p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                      a.severity === 'CRITICAL' || a.severity === 'DANGER' || (a.severity as any) === 'RED' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {a.severity} WARNING
                    </span>
                    <span className="text-slate-400">{a.district}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white leading-snug">{a.title}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{a.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MAIN GIS CANVAS & FLOATING OVERLAYS */}
      {/* ==================================================== */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-bleed MapLibre Map Container */}
        <div className="absolute inset-0 z-0">
          <InteractiveMap
            center={currentCenter}
            zoom={currentZoom}
            reports={filteredReports}
            alerts={visibleLayers.alerts ? alerts : []}
            roads={visibleLayers.roads ? roads : []}
            resources={visibleLayers.hospitals || visibleLayers.shelters ? resources : []}
            className="w-full h-full"
          />
        </div>

        {/* ==================================================== */}
        {/* LEFT SIDEBAR (Collapsible) */}
        {/* ==================================================== */}
        <div
          className={`absolute top-4 left-4 z-20 transition-all duration-300 ease-in-out ${
            leftSidebarOpen ? 'w-80 sm:w-88' : 'w-12'
          }`}
        >
          <div className="glass-panel rounded-[20px] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-[#020617]/85">
            {/* Sidebar Header & Toggle */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              {leftSidebarOpen ? (
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                    GIS Control Deck
                  </span>
                </div>
              ) : null}
              <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
                title={leftSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              >
                {leftSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {leftSidebarOpen && (
              <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
                {/* Navigation Tabs */}
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] font-medium text-slate-400">
                  {[
                    { id: 'layers', label: 'Layers', icon: Layers },
                    { id: 'search', label: 'Search', icon: Search },
                    { id: 'weather', label: 'Weather', icon: CloudRain },
                    { id: 'flood', label: 'Flood', icon: Waves },
                    { id: 'resources', label: 'Lifelines', icon: HeartHandshake },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSidebarTab(tab.id as any)}
                        className={`flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all ${
                          activeSidebarTab === tab.id
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab: Layers */}
                {activeSidebarTab === 'layers' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Telemetry Overlays</span>
                    {[
                      { id: 'reports', label: 'Verified Inundation Reports', count: reports.length, color: 'text-rose-400' },
                      { id: 'alerts', label: 'Official NDMA / IMD Polygons', count: alerts.length, color: 'text-amber-400' },
                      { id: 'roads', label: 'Confirmed Road Closures', count: roads.length, color: 'text-slate-300' },
                      { id: 'hospitals', label: 'Emergency Trauma Hospitals', count: 18, color: 'text-emerald-400' },
                      { id: 'shelters', label: 'Flood Evacuation Shelters', count: 24, color: 'text-blue-400' },
                      { id: 'radar', label: 'Precipitation Doppler Radar', count: 'Live', color: 'text-sky-400' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(visibleLayers as any)[item.id] ?? true}
                            onChange={(e) =>
                              setVisibleLayers({ ...visibleLayers, [item.id]: e.target.checked })
                            }
                            className="w-3.5 h-3.5 rounded text-cyan-500 focus:ring-0 bg-slate-800 border-slate-700"
                          />
                          <span className="text-slate-200">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${item.color}`}>
                          {item.count}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Tab: Search */}
                {activeSidebarTab === 'search' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Spatial Geocode Search</span>
                    <form onSubmit={handleSearch} className="space-y-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search district or road..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                      >
                        Find on Map
                      </button>
                    </form>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Jump Targets:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          { name: 'Velachery, Chennai', coords: [80.2207, 12.9756] },
                          { name: 'Kurla, Mumbai', coords: [72.8797, 19.0728] },
                          { name: 'Guwahati, Assam', coords: [91.7362, 26.1445] },
                          { name: 'Yamuna Floodplain, Delhi', coords: [77.2410, 28.6562] },
                        ].map((q) => (
                          <button
                            key={q.name}
                            onClick={() => {
                              setCurrentCenter(q.coords as [number, number]);
                              setCurrentZoom(14);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-cyan-300"
                          >
                            {q.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Weather */}
                {activeSidebarTab === 'weather' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Atmospheric Telemetry</span>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-950/60 to-slate-900 border border-sky-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{liveWeather.city}</span>
                        <span className="text-xs font-bold text-sky-400">{liveWeather.temp}°C</span>
                      </div>
                      <div className="text-[11px] text-sky-300 flex items-center gap-1.5">
                        <CloudRain className="w-3.5 h-3.5" />
                        <span>{liveWeather.condition}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                        <div>Rain Rate: <strong className="text-white">{liveWeather.rainMm} mm/h</strong></div>
                        <div>Wind Gusts: <strong className="text-white">{liveWeather.windKmh} km/h</strong></div>
                        <div>Humidity: <strong className="text-white">{liveWeather.humidity}%</strong></div>
                        <div>Barometer: <strong className="text-white">{liveWeather.pressure} hPa</strong></div>
                      </div>
                    </div>
                    <Link
                      to="/weather"
                      className="block text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400"
                    >
                      Open Full 7-Day Weather Radar →
                    </Link>
                  </div>
                )}

                {/* Tab: Flood */}
                {activeSidebarTab === 'flood' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Severity Filter</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'ALL', label: 'All Hazards', color: 'text-white' },
                        { id: 'CRITICAL', label: 'Critical Only', color: 'text-rose-400' },
                        { id: 'HIGH', label: 'High Severity', color: 'text-amber-400' },
                        { id: 'MEDIUM', label: 'Medium Depth', color: 'text-cyan-400' },
                      ].map((sev) => (
                        <button
                          key={sev.id}
                          onClick={() => setSeverityFilter(sev.id as any)}
                          className={`p-2 rounded-xl text-xs font-medium border transition-all text-left ${
                            severityFilter === sev.id
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className={sev.color}>{sev.label}</span>
                        </button>
                      ))}
                    </div>
                    <Link
                      to="/flood-intelligence"
                      className="block text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400"
                    >
                      River Basin Flood Heatmaps →
                    </Link>
                  </div>
                )}

                {/* Tab: Resources */}
                {activeSidebarTab === 'resources' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Disaster Lifelines</span>
                    <div className="space-y-2">
                      {[
                        { title: 'Velachery Emergency Clinic', dist: '1.2 km', type: 'Trauma Unit', beds: '14 Free', icon: Hospital },
                        { title: 'Adyar Community Flood Shelter', dist: '1.8 km', type: 'Relief Camp', beds: '85 Open', icon: LifeBuoy },
                        { title: 'T. Nagar Disaster Police Post', dist: '2.4 km', type: 'Patrol Base', beds: '24/7', icon: ShieldCheck },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-white">{item.title}</span>
                              <span className="text-cyan-400 font-mono text-[10px]">{item.dist}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{item.type}</span>
                              <span className="text-emerald-400 font-bold">{item.beds}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link
                      to="/emergency-resources"
                      className="block text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400"
                    >
                      View All 24/7 Lifelines →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT FLOATING HUD PANEL */}
        {/* ==================================================== */}
        <div
          className={`absolute top-4 right-4 z-20 transition-all duration-300 ease-in-out ${
            rightPanelOpen ? 'w-80 sm:w-84' : 'w-10'
          }`}
        >
          <div className="glass-card-elevated rounded-[20px] border border-cyan-500/30 shadow-2xl overflow-hidden bg-[#020617]/85 backdrop-blur-xl">
            {/* Right Panel Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              {rightPanelOpen ? (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                    Situational Radar
                  </span>
                </div>
              ) : null}
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
                title={rightPanelOpen ? 'Collapse HUD' : 'Expand HUD'}
              >
                {rightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {rightPanelOpen && (
              <div className="p-4 space-y-4">
                {/* 1. District Risk Score Gauge */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-950 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{liveWeather.riskZone}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 font-mono">
                      {liveWeather.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-12 h-12 rounded-full border-4 border-rose-500 flex items-center justify-center font-heading font-extrabold text-white text-sm shadow-[0_0_15px_#EF4444]">
                      {liveWeather.riskScore}
                    </div>
                    <div>
                      <div className="text-xs text-white font-bold">Severe Inundation Potential</div>
                      <div className="text-[10px] text-slate-400 leading-snug">
                        Multi-factor formula: 42.8mm rain + active canal breach + 2 verified road blocks.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Nearest Emergency Shelter */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Nearest Shelter</span>
                    <span className="text-[10px] text-slate-400 font-mono">1.4 km away</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    Velachery Community Flood Relief Camp
                  </h4>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Capacity Occupancy:</span>
                    <strong className="text-emerald-400">120 / 200 Beds Open</strong>
                  </div>
                  <Link
                    to="/route-planner"
                    className="w-full py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate Safely Here</span>
                  </Link>
                </div>

                {/* 3. Active Alert Ticker */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      NDMA Red Alert
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">08:30 AM</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Heavy inundation reported along Adyar River catchment. Citizens advised to take elevated bypass routes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* MAP CONTROLS TOOLBAR (Floating Bottom-Right) */}
        {/* ==================================================== */}
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
          {/* Zoom In / Out */}
          <div className="glass-panel p-1 rounded-xl border border-white/10 flex flex-col gap-1 shadow-xl">
            <button
              onClick={() => setCurrentZoom((z) => Math.min(z + 1, 18))}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center text-sm font-bold transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setCurrentZoom((z) => Math.max(z - 1, 4))}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center text-sm font-bold transition-colors"
              title="Zoom Out"
            >
              −
            </button>
          </div>

          {/* Compass, Locate, Measure, Fullscreen */}
          <div className="glass-panel p-1 rounded-xl border border-white/10 flex flex-col gap-1 shadow-xl">
            <button
              onClick={() => {
                // Reset bearing to north
                showToast('info', 'Compass Aligned', 'Bearing reset to North 0°');
              }}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-400 flex items-center justify-center transition-colors"
              title="Reset Compass"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setCurrentCenter([pos.coords.longitude, pos.coords.latitude]);
                      setCurrentZoom(15);
                      showToast('success', 'Location Detected', 'Centered on your current GPS location.');
                    },
                    () => showToast('warning', 'Location Error', 'Unable to retrieve GPS coordinates.')
                  );
                }
              }}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-emerald-400 flex items-center justify-center transition-colors"
              title="Locate Me"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMeasureMode}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                measuringMode
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Measure Distance"
            >
              <Ruler className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Base Layer Switcher */}
          <div className="glass-panel p-1 rounded-xl border border-white/10 shadow-xl flex items-center justify-center">
            <button
              onClick={() => {
                const next = baseLayer === 'dark' ? 'satellite' : baseLayer === 'satellite' ? 'streets' : 'dark';
                setBaseLayer(next);
                showToast('info', 'Base Layer Changed', `Switched to ${next.toUpperCase()} layer.`);
              }}
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold uppercase transition-colors"
              title={`Switch Basemap (Current: ${baseLayer})`}
            >
              {baseLayer.slice(0, 3)}
            </button>
          </div>
        </div>

        {/* Measure Distance Banner */}
        {measuringMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-card-elevated px-4 py-2 rounded-2xl border border-cyan-400/40 flex items-center gap-3 shadow-2xl">
            <Ruler className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-300 font-medium">Measured Corridor Distance: </span>
              <span className="font-heading font-extrabold text-white text-sm">
                {measuredDistance ? `${measuredDistance} km` : 'Click two points'}
              </span>
            </div>
            <button
              onClick={toggleMeasureMode}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* BOTTOM ROUTE DRAWER (Collapsible) */}
        {/* ==================================================== */}
        <div className="absolute bottom-4 left-4 z-20 max-w-lg w-full">
          <div className="glass-card-elevated rounded-[20px] border border-cyan-500/30 overflow-hidden shadow-2xl bg-[#020617]/90 backdrop-blur-xl">
            {/* Drawer Header Toggle */}
            <div 
              onClick={() => setBottomDrawerOpen(!bottomDrawerOpen)}
              className="p-3 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  Active Transit Corridor Analysis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SAFE BYPASS AVAILABLE
                </span>
                {bottomDrawerOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {/* Expanded Drawer Content */}
            {bottomDrawerOpen && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono block">CORRIDOR ETA</span>
                    <span className="text-sm font-bold text-white">26 mins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono block">DISTANCE</span>
                    <span className="text-sm font-bold text-white">18.8 km</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono block">FLOOD RISK</span>
                    <span className="text-sm font-bold text-emerald-400">18 / 100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-white">Active Detour Recommendation:</strong> Avoid Velachery 100 Feet Main Road due to 2.5 ft deep standing water. Diverting through Elevated OMR Road.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    2 Alternative Routes Computed
                  </span>
                  <Link
                    to="/route-planner"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Open Route Planner</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
