import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Compass,
  CloudRain,
  Bell,
  User,
  PhoneCall,
  Languages,
  ShieldAlert,
  ChevronDown,
  X,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { LanguageLocale } from '@floodroute/shared';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { locale, setLocale } = useI18n();
  const { openSosModal, setOpenSosModal } = useAccessibility();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: LanguageLocale; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  ];

  // Maximum 5 clean items per design rule: Live Map, Route, Weather, Alerts, Profile
  const navItems = [
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Route', path: '/route-planner', icon: Compass },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Alerts', path: '/disaster-alerts', icon: Bell },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-all">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white group-hover:text-sky-400 transition-colors">
                  FloodRoute<span className="text-sky-400">.AI</span>
                </span>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">Safe Travel in Floods</p>
              </div>
            </Link>

            {/* Desktop Navigation: Exactly 5 items */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Profile Link (Item #5) */}
              <Link
                to={user ? '/profile' : '/login'}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  location.pathname === '/profile' || location.pathname === '/login'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{user ? user.name : 'Profile'}</span>
              </Link>
            </nav>

            {/* Right side: Language picker + Big Emergency 112 button */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-sky-500 transition-all"
                  title="Change Language"
                >
                  <Languages className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">
                    {languages.find((l) => l.code === locale)?.native || 'English'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLocale(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          locale === l.code ? 'bg-sky-500/20 text-sky-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{l.native}</span>
                        <span className="text-[10px] text-slate-500">{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Help Button (56px minimum standard) */}
              <button
                onClick={() => setOpenSosModal(true)}
                className="h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Call 112</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (Native Easy App Bar)  */}
      {/* ==================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-800 px-3 py-2 shadow-2xl safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { label: 'Map', path: '/live-map', icon: MapPin },
            { label: 'Route', path: '/route-planner', icon: Compass },
            { label: 'Weather', path: '/weather', icon: CloudRain },
            { label: 'Alerts', path: '/disaster-alerts', icon: Bell },
            { label: 'Profile', path: user ? '/profile' : '/login', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-2xl transition-all ${
                  isActive
                    ? 'text-sky-400 font-bold bg-sky-500/15 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-semibold mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* SOS Emergency Modal */}
      {openSosModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <PhoneCall className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-white text-lg">Emergency Help (India)</h3>
                  <p className="text-xs text-rose-300">Toll-free 24/7 Helpline</p>
                </div>
              </div>
              <button
                onClick={() => setOpenSosModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="tel:112"
                className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PhoneCall className="w-6 h-6" />
                <span>Call 112 (All Emergencies)</span>
              </a>

              <a
                href="tel:1070"
                className="w-full h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <Radio className="w-5 h-5 text-sky-400" />
                <span>Call 1070 (Disaster Relief)</span>
              </a>

              <a
                href="tel:108"
                className="w-full h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <span>Call 108 (Ambulance / Medical)</span>
              </a>
            </div>

            <button
              onClick={() => setOpenSosModal(false)}
              className="w-full py-3.5 rounded-2xl bg-slate-950 text-slate-400 hover:text-white text-sm font-semibold border border-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
