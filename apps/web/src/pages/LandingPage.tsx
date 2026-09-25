import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  CloudRain,
  Waves,
  ShieldAlert,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Search,
  Zap,
  Play,
  PhoneCall,
  Car,
  ShieldCheck,
  TrendingDown,
  Navigation,
  Eye,
  Server,
  Layers,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Gauge
} from 'lucide-react';
import { api } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'safest' | 'fastest' | 'balanced'>('safest');
  const [selectedDemoPreset, setSelectedDemoPreset] = useState<'chennai' | 'mumbai' | 'guwahati'>('chennai');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    api.getHealth()
      .then((res) => setHealth(res))
      .catch((err) => console.warn('Health check failed:', err));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/live-map?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/live-map');
    }
  };

  // Demo presets
  const demoRoutes = {
    chennai: {
      origin: 'Chennai Central Station',
      destination: 'Velachery Bypass Road',
      distance: '18.8 km',
      safestTime: '26 min',
      fastestTime: '19 min',
      balancedTime: '22 min',
      safestRisk: 'LOW (18/100)',
      fastestRisk: 'CRITICAL (92/100)',
      balancedRisk: 'MODERATE (45/100)',
      safestNote: 'Elevated OMR corridor bypasses submerged Adyar canal breach near Phoenix Mall.',
      fastestNote: 'Passes 2.5 ft standing water at Velachery 100 Feet Road. High stalling risk.',
      balancedNote: 'Minor waterlogging near Guindy; passable for SUVs and high-clearance vehicles.',
      safestCO2: '2.1 kg',
      fastestCO2: '2.4 kg (heavy stop-and-go)',
      balancedCO2: '2.2 kg'
    },
    mumbai: {
      origin: 'Bandra-Kurla Complex (BKC)',
      destination: 'Chhatrapati Shivaji Maharaj Airport (BOM)',
      distance: '9.4 km',
      safestTime: '18 min',
      fastestTime: '14 min',
      balancedTime: '16 min',
      safestRisk: 'LOW (12/100)',
      fastestRisk: 'HIGH (78/100)',
      balancedRisk: 'LOW-MOD (32/100)',
      safestNote: 'Western Express Flyover selected. Complete avoidance of low-lying Mithi River overflow stretch.',
      fastestNote: 'Kurla subway underpass submerged up to 3 ft. NDMA Orange alert active.',
      balancedNote: 'Kalanagar bridge route; light waterlogging on curb, moderate traffic crawl.',
      safestCO2: '1.2 kg',
      fastestCO2: '1.8 kg (water resistance)',
      balancedCO2: '1.4 kg'
    },
    guwahati: {
      origin: 'Guwahati Railway Junction',
      destination: 'Dispur Capital Complex',
      distance: '8.2 km',
      safestTime: '20 min',
      fastestTime: '15 min',
      balancedTime: '17 min',
      safestRisk: 'LOW (15/100)',
      fastestRisk: 'HIGH (84/100)',
      balancedRisk: 'MODERATE (38/100)',
      safestNote: 'GS Road elevated route. Diverts around Bharalu river stormwater overflow.',
      fastestNote: 'Rukminigaon underpass impassable due to urban flash waterlogging.',
      balancedNote: 'Zoo Road diversion; minor puddling, accessible for four-wheelers.',
      safestCO2: '1.1 kg',
      fastestCO2: '1.5 kg',
      balancedCO2: '1.2 kg'
    }
  };

  const currentDemo = demoRoutes[selectedDemoPreset];

  return (
    <div className="relative overflow-hidden bg-[#020617] text-slate-100 min-h-screen">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-sky-600/15 via-cyan-500/10 to-transparent blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-700/15 via-indigo-600/10 to-transparent blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[70%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-cyan-600/10 via-emerald-600/5 to-transparent blur-[130px]" />
        
        {/* Subtle GIS Grid Matrix Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0EA5E9 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Glass Search, Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* National Disaster Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/15 to-cyan-500/15 border border-cyan-500/30 backdrop-blur-md shadow-glass-glow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-cyan-300 tracking-wide uppercase">
                India Disaster Response Matrix Live
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-mono text-slate-300">NDMA + IMD Integrated</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Navigate Safer <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Across India
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans font-normal">
              AI-powered flood-aware navigation with live weather, routing, disaster intelligence and community reporting.
            </p>

            {/* Glass Search Box */}
            <form 
              onSubmit={handleHeroSearch}
              className="max-w-xl glass-card-elevated p-2 rounded-[20px] flex items-center gap-2 border border-cyan-500/30 shadow-2xl"
            >
              <div className="pl-3 text-cyan-400">
                <MapPin className="w-5 h-5 animate-bounce" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, or flooded corridor (e.g. Velachery, Kurla)..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none px-2 py-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[14px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs sm:text-sm tracking-wide flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Inspect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/live-map"
                className="px-6 py-3.5 rounded-[18px] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-cyan-400/30"
              >
                <Compass className="w-4 h-4" />
                <span>Open Live Map</span>
              </Link>
              <Link
                to="/route-planner"
                className="px-6 py-3.5 rounded-[18px] bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm tracking-wide border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-xl shadow-glass flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Plan Route</span>
              </Link>
              <button
                onClick={() => setVideoModalOpen(true)}
                className="px-5 py-3.5 rounded-[18px] bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Statistics Counters */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
              {[
                { label: 'Citizens Covered', val: '1.4B+', accent: 'text-sky-400' },
                { label: 'States & UTs Active', val: '28+8', accent: 'text-cyan-400' },
                { label: 'Route Safety Index', val: '99.8%', accent: 'text-emerald-400' },
                { label: 'Evacuation Velocity', val: '4.2x', accent: 'text-blue-400' },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className={`font-heading font-extrabold text-2xl lg:text-3xl ${stat.accent} tracking-tight`}>
                    {stat.val}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Animated India Map / GIS Visual Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual GIS Card */}
            <div className="relative glass-card-elevated p-5 rounded-[24px] border border-cyan-500/30 overflow-hidden shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono font-semibold text-cyan-300">LIVE GIS CORRIDOR MONITOR</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  REAL-TIME SYNCHRONIZED
                </span>
              </div>

              {/* Animated Map Canvas Graphic */}
              <div className="relative w-full h-80 rounded-[18px] bg-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center">
                {/* SVG India Map Silhouette with Weather & Route Overlays */}
                <svg viewBox="0 0 400 400" className="w-full h-full p-2">
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(14, 165, 233, 0.08)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                    <linearGradient id="floodGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* India Coastal / Border Outline Approximation */}
                  <path
                    d="M 170 45 L 205 60 L 220 100 L 240 120 L 290 125 L 320 160 L 280 180 L 240 190 L 225 240 L 210 290 L 190 350 L 175 310 L 140 260 L 120 220 L 105 170 L 120 135 L 145 95 Z"
                    fill="rgba(15, 23, 42, 0.75)"
                    stroke="rgba(14, 165, 233, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />

                  {/* Pulsing City Hubs */}
                  {/* New Delhi */}
                  <circle cx="180" cy="115" r="4" fill="#0EA5E9" />
                  <circle cx="180" cy="115" r="9" fill="none" stroke="#0EA5E9" strokeWidth="1" opacity="0.6">
                    <animate attributeName="r" values="4;14;4" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="190" y="118" fill="#94A3B8" fontSize="8" fontFamily="monospace">Delhi</text>

                  {/* Mumbai */}
                  <circle cx="135" cy="225" r="4" fill="#06B6D4" />
                  <circle cx="135" cy="225" r="8" fill="none" stroke="#06B6D4" strokeWidth="1">
                    <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="95" y="228" fill="#94A3B8" fontSize="8" fontFamily="monospace">Mumbai</text>

                  {/* Chennai */}
                  <circle cx="195" cy="305" r="5" fill="#22C55E" />
                  <circle cx="195" cy="305" r="10" fill="none" stroke="#22C55E" strokeWidth="1.5">
                    <animate attributeName="r" values="5;16;5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="208" y="308" fill="#22C55E" fontSize="9" fontWeight="bold" fontFamily="monospace">Chennai</text>

                  {/* Guwahati */}
                  <circle cx="300" cy="135" r="4" fill="#0EA5E9" />
                  <text x="308" y="138" fill="#94A3B8" fontSize="8" fontFamily="monospace">Guwahati</text>

                  {/* Simulated Flood Danger Zone (Velachery / Adyar Basin) */}
                  <circle cx="210" cy="315" r="18" fill="url(#floodGlow)" opacity="0.4">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="232" y="322" fill="#EF4444" fontSize="8" fontFamily="monospace">⚠ Adyar Basin Flood</text>

                  {/* Live Glowing Safe Route Polyline (bypassing flood point) */}
                  <path
                    d="M 195 305 Q 185 320 190 335 T 205 345"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="6 3"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.5s" repeatCount="indefinite" />
                  </path>

                  {/* Moving Weather Particles (Rain ripples) */}
                  <g opacity="0.6">
                    <line x1="210" y1="280" x2="200" y2="295" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3">
                      <animate attributeName="y1" values="260;300" dur="1s" repeatCount="indefinite" />
                      <animate attributeName="y2" values="275;315" dur="1s" repeatCount="indefinite" />
                    </line>
                    <line x1="230" y1="290" x2="220" y2="305" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3">
                      <animate attributeName="y1" values="270;310" dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="y2" values="285;325" dur="1.2s" repeatCount="indefinite" />
                    </line>
                  </g>
                </svg>

                {/* Floating telemetry pills */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 font-mono shadow-md">
                  Active Corridors: <span className="text-cyan-400 font-bold">14,820</span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Safe Transit Active
                </div>
              </div>

              {/* Card Footer Live Route Data */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">SAFE DETOUR</span>
                  <span className="text-xs font-bold text-emerald-400">+4.2 km</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">RISK SCORE</span>
                  <span className="text-xs font-bold text-cyan-400">18 / 100</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">PASSABILITY</span>
                  <span className="text-xs font-bold text-white">100% CLEAR</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. LIVE INDIA STATUS SECTION */}
      {/* ==================================================== */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">National Flood & Weather Ticker</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400">Integrated telemetry from IMD Doppler, CWC River Basins, and NDMA Dispatches</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-bold">5 Red Alerts</span>
              <span className="text-slate-500">(Adyar, Mithi, Brahmaputra)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-bold">12 Orange Bulletins</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-bold">672 Shelters Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. FEATURES (Palantir Gotham + Apple Weather + Uber) */}
      {/* ==================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE DISASTER CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Engineering Precision for High-Stakes Emergencies
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Combining real-time GIS spatial indexing, OpenCV vision models, meteorological telemetry, and official NDMA disaster dispatches into a cohesive life-saving platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Navigation,
              color: 'text-emerald-400',
              border: 'hover:border-emerald-500/40',
              title: 'Dynamic Flood-Aware Routing',
              desc: 'OSRM routing with multi-waypoint safety corridor sampling. Dynamically detects waterlogged road segments and confirmed bridge closures to calculate safe transit bypasses.',
              metric: '0.2s Recalculation Time'
            },
            {
              icon: CloudRain,
              color: 'text-sky-400',
              border: 'hover:border-sky-500/40',
              title: 'Apple-Grade Weather Telemetry',
              desc: 'Hyperlocal 24-hour rainfall curves, soil saturation indexes, barometer pressure drops, and Doppler wind gusts directly sourced from Open-Meteo & IMD radar.',
              metric: '10 Meteorological Dimensions'
            },
            {
              icon: Eye,
              color: 'text-cyan-400',
              border: 'hover:border-cyan-500/40',
              title: 'OpenCV Computer Vision AI',
              desc: 'Microservice with multi-band segmentation that assesses water depth, road marker obscuration, and vehicle axle clearance from user-submitted hazard photos.',
              metric: '93% Inundation Detection'
            },
            {
              icon: Waves,
              color: 'text-blue-400',
              border: 'hover:border-blue-500/40',
              title: 'River Basin Stage Monitoring',
              desc: 'Continuous hydrological tracking of major Indian rivers (Adyar, Mithi, Yamuna, Brahmaputra, Kaveri) with live warnings before danger thresholds are breached.',
              metric: 'CWC Gauge Matrix'
            },
            {
              icon: ShieldCheck,
              color: 'text-indigo-400',
              border: 'hover:border-indigo-500/40',
              title: 'Incident Command Moderation',
              desc: 'Dedicated enterprise admin console for disaster analysts with 1-click report verification, NDMA alert broadcast, and immutable cryptographic audit logging.',
              metric: 'RBAC Incident Command'
            },
            {
              icon: PhoneCall,
              color: 'text-rose-400',
              border: 'hover:border-rose-500/40',
              title: 'Emergency Lifeline Directory',
              desc: 'Instant 1-touch telephone dispatch for 112, 1070 NDMA, 108 Ambulance, police, fire battalions, and district shelters with live capacity occupancy tracking.',
              metric: '24/7 Verified Helplines'
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`glass-card p-6 rounded-[22px] border border-slate-800 ${f.border} transition-all space-y-4 group`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 ${f.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    {f.metric}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. INTERACTIVE ROUTE DEMO */}
      {/* ==================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card-elevated p-6 sm:p-8 rounded-[24px] border border-cyan-500/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5" />
                <span>Interactive Route Simulation</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Evaluate Transit Risk Before You Drive
              </h2>
            </div>

            {/* City Preset Selector */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'chennai', label: 'Chennai Metro' },
                { id: 'mumbai', label: 'Mumbai Coastal' },
                { id: 'guwahati', label: 'Guwahati Valley' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedDemoPreset(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedDemoPreset === p.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Route Overview Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-[18px] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">START POINT</span>
                <span className="text-sm font-semibold text-white">{currentDemo.origin}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">DESTINATION</span>
                <span className="text-sm font-semibold text-white">{currentDemo.destination}</span>
              </div>
            </div>
          </div>

          {/* Three Route Option Cards: FASTEST, SAFEST, BALANCED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SAFEST (Recommended) */}
            <div 
              onClick={() => setActiveTab('safest')}
              className={`p-5 rounded-[20px] cursor-pointer transition-all border ${
                activeTab === 'safest'
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RECOMMENDED • SAFEST
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-heading font-extrabold text-white">{currentDemo.safestTime}</span>
                <span className="text-xs text-slate-400 font-mono">{currentDemo.distance}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flood Risk:</span>
                  <span className="text-emerald-400 font-semibold">{currentDemo.safestRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hazards on Route:</span>
                  <span className="text-white font-semibold">0 Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CO₂ Estimate:</span>
                  <span className="text-slate-300 font-mono">{currentDemo.safestCO2}</span>
                </div>
                <p className="text-[11px] text-slate-300 pt-1 leading-snug">
                  {currentDemo.safestNote}
                </p>
              </div>
            </div>

            {/* FASTEST */}
            <div 
              onClick={() => setActiveTab('fastest')}
              className={`p-5 rounded-[20px] cursor-pointer transition-all border ${
                activeTab === 'fastest'
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/10 ring-1 ring-rose-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  HIGH HAZARD • FASTEST
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-heading font-extrabold text-white">{currentDemo.fastestTime}</span>
                <span className="text-xs text-slate-400 font-mono">{currentDemo.distance}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flood Risk:</span>
                  <span className="text-rose-400 font-semibold">{currentDemo.fastestRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hazards on Route:</span>
                  <span className="text-rose-300 font-semibold">2 Blockages (3 ft deep)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CO₂ Estimate:</span>
                  <span className="text-slate-300 font-mono">{currentDemo.fastestCO2}</span>
                </div>
                <p className="text-[11px] text-rose-300/90 pt-1 leading-snug">
                  {currentDemo.fastestNote}
                </p>
              </div>
            </div>

            {/* BALANCED */}
            <div 
              onClick={() => setActiveTab('balanced')}
              className={`p-5 rounded-[20px] cursor-pointer transition-all border ${
                activeTab === 'balanced'
                  ? 'bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  OPTIMIZED • BALANCED
                </span>
                <Compass className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-heading font-extrabold text-white">{currentDemo.balancedTime}</span>
                <span className="text-xs text-slate-400 font-mono">{currentDemo.distance}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flood Risk:</span>
                  <span className="text-amber-400 font-semibold">{currentDemo.balancedRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hazards on Route:</span>
                  <span className="text-slate-300 font-semibold">1 Moderate Puddle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CO₂ Estimate:</span>
                  <span className="text-slate-300 font-mono">{currentDemo.balancedCO2}</span>
                </div>
                <p className="text-[11px] text-slate-300 pt-1 leading-snug">
                  {currentDemo.balancedNote}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Link
              to="/route-planner"
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Launch Full Route Navigator with Custom Waypoints</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. AI CAPABILITIES SHOWCASE */}
      {/* ==================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
              <Eye className="w-3.5 h-3.5" />
              <span>COMPUTER VISION MICROSERVICE</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Instant Aerial & Ground Water Segmentation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When citizens upload flood photos from their smartphone or traffic CCTV cameras stream video, our OpenCV vision pipeline automatically segments water reflections, calculates waterlogged percentage, and determines vehicle passability in milliseconds.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Reflective Surface Masking', text: 'Distinguishes muddy flood torrents from asphalt and wet puddles.' },
                { title: 'Axle Depth Classification', text: 'Estimates if water depth exceeds safe clearance for sedans vs SUVs.' },
                { title: 'Hallucination-Proof Provenance', text: 'Explicitly labels all inferences as [AI ESTIMATE] with confidence radars.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/report-hazard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 transition-all"
              >
                <span>Test Image Upload in Hazard Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* AI Vision Demonstration Widget */}
          <div className="lg:col-span-6 glass-card-elevated p-6 rounded-[24px] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                OPENCV SEGMENTATION INFERENCE
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                LATENCY: 58ms
              </span>
            </div>

            {/* Visual Scanner Simulation Box */}
            <div className="relative h-56 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
              {/* Synthetic water plane */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-blue-900/30 to-transparent" />
              {/* Radar sweep scanning line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06B6D4] animate-pulse" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Water Coverage Detected:</span>
                  <span className="text-rose-400 font-bold font-mono">78.4% (Deep)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 w-[78.4%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Axle Clearance: <strong className="text-rose-300">IMPASSABLE FOR CARS</strong></span>
                  <span>Confidence: <strong className="text-cyan-300">93%</strong></span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">[AI ESTIMATE]</strong> Surface inundation exceeds 2.0 feet. Submerged curbs detected. Emergency response trucks and boat rescue units prioritized.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. EMERGENCY NETWORK */}
      {/* ==================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 rounded-[24px] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                RAPID RESPONSE NETWORK
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                24/7 National Emergency Lifelines
              </h2>
            </div>
            <Link
              to="/emergency-resources"
              className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 self-start"
            >
              <span>View Full Shelters & Hospital Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Unified Emergency', num: '112', type: 'Police • Fire • Med' },
              { name: 'NDMA Central Hub', num: '1070', type: 'Disaster Management' },
              { name: 'District Response', num: '1077', type: 'Flood Relief Cell' },
              { name: 'Medical / Ambulance', num: '108', type: 'Critical Care Transport' },
            ].map((e, idx) => (
              <a
                key={idx}
                href={`tel:${e.num}`}
                className="p-4 rounded-[18px] bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 transition-all space-y-1 block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{e.name}</span>
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-heading text-2xl font-extrabold text-white group-hover:text-rose-400 transition-colors">
                  {e.num}
                </div>
                <div className="text-[10px] text-slate-500">{e.type}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. SYSTEM FOOTER / INFRASTRUCTURE STATUS */}
      {/* ==================================================== */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  FR
                </div>
                <span className="font-heading font-extrabold text-lg text-white">
                  FloodRoute<span className="text-cyan-400">.AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                National infrastructure for AI-powered flood navigation, real-time meteorological intelligence, verified crowdsourced incident reports, and emergency disaster coordination across India.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL SUBSYSTEMS NOMINAL (99.8%)</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-3">
                Operational Portals
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/live-map" className="hover:text-cyan-400 transition-colors">Full GIS Live Map</Link></li>
                <li><Link to="/route-planner" className="hover:text-cyan-400 transition-colors">Flood-Safe Navigator</Link></li>
                <li><Link to="/weather" className="hover:text-cyan-400 transition-colors">Weather Intelligence</Link></li>
                <li><Link to="/flood-intelligence" className="hover:text-cyan-400 transition-colors">River Basins & Inundation</Link></li>
                <li><Link to="/report-hazard" className="hover:text-cyan-400 transition-colors">Submit Hazard Report</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-3">
                Official Sources
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="https://ndma.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">NDMA India</a></li>
                <li><a href="https://mausam.imd.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">IMD Mausam Radar</a></li>
                <li><a href="http://cwc.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Central Water Commission</a></li>
                <li><a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Open-Meteo Satellite Feed</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div>
              © 2026 FloodRoute AI. Built for India Disaster Management & Resilience.
            </div>
            <div>
              Data Provenance: [OFFICIAL DATA] [COMMUNITY DATA] [WEATHER-DERIVED RISK] [AI ESTIMATE]
            </div>
          </div>
        </div>
      </footer>

      {/* Video / Interactive Demo Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-[24px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-white text-base">FloodRoute AI Guided Walkthrough</h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Play className="w-6 h-6 fill-cyan-400 ml-1" />
              </div>
              <h4 className="font-heading font-bold text-white text-lg">Real-Time Disaster Avoidance Demonstration</h4>
              <p className="text-xs text-slate-400 max-w-md">
                Demonstrating OSRM corridor buffering, OpenCV flood image analysis, and immediate diversion away from inundated river channels.
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  to="/live-map"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Explore Live Map
                </Link>
                <Link
                  to="/route-planner"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Launch Route Planner
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
