import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Droplets,
  Search,
  AlertTriangle,
  Clock,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../services/api';
import { WeatherForecast, LocationSearchResult, DEMO_SAMPLE_LOCATIONS, RISK_LEVELS } from '@floodroute/shared';
import { DataSourceBadge } from '../components/ui/DataSourceBadge';

export const WeatherPage: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState({
    name: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
  });

  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchWeather = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getWeatherForecast(lat, lng);
      setForecastData(res.forecast);
    } catch (err: any) {
      setError('Weather data temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedLoc.lat, selectedLoc.lng);
  }, [selectedLoc]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchLocations(searchQuery);
      setSearchResults(res.locations);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const current = forecastData?.current;
  const weatherRisk = current ? (RISK_LEVELS[current.weatherRisk as keyof typeof RISK_LEVELS] || RISK_LEVELS.LOW) : RISK_LEVELS.LOW;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and City Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <CloudRain className="w-6 h-6 text-cyan-400" />
            <span>Weather Intelligence & Storm Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400">
            High-precision atmospheric monitoring, rainfall precipitation rates and wind vectors for India.
          </p>
        </div>

        {/* Quick Hub Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_SAMPLE_LOCATIONS.slice(0, 5).map((loc) => (
            <button
              key={loc.name}
              onClick={() => setSelectedLoc({ name: loc.name, lat: loc.lat, lng: loc.lng })}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedLoc.name === loc.name
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Search Bar */}
      <div className="relative max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search any town, district or pin code in India..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1 top-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="absolute top-11 left-0 right-0 z-30 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl max-h-52 overflow-y-auto">
            {searchResults.map((loc, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedLoc({ name: loc.name, lat: loc.latitude, lng: loc.longitude });
                  setSearchResults([]);
                  setSearchQuery(loc.displayName);
                }}
                className="w-full text-left p-2.5 hover:bg-slate-800 text-xs border-b border-slate-800/60 last:border-b-0"
              >
                <div className="font-semibold text-slate-200">{loc.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{loc.displayName}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Current Conditions Card */}
      {current && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-white">{selectedLoc.name}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${weatherRisk.bg} ${weatherRisk.border} ${weatherRisk.text}`}>
                    WEATHER RISK: {weatherRisk.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Lat: {selectedLoc.lat.toFixed(4)}°N, Lon: {selectedLoc.lng.toFixed(4)}°E
                </p>
              </div>

              {/* Data Transparency Badge */}
              <DataSourceBadge
                source={current.source}
                dataType="Official Weather Telemetry"
                updatedAt={current.timestamp}
                status={current.isDemo ? 'DEMO' : 'LIVE'}
                isDemo={current.isDemo}
              />
            </div>

            {/* 10 Meteorological Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Temperature
                </span>
                <div className="text-xl font-extrabold text-white">{current.temperatureC}°C</div>
                <div className="text-[10px] text-slate-500">Feels like {current.feelsLikeC}°C</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rainfall Rate
                </span>
                <div className="text-xl font-extrabold text-cyan-400">{current.rainfallMm} mm/h</div>
                <div className="text-[10px] text-slate-500">Surface runoff vector</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-400" /> Relative Humidity
                </span>
                <div className="text-xl font-extrabold text-white">{current.humidityPercent}%</div>
                <div className="text-[10px] text-slate-500">Saturation index</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind Speed
                </span>
                <div className="text-xl font-extrabold text-white">{current.windSpeedKmh} km/h</div>
                <div className="text-[10px] text-slate-500">Direction: {current.windDirectionDeg}°</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" /> Barometric Pressure
                </span>
                <div className="text-xl font-extrabold text-white">{current.pressureHpa || 1010} hPa</div>
                <div className="text-[10px] text-slate-500">Cyclone indicator</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-slate-400" /> Cloud Cover
                </span>
                <div className="text-xl font-extrabold text-white">{current.cloudCoverPercent}%</div>
                <div className="text-[10px] text-slate-500">Atmospheric density</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Ground Visibility
                </span>
                <div className="text-xl font-extrabold text-white">{current.visibilityKm} km</div>
                <div className="text-[10px] text-slate-500">Driving visibility</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-3 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Weather Condition Descriptor</span>
                <div className="text-lg font-bold text-cyan-300">{current.condition}</div>
                <p className="text-[10px] text-slate-400">
                  Calculated purely from IMD/Open-Meteo atmospheric variables without synthetic flood exaggerations.
                </p>
              </div>
            </div>
          </div>

          {/* Meteorological Recharts Telemetry Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: 24-Hour Rainfall Rate Forecast */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                Hourly Rainfall Forecast (mm)
              </h3>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData.hourly.slice(0, 16)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit' })}
                      stroke="#64748b"
                      fontSize={10}
                    />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                      formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                    />
                    <Bar dataKey="rainfallMm" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: 24-Hour Temperature Trajectory */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                Hourly Temperature (°C)
              </h3>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData.hourly.slice(0, 16)}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit' })}
                      stroke="#64748b"
                      fontSize={10}
                    />
                    <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                      formatter={(val: any) => [`${val} °C`, 'Temperature']}
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                    />
                    <Area type="monotone" dataKey="temperatureC" stroke="#F43F5E" strokeWidth={2} fill="url(#tempGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Horizon Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">
              7-Day Synoptic Weather Outlook
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {forecastData.daily.map((day, i) => (
                <div key={i} className="p-3 rounded-xl glass-panel border border-slate-800 text-center space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400">
                    {new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {day.maxTempC}° <span className="text-slate-500 font-normal">{day.minTempC}°</span>
                  </div>
                  <div className="text-xs text-cyan-400 font-medium">{day.rainfallMm} mm</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{day.condition}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
