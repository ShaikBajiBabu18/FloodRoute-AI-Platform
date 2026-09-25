import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  Sun,
  CloudLightning,
  Cloud,
  Wind,
  Droplets,
  Search,
  MapPin,
  RefreshCw,
  Umbrella,
} from 'lucide-react';
import { api } from '../services/api';
import { WeatherForecast, LocationSearchResult } from '@floodroute/shared';

export const WeatherPage: React.FC = () => {
  const [city, setCity] = useState({
    name: 'Chennai, Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
  });

  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);

  const fetchWeather = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await api.getWeatherForecast(lat, lng);
      setForecast(res.forecast);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city.lat, city.lng);
  }, [city]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.searchLocations(searchQuery);
      setSearchResults(res.locations || []);
    } catch {
      setSearchResults([]);
    }
  };

  const current = forecast?.current;
  const temp = current ? Math.round(current.temperatureC) : 29;
  const condition = current?.condition || 'Moderate Rain';
  const rainChance = current ? Math.min(100, Math.round(current.rainfallMm > 0 ? 70 + current.rainfallMm * 2 : 20)) : 75;
  const windSpeed = current ? Math.round(current.windSpeedKmh) : 18;
  const humidity = current ? Math.round(current.humidityPercent) : 78;

  // Hourly timeline
  const hourly = forecast?.hourly && forecast.hourly.length > 0
    ? forecast.hourly.slice(0, 12).map((h) => ({
        time: h.time,
        temp: Math.round(h.temperatureC),
        rain: h.popPercent,
        condition: h.condition,
      }))
    : [
        { time: 'Now', temp: 29, rain: 80, condition: 'Rain' },
        { time: '1 PM', temp: 30, rain: 85, condition: 'Heavy Rain' },
        { time: '2 PM', temp: 30, rain: 70, condition: 'Showers' },
        { time: '3 PM', temp: 29, rain: 60, condition: 'Showers' },
        { time: '4 PM', temp: 28, rain: 50, condition: 'Cloudy' },
        { time: '5 PM', temp: 28, rain: 40, condition: 'Cloudy' },
        { time: '6 PM', temp: 27, rain: 30, condition: 'Partly Cloudy' },
        { time: '7 PM', temp: 27, rain: 20, condition: 'Clear' },
      ];

  // 7-day forecast
  const daily = forecast?.daily && forecast.daily.length > 0
    ? forecast.daily.map((d) => ({
        day: d.date,
        condition: d.condition,
        min: Math.round(d.minTempC),
        max: Math.round(d.maxTempC),
        rain: d.rainfallMm > 2 ? 80 : 30,
      }))
    : [
        { day: 'Today', condition: 'Heavy Rain', min: 25, max: 31, rain: 85 },
        { day: 'Tomorrow', condition: 'Thunderstorm', min: 25, max: 30, rain: 90 },
        { day: 'Friday', condition: 'Rain Showers', min: 24, max: 32, rain: 70 },
        { day: 'Saturday', condition: 'Scattered Clouds', min: 26, max: 33, rain: 40 },
        { day: 'Sunday', condition: 'Partly Sunny', min: 27, max: 34, rain: 25 },
        { day: 'Monday', condition: 'Sunny / Warm', min: 28, max: 35, rain: 15 },
        { day: 'Tuesday', condition: 'Clear Sky', min: 27, max: 35, rain: 10 },
      ];

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('thunder') || c.includes('storm')) {
      return <CloudLightning className="w-12 h-12 text-amber-400" />;
    }
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className="w-12 h-12 text-sky-400" />;
    }
    if (c.includes('cloud')) {
      return <Cloud className="w-12 h-12 text-slate-300" />;
    }
    return <Sun className="w-12 h-12 text-amber-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Search Bar at Top */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center h-14 rounded-2xl bg-slate-900 border-2 border-sky-500/40 px-4 gap-3">
            <Search className="w-5 h-5 text-sky-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian city for weather..."
              className="w-full bg-transparent text-base text-white placeholder-slate-400 outline-none"
            />
            {loading && <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" />}
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="absolute top-16 left-0 right-0 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-800">
            {searchResults.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCity({ name: loc.displayName, lat: loc.latitude, lng: loc.longitude });
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                className="px-4 py-3 text-sm hover:bg-sky-500/10 cursor-pointer text-slate-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{loc.displayName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 1. LARGE TEMPERATURE & CURRENT STATUS                */}
      {/* ==================================================== */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border-2 border-sky-500/30 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 text-sky-300 text-sm font-semibold">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>{city.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="p-4 rounded-3xl bg-sky-500/15 border border-sky-500/30 shadow-inner">
            {getWeatherIcon(condition)}
          </div>
          <div>
            <div className="font-heading font-extrabold text-7xl sm:text-8xl text-white tracking-tight">
              {temp}°C
            </div>
            <div className="text-xl sm:text-2xl font-bold text-sky-300 mt-1">
              {condition}
            </div>
          </div>
        </div>

        {/* 3 Simple Stats: Rain Chance, Wind, Humidity */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg mx-auto">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Umbrella className="w-4 h-4 text-sky-400" />
              <span>Rain</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{rainChance}%</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>Wind</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{windSpeed} km/h</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{humidity}%</div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. HOURLY FORECAST (Horizontal Scroll)              */}
      {/* ==================================================== */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-heading font-extrabold text-xl text-white">
          Hourly Forecast
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {hourly.map((h, i) => (
            <div
              key={i}
              className="min-w-[85px] p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 shrink-0"
            >
              <div className="text-xs font-bold text-slate-400">{h.time}</div>
              <div className="flex justify-center">
                {getWeatherIcon(h.condition)}
              </div>
              <div className="font-heading font-extrabold text-lg text-white">{h.temp}°</div>
              <div className="text-[11px] font-bold text-sky-400">{h.rain}% rain</div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. 7 DAY FORECAST                                    */}
      {/* ==================================================== */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-heading font-extrabold text-xl text-white">
          7-Day Forecast
        </h3>
        <div className="space-y-2.5">
          {daily.map((d, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
            >
              <div className="w-24 font-bold text-sm text-white">{d.day}</div>
              <div className="flex items-center gap-2 flex-1">
                <div className="scale-75 shrink-0">{getWeatherIcon(d.condition)}</div>
                <span className="text-xs text-slate-300 truncate hidden sm:inline">{d.condition}</span>
              </div>
              <div className="text-xs font-bold text-sky-400 w-16 text-right">{d.rain}% rain</div>
              <div className="font-mono text-sm font-bold text-white w-20 text-right">
                {d.min}° / {d.max}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
