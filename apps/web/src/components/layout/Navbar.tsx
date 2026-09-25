import React, { useState, useRef, useEffect } from 'react';
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
  LogOut,
  PhoneCall,
  Menu,
  X,
  Radio,
  Search,
  Command,
  ChevronDown,
  Layers,
  BarChart3,
  Activity,
  Cpu,
  User,
  Home,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { CommandPalette } from '../ui/CommandPalette';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Typed navigation item interface
  interface NavItem {
    label: string;
    path: string;
    icon: any;
    desc?: string;
    external?: boolean;
  }

  // Primary desktop links
  const primaryNavLinks: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Plan Route', path: '/route-planner', icon: Compass },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Alerts', path: '/disaster-alerts', icon: Bell },
  ];

  // Secondary "More" links
  const moreNavLinks: NavItem[] = [
    { label: 'Flood Intel Heatmap', path: '/flood-intelligence', icon: Waves, desc: 'Explainable flood susceptibility model' },
    { label: 'River Telemetry & CWC', path: '/rivers', icon: Activity, desc: 'Real-time dam & river gauge levels' },
    { label: 'District Operations', path: '/districts', icon: Radio, desc: 'Multi-district command center' },
    { label: 'IoT & Drones Mesh', path: '/iot-architecture', icon: Cpu, desc: 'Hardware sensor mesh telemetry' },
    { label: 'Disaster Analytics', path: '/analytics', icon: BarChart3, desc: 'Historical flood impact & mitigation trends' },
    { label: 'Emergency Resources', path: '/emergency-resources', icon: HeartHandshake, desc: 'Hospitals, shelters & NDRF contacts' },
    { label: 'Admin Command Center', path: 'http://localhost:5174', icon: ShieldCheck, desc: 'Enterprise administration portal', external: true },
  ];

  const isMoreActive = moreNavLinks.some((item) => !item.external && location.pathname === item.path);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#020617]/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
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
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white hover:border-cyan-500/40 text-xs transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search map, routes, weather...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono border border-slate-700 text-slate-400 flex items-center gap-0.5">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Primary Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {primaryNavLinks.map((item) => {
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

              {/* "More" Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isMoreActive || moreDropdownOpen
                      ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>More Intel</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 border-b border-slate-800">
                      Advanced Operations & GIS
                    </div>
                    <div className="py-1 space-y-0.5">
                      {moreNavLinks.map((item) => {
                        const Icon = item.icon;
                        const isLinkActive = !item.external && location.pathname === item.path;

                        if (item.external) {
                          return (
                            <a
                              key={item.path}
                              href={item.path}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setMoreDropdownOpen(false)}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                            >
                              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                                  <span>{item.label}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-500" />
                                </div>
                                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                              </div>
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors group ${
                              isLinkActive ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-slate-800/80'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isLinkActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className={`text-xs font-semibold ${isLinkActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                                {item.label}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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

        {/* Mobile Dropdown Menu (Header expansion) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#020617]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
            <button
              onClick={() => { setCommandPaletteOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs mb-3"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search GIS map, routes, weather... (Ctrl+K)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              {[...primaryNavLinks, ...moreNavLinks].map((item) => {
                const Icon = item.icon;
                const isActive = !item.external && location.pathname === item.path;

                if (item.external) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60"
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </a>
                  );
                }

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

      {/* ==================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (Native App Feel)     */}
      {/* ==================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 safe-area-pb shadow-2xl">
        <div className="flex items-center justify-around">
          {[
            { label: 'Home', path: '/', icon: Home },
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
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-cyan-400 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-500/15' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

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
