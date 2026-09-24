import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import {
  Layers,
  Crosshair,
  Search,
  AlertTriangle,
  Shield,
  Hospital,
  Flame,
  LifeBuoy,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Navigation,
} from 'lucide-react';
import {
  FloodReportItem,
  DisasterAlertItem,
  EmergencyResourceItem,
  RoadConditionItem,
  LocationSearchResult,
  MAP_LEGEND_COLORS,
  INDIA_MAP_BOUNDS,
} from '@floodroute/shared';
import { api } from '../../services/api';

interface InteractiveMapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  reports?: FloodReportItem[];
  alerts?: DisasterAlertItem[];
  roads?: RoadConditionItem[];
  resources?: EmergencyResourceItem[];
  routeGeometry?: any;
  onLocationSelect?: (loc: { lat: number; lng: number; name: string }) => void;
  selectedMarker?: any;
  className?: string;
  interactiveSelect?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = [INDIA_MAP_BOUNDS.centerLon, INDIA_MAP_BOUNDS.centerLat],
  zoom = INDIA_MAP_BOUNDS.defaultZoom,
  reports = [],
  alerts = [],
  roads = [],
  resources = [],
  routeGeometry = null,
  onLocationSelect,
  className = 'w-full h-full min-h-[500px]',
  interactiveSelect = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Layer Toggles
  const [layers, setLayers] = useState({
    reports: true,
    alerts: true,
    roads: true,
    hospitals: true,
    shelters: true,
    police: true,
    fire: true,
  });

  const [legendOpen, setLegendOpen] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Active Selected Marker Details Drawer
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; data: any } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Configurable map style with robust fallback
    const styleUrl =
      (import.meta as any).env?.VITE_MAP_STYLE_URL || {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors | FloodRoute AI',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl as any,
      center: center,
      zoom: zoom,
      maxBounds: [
        [60.0, 5.0], // Southwest [lng, lat] bounds for India subcontinent
        [100.0, 38.0], // Northeast
      ],
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    map.on('click', (e) => {
      if (interactiveSelect && onLocationSelect) {
        onLocationSelect({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          name: `Pin: ${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`,
        });
      }
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  // Update Route Geometry
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = 'route-source';
    const layerId = 'route-layer';

    const updateRoute = () => {
      if (!map.isStyleLoaded()) return;

      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);

      if (routeGeometry) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry,
          },
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#06B6D4',
            'line-width': 6,
            'line-opacity': 0.85,
          },
        });

        // Fit map bounds to route geometry
        const coordinates = routeGeometry.coordinates;
        if (coordinates && coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (b: maplibregl.LngLatBounds, coord: [number, number]) => b.extend(coord),
            new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
          );
          map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
        }
      }
    };

    if (map.isStyleLoaded()) {
      updateRoute();
    } else {
      map.once('load', updateRoute);
    }
  }, [routeGeometry]);

  // Render & Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Flood Reports Markers
    if (layers.reports) {
      reports.forEach((report) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-125 transition-transform';

        let color = MAP_LEGEND_COLORS.CAUTION;
        if (report.severity === 'CRITICAL') color = MAP_LEGEND_COLORS.FLOODED;
        else if (report.severity === 'HIGH') color = MAP_LEGEND_COLORS.HIGH_RISK;

        el.innerHTML = `
          <div style="background-color: ${color};" class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold ring-4 ring-black/20">
            🌊
          </div>
        `;

        el.onclick = () => {
          setSelectedEntity({ type: 'FLOOD_REPORT', data: report });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([report.longitude, report.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. Official Alerts Markers
    if (layers.alerts) {
      alerts.forEach((alert) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
        el.innerHTML = `
          <div style="background-color: ${MAP_LEGEND_COLORS.OFFICIAL_ALERT};" class="w-9 h-9 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-sm font-bold animate-pulse">
            ⚠️
          </div>
        `;

        el.onclick = () => {
          setSelectedEntity({ type: 'OFFICIAL_ALERT', data: alert });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([alert.longitude, alert.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Road Conditions Markers
    if (layers.roads) {
      roads.forEach((road) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-125 transition-transform';

        const isBlocked = road.condition === 'BLOCKED';
        const isFlooded = road.condition === 'FLOODED';
        const color = isBlocked ? MAP_LEGEND_COLORS.BLOCKED : isFlooded ? MAP_LEGEND_COLORS.FLOODED : MAP_LEGEND_COLORS.CAUTION;

        el.innerHTML = `
          <div style="background-color: ${color};" class="w-7 h-7 rounded-lg border border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            ${isBlocked ? '⛔' : '🚧'}
          </div>
        `;

        el.onclick = () => {
          setSelectedEntity({ type: 'ROAD_CONDITION', data: road });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([road.longitude, road.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 4. Emergency Resources Markers
    resources.forEach((res) => {
      let shouldShow = false;
      let icon = '🏥';
      if (res.category === 'HOSPITAL' && layers.hospitals) {
        shouldShow = true;
        icon = '🏥';
      } else if (res.category === 'SHELTER' && layers.shelters) {
        shouldShow = true;
        icon = '⛺';
      } else if (res.category === 'POLICE_STATION' && layers.police) {
        shouldShow = true;
        icon = '👮';
      } else if (res.category === 'FIRE_STATION' && layers.fire) {
        shouldShow = true;
        icon = '🚒';
      } else if (layers.shelters) {
        shouldShow = true;
        icon = '🆘';
      }

      if (shouldShow) {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
        el.innerHTML = `
          <div style="background-color: ${MAP_LEGEND_COLORS.RESOURCE};" class="w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            ${icon}
          </div>
        `;

        el.onclick = () => {
          setSelectedEntity({ type: 'RESOURCE', data: res });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([res.longitude, res.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      }
    });
  }, [reports, alerts, roads, resources, layers]);

  // Use My Location Feature
  const handleUseMyLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });

          // Add a user location pulsing pin
          const el = document.createElement('div');
          el.className = 'w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-xl ring-8 ring-cyan-500/30 animate-pulse';
          new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat: latitude,
            lng: longitude,
            name: 'Current Location',
          });
        }
      },
      (err) => {
        setIsLocating(false);
        // Prompt specific wording requirement:
        // "Location permission was not granted. Search for a location manually."
        setLocationError('Location permission was not granted. Search for a location manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Location Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const data = await api.searchLocations(searchQuery);
      setSearchResults(data.locations);
      setShowSearchDropdown(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (loc: LocationSearchResult) => {
    setShowSearchDropdown(false);
    setSearchQuery(loc.displayName);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [loc.longitude, loc.latitude],
        zoom: 13,
        essential: true,
      });
    }

    if (onLocationSelect) {
      onLocationSelect({
        lat: loc.latitude,
        lng: loc.longitude,
        name: loc.displayName,
      });
    }
  };

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl border border-slate-800 shadow-2xl`}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Search Bar */}
      <div className="absolute top-4 left-4 z-20 w-80 sm:w-96">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search state, district, city, road..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-navy-900/90 backdrop-blur-md border border-slate-700/80 text-white text-xs placeholder-slate-400 shadow-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="mt-2 bg-navy-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-30">
            {searchResults.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSearchResult(loc)}
                className="w-full text-left p-2.5 hover:bg-slate-800 border-b border-slate-800/60 last:border-b-0 flex items-start gap-2 text-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">{loc.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{loc.displayName}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Map Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Use My Location Button */}
        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-2 bg-navy-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Zoom to current device location"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
          <span className="hidden sm:inline">Use My Location</span>
        </button>

        {/* Layers Control Toggle */}
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className="p-2 bg-navy-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md transition-all ml-auto"
          title="Toggle Map Data Layers"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Location Error Notice */}
      {locationError && (
        <div className="absolute top-20 left-4 right-4 z-30 sm:max-w-md bg-amber-950/90 border border-amber-600/50 p-3 rounded-xl shadow-2xl flex items-center justify-between text-xs text-amber-200 backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button onClick={() => setLocationError(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Layer Toggles Floating Card */}
      {layersOpen && (
        <div className="absolute top-16 right-4 z-30 w-64 bg-navy-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl space-y-2 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Active Map Layers
            </span>
            <button onClick={() => setLayersOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 font-medium">
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">🌊 Community Flood Reports</span>
              <input
                type="checkbox"
                checked={layers.reports}
                onChange={(e) => setLayers({ ...layers, reports: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">⚠️ Official Warnings (NDMA/IMD)</span>
              <input
                type="checkbox"
                checked={layers.alerts}
                onChange={(e) => setLayers({ ...layers, alerts: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">⛔ Road Closures & Blockages</span>
              <input
                type="checkbox"
                checked={layers.roads}
                onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">🏥 Hospitals & Trauma Units</span>
              <input
                type="checkbox"
                checked={layers.hospitals}
                onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">⛺ Relief Shelters</span>
              <input
                type="checkbox"
                checked={layers.shelters}
                onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-200">👮 Police & Fire Outposts</span>
              <input
                type="checkbox"
                checked={layers.police}
                onChange={(e) => setLayers({ ...layers, police: e.target.checked, fire: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      )}

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-20">
        {legendOpen ? (
          <div className="bg-navy-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-[11px] font-mono space-y-1.5 w-52 animate-fadeIn">
            <div className="flex items-center justify-between font-bold font-sans text-xs text-white pb-1 border-b border-slate-800">
              <span>Map Color Legend</span>
              <button onClick={() => setLegendOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block shadow"></span>
              <span className="text-slate-300">GREEN = SAFE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block shadow"></span>
              <span className="text-slate-300">YELLOW = CAUTION</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F97316] inline-block shadow"></span>
              <span className="text-slate-300">ORANGE = HIGH RISK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow"></span>
              <span className="text-slate-300">RED = FLOODED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1E293B] border border-slate-500 inline-block shadow"></span>
              <span className="text-slate-300">BLACK = BLOCKED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6] inline-block shadow"></span>
              <span className="text-slate-300">BLUE = EMERGENCY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#A855F7] inline-block shadow"></span>
              <span className="text-slate-300">PURPLE = OFFICIAL ALERT</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setLegendOpen(true)}
            className="px-2.5 py-1.5 bg-navy-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-mono text-cyan-400 shadow-xl backdrop-blur-md"
          >
            Show Legend
          </button>
        )}
      </div>

      {/* Slide-in Detail Drawer for Clicked Marker */}
      {selectedEntity && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 bg-navy-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-5 shadow-2xl animate-fadeIn">
          <div className="flex items-start justify-between mb-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {selectedEntity.type.replace('_', ' ')}
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FLOOD REPORT DETAIL */}
          {selectedEntity.type === 'FLOOD_REPORT' && (() => {
            const r: FloodReportItem = selectedEntity.data;
            return (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-white">{r.locationName}</h4>
                  <div className="text-[11px] font-mono text-cyan-400">{r.reportCode}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400">Severity:</span>
                    <div className="font-bold text-rose-400">{r.severity}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <div className="font-bold text-emerald-400">{r.status}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Water Level:</span>
                    <div className="font-medium text-slate-200">{r.waterLevel.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Reported:</span>
                    <div className="text-slate-200">{new Date(r.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  {r.description}
                </p>

                {r.aiAnalysis && (
                  <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/40 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI-Assisted Image Analysis
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Flood Detected:</span>
                      <span className="font-bold text-white">{r.aiAnalysis.floodDetected ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Confidence:</span>
                      <span className="font-bold text-cyan-400">{r.aiAnalysis.confidence}%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Vehicle Accessibility:</span>
                      <span className="font-medium text-amber-400">{r.aiAnalysis.vehicleAccessibility}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 italic">{r.aiAnalysis.disclaimer}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* OFFICIAL ALERT DETAIL */}
          {selectedEntity.type === 'OFFICIAL_ALERT' && (() => {
            const a: DisasterAlertItem = selectedEntity.data;
            return (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-white">{a.title}</h4>
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 font-bold">
                  Severity: {a.severity}
                </div>
                <p className="text-slate-300 leading-relaxed">{a.description}</p>
                <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                  <div>Issuing Authority: <span className="text-cyan-400">{a.sourceLabel}</span></div>
                  <div>Location: {a.locationName}</div>
                  <div>Valid until: {new Date(a.expiryTime).toLocaleString()}</div>
                </div>
              </div>
            );
          })()}

          {/* ROAD CONDITION DETAIL */}
          {selectedEntity.type === 'ROAD_CONDITION' && (() => {
            const rc: RoadConditionItem = selectedEntity.data;
            return (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-white">{rc.roadName}</h4>
                <div className="font-bold text-amber-400">Condition: {rc.condition}</div>
                <p className="text-slate-300">{rc.reason}</p>
                <div className="text-[11px] font-mono text-slate-400">
                  <div>Reported By: {rc.source}</div>
                  <div>Location: {rc.locationName}</div>
                </div>
              </div>
            );
          })()}

          {/* RESOURCE DETAIL */}
          {selectedEntity.type === 'RESOURCE' && (() => {
            const res: EmergencyResourceItem = selectedEntity.data;
            return (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-white">{res.name}</h4>
                <div className="text-cyan-400 font-semibold">{res.categoryLabel}</div>
                <p className="text-slate-300">{res.address}</p>
                {res.phone && (
                  <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg">
                    <span className="text-slate-400">Helpline:</span>
                    <a href={`tel:${res.phone}`} className="font-bold text-cyan-400 hover:underline">
                      {res.phone}
                    </a>
                  </div>
                )}
                {res.notes && <div className="text-[11px] text-slate-400 italic">{res.notes}</div>}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
