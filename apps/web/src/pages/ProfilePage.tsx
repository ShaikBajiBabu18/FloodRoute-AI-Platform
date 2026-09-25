import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  FileText,
  Settings,
  Languages,
  Moon,
  Type,
  Volume2,
  Eye,
  LogOut,
  Plus,
  Trash2,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { LanguageLocale } from '@floodroute/shared';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { locale, setLocale } = useI18n();
  const {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    readAloud,
    isSpeaking,
  } = useAccessibility();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Saved places
  const [savedPlaces, setSavedPlaces] = useState([
    { id: '1', name: 'Home', address: 'Velachery Bypass Road, Chennai', lat: 12.978, lng: 80.2207 },
    { id: '2', name: 'Work Office', address: 'Tidel Park, Tharamani, Chennai', lat: 12.9892, lng: 80.2483 },
    { id: '3', name: 'Parents House', address: 'T. Nagar, Chennai', lat: 13.042, lng: 80.251 },
  ]);

  // My Reports
  const [myReports, setMyReports] = useState([
    { id: '1', hazard: 'Waterlogging', location: 'Velachery 100 Feet Road', time: 'Today, 11:30 AM', status: 'Verified' },
    { id: '2', hazard: 'Road Block', location: 'Anna Salai underpass', time: 'Yesterday', status: 'Cleared' },
  ]);

  const languages: { code: LanguageLocale; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  ];

  const handleTestVoice = () => {
    readAloud('FloodRoute AI voice guidance is ready. We will guide you along safe routes away from floodwaters.');
    showToast('info', 'Voice Guidance', 'Playing audio instructions.');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* ==================================================== */}
      {/* 1. USER NAME & PROFILE CARD                          */}
      {/* ==================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg">
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {user?.name || 'Citizen User'}
            </h1>
            <p className="text-sm text-slate-400">
              {user?.email || 'citizen@floodroute.ai'}
            </p>
          </div>
        </div>

        {user ? (
          <button
            onClick={logout}
            className="h-14 px-6 rounded-2xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-center"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="h-14 px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base flex items-center justify-center gap-2 transition-all self-start sm:self-center shadow-md"
          >
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* ==================================================== */}
      {/* 2. SAVED PLACES                                      */}
      {/* ==================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-400" />
            <h2 className="font-heading font-extrabold text-xl text-white">
              Saved Places
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {savedPlaces.map((place) => (
            <div
              key={place.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-bold text-base text-white">{place.name}</div>
                <div className="text-xs text-slate-400">{place.address}</div>
              </div>
              <button
                onClick={() => navigate(`/route-planner?to=${encodeURIComponent(place.address)}`)}
                className="h-12 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>Go Here</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. MY REPORTS                                        */}
      {/* ==================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <h2 className="font-heading font-extrabold text-xl text-white">
            My Reports
          </h2>
        </div>

        <div className="space-y-3">
          {myReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-bold text-base text-white">{rep.hazard}</div>
                <div className="text-xs text-slate-400">{rep.location} • {rep.time}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. SETTINGS, LANGUAGE & ACCESSIBILITY                */}
      {/* ==================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Settings className="w-6 h-6 text-sky-400" />
          <h2 className="font-heading font-extrabold text-xl text-white">
            Settings & Accessibility
          </h2>
        </div>

        {/* Language Selection: English, Tamil, Hindi, Telugu */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Languages className="w-4 h-4 text-sky-400" />
            <span>App Language</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  showToast('success', 'Language Changed', `Set language to ${l.native}`);
                }}
                className={`h-14 rounded-2xl border-2 font-bold text-sm flex flex-col items-center justify-center transition-all ${
                  locale === l.code
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{l.native}</span>
                <span className="text-[10px] text-slate-500">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Toggles (Elderly & First-time user friendly) */}
        <div className="space-y-3 pt-2">
          {/* Large Font Option */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-bold text-sm text-white">Large Font Option</div>
                <div className="text-xs text-slate-400">Makes text larger and easier to read</div>
              </div>
            </div>
            <button
              onClick={toggleLargeText}
              className={`h-11 px-5 rounded-xl font-bold text-xs transition-all ${
                largeText ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {largeText ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-sm text-white">High Contrast Mode</div>
                <div className="text-xs text-slate-400">Crisp high visibility borders for sunlight</div>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`h-11 px-5 rounded-xl font-bold text-xs transition-all ${
                highContrast ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice Guidance */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-sm text-white">Voice Guidance</div>
                <div className="text-xs text-slate-400">Speaks flood warnings and turns aloud</div>
              </div>
            </div>
            <button
              onClick={handleTestVoice}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
            >
              {isSpeaking ? 'Speaking...' : 'Test Voice'}
            </button>
          </div>

          {/* Dark Mode */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-bold text-sm text-white">Dark Mode</div>
                <div className="text-xs text-slate-400">Reduces glare during heavy rain and night</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
