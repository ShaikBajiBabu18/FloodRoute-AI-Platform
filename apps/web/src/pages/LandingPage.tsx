import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Compass,
  CloudRain,
  ShieldAlert,
  Bell,
  HeartHandshake,
  ArrowRight,
  PhoneCall,
  Search,
  Navigation,
  CheckCircle,
  Home,
  ShieldCheck,
  Droplets,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { NationalCommandDashboard } from '../components/common/NationalCommandDashboard';
import { OneClickJudgeDemo } from '../components/common/OneClickJudgeDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [destinationQuery, setDestinationQuery] = useState('');
  const [showJudgeDemo, setShowJudgeDemo] = useState(false);
  const { setOpenSosModal } = useAccessibility();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationQuery.trim()) {
      navigate(`/route-planner?to=${encodeURIComponent(destinationQuery.trim())}`);
    } else {
      navigate('/live-map');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between">
      {/* 8-Step Interactive Judge Demonstration Modal */}
      <OneClickJudgeDemo isOpen={showJudgeDemo} onClose={() => setShowJudgeDemo(false)} />

      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-sky-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-16">
        {/* ==================================================== */}
        {/* HERO SECTION                                         */}
        {/* ==================================================== */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs sm:text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Active India Flood Safety Network • Live Telemetry</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Travel Safely <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              During Floods
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Find safe routes, check weather, and get emergency help anywhere in India.
          </p>

          {/* Large Friendly Search Bar (56px+ height) */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto p-2 sm:p-2.5 rounded-3xl bg-slate-900/90 border-2 border-sky-500/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 w-full pl-4 py-2">
              <MapPin className="w-6 h-6 text-sky-400 shrink-0" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder-slate-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base flex items-center justify-center gap-2 shrink-0 transition-all shadow-lg shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Search</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Action Buttons: Judge Demo + Map + Route + SOS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setShowJudgeDemo(true)}
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] ring-4 ring-cyan-500/20"
            >
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>Run Flood Risk Analysis</span>
            </button>

            <Link
              to="/live-map"
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg border-2 border-slate-700 hover:border-sky-500/60 flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-xl">🗺</span>
              <span>Open Live Map</span>
            </Link>

            <Link
              to="/route-planner"
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg border-2 border-slate-700 hover:border-sky-500/60 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-xl">🚗</span>
              <span>Find Safe Route</span>
            </Link>

            <button
              onClick={() => setOpenSosModal(true)}
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-rose-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-xl">🚨</span>
              <span>Emergency Help</span>
            </button>
          </div>
        </section>

        {/* ==================================================== */}
        {/* NATIONAL COMMAND DASHBOARD (REQUIREMENT 1)           */}
        {/* ==================================================== */}
        <section className="pt-2">
          <NationalCommandDashboard onTriggerJudgeDemo={() => setShowJudgeDemo(true)} />
        </section>

        {/* ==================================================== */}
        {/* BELOW: EXACTLY 4 CLEAN CARDS                         */}
        {/* 1. Current Weather                                   */}
        {/* 2. Flood Risk                                        */}
        {/* 3. Nearby Alerts                                     */}
        {/* 4. Nearest Shelter                                   */}
        {/* ==================================================== */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading font-extrabold text-2xl text-white">
              Live Area Status
            </h2>
            <p className="text-sm text-slate-400 mt-1">Tap any card to view details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Current Weather */}
            <Link
              to="/weather"
              className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 shadow-lg transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Current Weather</span>
                <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20">
                  <CloudRain className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-4xl text-white">29°C</div>
                <div className="text-sm font-semibold text-slate-300 mt-1">Moderate Showers</div>
                <p className="text-xs text-slate-400 mt-1">Chennai Central • 78% Humidity</p>
              </div>
              <div className="text-xs font-bold text-sky-400 flex items-center gap-1">
                <span>View Full Forecast</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Flood Risk */}
            <Link
              to="/route-planner"
              className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-lg transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Flood Risk</span>
                <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-3xl text-emerald-400">Low Risk</div>
                <div className="text-sm font-semibold text-slate-300 mt-1">Elevated roads open</div>
                <p className="text-xs text-slate-400 mt-1">Highways clear of standing water</p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Find Safe Roads</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Nearby Alerts */}
            <Link
              to="/disaster-alerts"
              className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 shadow-lg transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Nearby Alerts</span>
                <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                  <Bell className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-3xl text-amber-400">2 Active</div>
                <div className="text-sm font-semibold text-slate-300 mt-1">Orange Weather Watch</div>
                <p className="text-xs text-slate-400 mt-1">Waterlogging at 2 underpasses</p>
              </div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>Read Official Warnings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Nearest Shelter */}
            <Link
              to="/emergency-resources"
              className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 shadow-lg transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Nearest Shelter</span>
                <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                  <Home className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-white">Community Hall</div>
                <div className="text-sm font-semibold text-slate-300 mt-1">1.2 km away</div>
                <p className="text-xs text-slate-400 mt-1">Food, water, and power available</p>
              </div>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                <span>Get Directions & Help</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Clean, Simple Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FloodRoute AI • Designed for India</p>
          <div className="flex items-center gap-4">
            <Link to="/emergency-resources" className="text-slate-400 hover:text-white">Emergency Helplines</Link>
            <Link to="/report-hazard" className="text-slate-400 hover:text-white">Report Waterlogging</Link>
            <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-sky-400">
              Admin Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
