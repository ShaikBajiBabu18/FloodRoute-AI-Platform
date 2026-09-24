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
  Lock,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const navLinks = [
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Safe Routes', path: '/route-planner', icon: Compass },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Flood Intel', path: '/flood-intelligence', icon: Waves },
    { label: 'Official Alerts', path: '/disaster-alerts', icon: Bell },
    { label: 'Emergency', path: '/emergency-resources', icon: HeartHandshake },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-navy-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    FloodRoute<span className="text-cyan-400">.AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Radio className={`w-2.5 h-2.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                    {isConnected ? 'GRID LIVE' : 'CONNECTING'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:block">India Disaster Routing Intelligence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Report Hazard Button */}
              <Link
                to="/report-hazard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Report Hazard
              </Link>

              {/* Emergency SOS Button */}
              <button
                onClick={() => setSosModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all"
                title="Immediate Disaster Helplines"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>SOS 112</span>
              </button>

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}

              {/* Separate Admin Portal Link */}
              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noreferrer"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-400/80 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 hover:border-cyan-700 transition-all"
                title="Launch Incident Command Admin Console"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                Admin Portal
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-navy-900 border-b border-slate-800 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/report-hazard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white"
              >
                <PlusCircle className="w-4 h-4" />
                Report Flood Hazard
              </Link>
              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800"
              >
                <Lock className="w-3.5 h-3.5" />
                Open Admin Operations Dashboard
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Emergency Helpline SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSosModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Disaster Helplines</h3>
                <p className="text-xs text-slate-400">Direct Government Disaster Response Channels (India)</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">112</div>
                  <div className="text-xs text-slate-400">National Emergency Integrated Service</div>
                </div>
                <a href="tel:112" className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-sans">
                  Call 112
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">1070</div>
                  <div className="text-xs text-slate-400">NDMA / State Disaster Management Authority</div>
                </div>
                <a href="tel:1070" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold font-sans">
                  Call 1070
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">1077</div>
                  <div className="text-xs text-slate-400">District Disaster Control Room</div>
                </div>
                <a href="tel:1077" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold font-sans">
                  Call 1077
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">108 / 102</div>
                  <div className="text-xs text-slate-400">Ambulance & Emergency Medical Response</div>
                </div>
                <a href="tel:108" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold font-sans">
                  Call 108
                </a>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 text-center">
              FloodRoute AI is an auxiliary navigation aid. In life-threatening emergencies, dial 112 immediately.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
