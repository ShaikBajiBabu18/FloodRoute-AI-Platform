import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Shield,
  Heart,
  Bell,
  Award,
  CheckCircle2,
  Sparkles,
  Navigation,
  AlertTriangle,
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [savedLocations, setSavedLocations] = useState<any[]>([
    { id: 'loc-1', name: 'Home Residence', locationName: 'Velachery Bypass Road, Chennai', latitude: 12.978, longitude: 80.2207, currentRisk: 'Critical (88/100)' },
    { id: 'loc-2', name: 'Work / Office', locationName: 'Tidel Park, Tharamani, Chennai', latitude: 12.9892, longitude: 80.2483, currentRisk: 'Safe (14/100)' },
    { id: 'loc-3', name: 'Parents House', locationName: 'T. Nagar Ranganathan St, Chennai', latitude: 13.042, longitude: 80.251, currentRisk: 'High (76/100)' },
  ]);

  const [userReports, setUserReports] = useState<any[]>([
    { id: 'rep-1', code: 'FR-2026-000186', location: 'T. Nagar Ranganathan St', date: 'Today, 10:45 AM', severity: 'HIGH', status: 'VERIFIED', water: 'DIFFICULT_CARS' },
    { id: 'rep-2', code: 'FR-2026-000042', location: 'Velachery 100 Feet Main Rd', date: 'Yesterday, 04:20 PM', severity: 'CRITICAL', status: 'RESOLVED', water: 'IMPASSABLE' },
  ]);

  const [recentAlerts, setRecentAlerts] = useState<any[]>([
    { id: 'alt-1', title: 'Adyar River Catchment Zone Flash Inundation', severity: 'RED', time: '1 hr ago', district: 'Chennai' },
    { id: 'alt-2', title: 'High Tide Storm Surge Warning', severity: 'ORANGE', time: '3 hrs ago', district: 'Coastal Tamil Nadu' },
  ]);

  const badges = [
    { title: 'First Responder', desc: 'Logged first verified flood report', icon: '🛡️', earned: true },
    { title: 'Flood Scout', desc: '5+ ground photos processed by AI', icon: '📸', earned: true },
    { title: 'Verified Sentinel', desc: '100% verification accuracy record', icon: '⭐', earned: true },
    { title: 'Route Pioneer', desc: 'Contributed to emergency bypass routes', icon: '🧭', earned: true },
    { title: 'Lifeline Hero', desc: 'Assisted 50+ commuters with bypasses', icon: '🏆', earned: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* ==================================================== */}
      {/* 1. HERO PROFILE CARD */}
      {/* ==================================================== */}
      <div className="glass-card-elevated p-8 rounded-[28px] border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-blue-600 flex items-center justify-center font-heading font-extrabold text-3xl text-white shadow-xl shadow-cyan-500/25 border-2 border-cyan-400">
                {user ? user.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px]">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading font-extrabold text-2xl text-white">
                  {user?.name || 'Rohan Verma'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  LEVEL 4 SENTINEL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {user?.email || 'citizen@floodroute.ai'} • Citizen Responder ID: FR-IND-8831
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Citizen Sentinel
                </span>
                <span>•</span>
                <span className="text-slate-400">Active in Chennai District</span>
              </div>
            </div>
          </div>

          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold transition-colors flex items-center gap-2 self-start"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* Contribution Level Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Disaster Contribution Progress:</span>
            <span className="text-cyan-400 font-mono font-bold">840 / 1000 XP to Tier 5 Master Sentinel</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 w-[84%]" />
          </div>
        </div>

        {/* Top 4 Contribution Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Reports Submitted', val: '8', icon: FileText, color: 'text-cyan-400' },
            { label: 'Verified by Police/NDRF', val: '7', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Commuters Rerouted', val: '1,420', icon: Navigation, color: 'text-sky-400' },
            { label: 'Community Upvotes', val: '94', icon: Heart, color: 'text-rose-400' },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{st.label}</span>
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
                <div className="font-heading font-extrabold text-2xl text-white">{st.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. BADGES & CONTRIBUTION LEVEL */}
      {/* ==================================================== */}
      <div className="glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Earned Citizen Badges & Recognition
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border text-center space-y-1.5 transition-all ${
                b.earned
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="font-heading font-bold text-xs text-white">{b.title}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{b.desc}</div>
              {b.earned ? (
                <span className="inline-block text-[9px] font-mono font-bold text-emerald-400 uppercase pt-1">
                  ✓ Unlocked
                </span>
              ) : (
                <span className="inline-block text-[9px] font-mono text-slate-500 uppercase pt-1">
                  Locked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. SAVED LOCATIONS & MY REPORTS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Saved Locations Card */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Saved Places & Risk Status
            </h3>
            <span className="text-xs font-mono text-slate-400">1-Click Transit</span>
          </div>

          <div className="space-y-3">
            {savedLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-white">{loc.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      loc.currentRisk.includes('Critical') ? 'bg-rose-500/20 text-rose-400' :
                      loc.currentRisk.includes('High') ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {loc.currentRisk}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{loc.locationName}</div>
                </div>

                <Link
                  to={`/route-planner?destLat=${loc.latitude}&destLng=${loc.longitude}&destName=${encodeURIComponent(loc.name)}`}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-700 transition-colors"
                  title="Plan Safe Route to This Location"
                >
                  <Navigation className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Submitted */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              My Submitted Flood Reports
            </h3>
            <Link to="/report-hazard" className="text-xs font-semibold text-cyan-400 hover:underline">
              + Report Hazard
            </Link>
          </div>

          <div className="space-y-3">
            {userReports.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{r.location}</span>
                  <span className="font-mono text-[10px] text-cyan-400">{r.code}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Logged: {r.date}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. RECENT ALERTS FOR USER DISTRICT */}
      {/* ==================================================== */}
      <div className="glass-panel p-6 rounded-[24px] border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400" />
          Recent Official Alerts In Your Registered District
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentAlerts.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400">
                    {a.severity} BULLETIN
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{a.time}</span>
                </div>
                <h4 className="font-heading font-bold text-xs text-white leading-snug">{a.title}</h4>
                <div className="text-[11px] text-slate-400">Affected Area: {a.district}</div>
              </div>
              <Link
                to="/disaster-alerts"
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
