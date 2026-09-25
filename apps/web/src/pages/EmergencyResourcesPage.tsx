import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Hospital,
  Flame,
  Shield,
  Home,
  MapPin,
  Navigation,
  Phone,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyResourceItem } from '@floodroute/shared';

export const EmergencyResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'HOSPITAL' | 'FIRE_STATION' | 'POLICE' | 'SHELTER'>('ALL');
  const [resources, setResources] = useState<EmergencyResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getResources({ category: selectedCategory === 'ALL' ? undefined : selectedCategory })
      .then((res) => setResources(res.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
          Emergency Help
        </h1>
        <p className="text-base text-slate-300 max-w-lg mx-auto">
          One-tap buttons to call for help, find rescue shelters, or locate hospitals.
        </p>
      </div>

      {/* ==================================================== */}
      {/* 1. LARGE EMERGENCY BUTTONS (One tap only!)           */}
      {/* ☎ Call 112                                          */}
      {/* 🏥 Nearest Hospital                                 */}
      {/* 🚒 Fire Station                                     */}
      {/* 👮 Police                                           */}
      {/* 🏠 Shelter                                          */}
      {/* ==================================================== */}
      <div className="space-y-4">
        {/* Main Life Safety Dial: 112 (Massive 64px+ button) */}
        <a
          href="tel:112"
          className="w-full h-20 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center gap-4 shadow-2xl shadow-rose-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PhoneCall className="w-8 h-8 animate-bounce" />
          <span>☎ Call 112 (National Emergency)</span>
        </a>

        {/* 4 One-Tap Category Action Buttons (56px+ height) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Hospital */}
          <button
            onClick={() => setSelectedCategory('HOSPITAL')}
            className={`h-20 sm:h-24 p-3 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'HOSPITAL'
                ? 'bg-rose-500/25 border-rose-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/50 hover:text-white'
            }`}
          >
            <span className="text-2xl">🏥</span>
            <span className="font-extrabold text-sm sm:text-base">Hospital</span>
          </button>

          {/* Fire */}
          <button
            onClick={() => setSelectedCategory('FIRE_STATION')}
            className={`h-20 sm:h-24 p-3 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'FIRE_STATION'
                ? 'bg-amber-500/25 border-amber-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white'
            }`}
          >
            <span className="text-2xl">🚒</span>
            <span className="font-extrabold text-sm sm:text-base">Fire Station</span>
          </button>

          {/* Police */}
          <button
            onClick={() => setSelectedCategory('POLICE')}
            className={`h-20 sm:h-24 p-3 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'POLICE'
                ? 'bg-blue-500/25 border-blue-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white'
            }`}
          >
            <span className="text-2xl">👮</span>
            <span className="font-extrabold text-sm sm:text-base">Police</span>
          </button>

          {/* Shelter */}
          <button
            onClick={() => setSelectedCategory('SHELTER')}
            className={`h-20 sm:h-24 p-3 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'SHELTER'
                ? 'bg-emerald-500/25 border-emerald-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="font-extrabold text-sm sm:text-base">Shelter</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. EMERGENCY CENTERS LIST                            */}
      {/* ==================================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-2xl text-white">
            {selectedCategory === 'ALL' ? 'Nearest Emergency Facilities' : `Nearest ${selectedCategory.replace('_', ' ')}s`}
          </h2>
          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="text-xs font-bold text-sky-400 hover:underline"
            >
              Show All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center p-10 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
            No nearby centers found in this category. Call 112 for direct dispatch.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-lg text-white">
                      {res.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-sky-400 border border-slate-700">
                      {res.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{res.address}, {res.city}</span>
                  </p>

                  {res.notes && (
                    <div className="text-xs text-emerald-400 font-semibold">
                      {res.notes}
                    </div>
                  )}
                </div>

                {/* Actions: One Tap Call + Directions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <a
                    href={`tel:${res.phone}`}
                    className="h-12 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>

                  <button
                    onClick={() => navigate(`/route-planner?to=${encodeURIComponent(`${res.name}, ${res.city}`)}`)}
                    className="h-12 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
