import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Compass,
  CloudRain,
  Waves,
  Bell,
  HeartHandshake,
  PlusCircle,
  User as UserIcon,
  LogOut,
  PhoneCall,
  Menu,
  X,
  Radio,
  Search,
  Command,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { CommandPalette } from '../ui/CommandPalette';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const navLinks = [
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Safe Routes', path: '/route-planner', icon: Compass },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Flood Intel', path: '/flood-intelligence', icon: Waves },
    { label: 'Rivers', path: '/rivers', icon: Waves },
    { label: 'Districts', path: '/districts', icon: Radio },
    { label: 'India Overview', path: '/national-overview', icon: MapPin },
    { label: 'IoT & Drones', path: '/iot-architecture', icon: Radio },
    { label: 'Alerts', path: '/disaster-alerts', icon: Bell },
    { label: 'Emergency', path: '/emergency-resources', icon: HeartHandshake },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-cyan-500 via-sky-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all border border-cyan-400/30">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    FloodRoute<span className="text-cyan-400">.AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Radio className={`w-2.5 h-2.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                    {isConnected ? 'GRID LIVE' : 'SYNCING'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono -mt-0.5 hidden sm:block">India Disaster Routing Intelligence</p>
              </div>
            </Link>

            {/* Quick Command Palette trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white hover:border-cyan-500/40 text-xs transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search map, routes, weather...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono border border-slate-700 text-slate-400 flex items-center gap-0.5">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Report Hazard + SOS + Profile */}
            <div className="flex items-center gap-2.5">
              {/* Report Button */}
              <Link
                to="/report-hazard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Flood</span>
              </Link>

              {/* SOS Emergency Button */}
              <button
                onClick={() => setSosModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SOS 112</span>
              </button>

              {/* User Dropdown / Auth */}
              {user ? (
                <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition-colors"
                    title="User Profile"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#020617]/95 backdrop-blur-2xl px-4 py-4 space-y-2">
            <button
              onClick={() => { setCommandPaletteOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs mb-3"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search GIS map, routes, weather... (Ctrl+K)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* SOS Emergency Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-[20px] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">National Disaster Helplines</h3>
                  <p className="text-xs text-rose-300">Toll-free emergency dispatch (India)</p>
                </div>
              </div>
              <button
                onClick={() => setSosModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'National Emergency', num: '112', desc: 'All-in-one Police/Fire/Med' },
                { name: 'NDMA Control Room', num: '1070', desc: 'Disaster management' },
                { name: 'District Disaster Hub', num: '1077', desc: 'Local flood response' },
                { name: 'Ambulance / Medical', num: '108', desc: 'Emergency medical services' },
              ].map((h) => (
                <a
                  key={h.num}
                  href={`tel:${h.num}`}
                  className="p-3 rounded-[16px] bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 group-hover:text-white font-medium">{h.name}</span>
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-xl font-heading font-extrabold text-white mt-1 text-rose-300">
                    {h.num}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{h.desc}</div>
                </a>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              If life or property is in immediate danger, please dial <strong className="text-rose-400">112</strong> immediately. The FloodRoute AI network automatically shares verified road inundation telemetry with district response battalions.
            </div>

            <button
              onClick={() => setSosModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Close Helplines
            </button>
          </div>
        </div>
      )}
    </>
  );
};
