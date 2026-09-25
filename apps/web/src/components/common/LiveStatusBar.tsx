import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useI18n } from '../../context/I18nContext';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, ShieldCheck, Cpu, Volume2, Sparkles, PhoneCall } from 'lucide-react';

export const LiveStatusBar: React.FC = () => {
  const { isConnected } = useSocket();
  const { isOffline, queuedReports, setOpenSosModal, setOpenDemoModal, readAloud } = useAccessibility();
  const { locale, setLocale, t } = useI18n();

  const [activeAlertCount, setActiveAlertCount] = useState<number>(3);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReadAlerts = () => {
    readAloud(
      `FloodRoute AI National Broadcast. Severe monsoon flood warning active for Chennai Velachery Basin and Mumbai Kurla corridor. 3 official disaster advisories in effect. High clearance emergency vehicles only.`
    );
  };

  return (
    <aside aria-label="National System Telemetry Ribbon" className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-cyan-500/20 text-xs px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-lg shadow-black/40">
      {/* Left: System Status Chips */}
      <div className="flex items-center gap-3 overflow-x-auto py-0.5 scrollbar-none text-[11px]">
        {/* Core Connection */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-mono text-slate-300">
            WS: <strong className={isConnected ? 'text-emerald-400' : 'text-rose-400'}>{isConnected ? 'ONLINE' : 'SYNCING'}</strong>
          </span>
        </div>

        {/* Flood Engine */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span className="font-mono text-slate-300">
            ENGINE: <strong className="text-cyan-400">ACTIVE</strong>
          </span>
        </div>

        {/* AI Model */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span className="font-mono text-slate-300">
            AI VISION: <strong className="text-sky-400">FASTAPI 8000</strong>
          </span>
        </div>

        {/* Active Alerts */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>{activeAlertCount} Critical Warnings</span>
        </div>

        {/* Offline Queue Badge if any */}
        {isOffline && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
            <WifiOff className="w-3 h-3 text-rose-400" />
            <span>OFFLINE ({queuedReports.length} queued)</span>
          </div>
        )}
      </div>

      {/* Right: Quick Actions & Language Selector */}
      <div className="flex items-center gap-2">
        {/* Voice Read Alerts */}
        <button
          onClick={handleReadAlerts}
          title="Voice Read Critical Warnings"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/70 hover:bg-sky-900 border border-sky-500/30 text-sky-300 hover:text-white transition-all text-[11px] font-medium"
        >
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Read Alerts</span>
        </button>

        {/* One-Click Hackathon Demo Mode */}
        <button
          onClick={() => setOpenDemoModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-semibold shadow-md shadow-cyan-500/20 text-[11px] transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          <span>Start AI Verse Demo</span>
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={() => setOpenSosModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-md shadow-rose-600/30 transition-all animate-pulse"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>

        {/* Language Selector */}
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as any)}
          aria-label="Language selector"
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-md px-2 py-0.5 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="en">English (EN)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
        </select>
      </div>
    </aside>
  );
};
