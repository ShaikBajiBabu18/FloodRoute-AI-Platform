import React from 'react';
import { ShieldCheck, Info, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="font-extrabold text-base text-white flex items-center gap-1.5">
              <span>FloodRoute</span>
              <span className="text-cyan-400">AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              AI-Powered Flood-Aware Route Planning, Weather Intelligence, Community Reporting and Emergency Alert Platform for India.
            </p>
            <div className="text-[11px] text-cyan-400 font-mono">
              Designed for India-wide coverage across urban & rural corridors.
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Official Integrated Sources</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>IMD (India Meteorological Dept)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CWC (Central Water Commission)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NDMA / SACHET Disaster Warnings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>OpenStreetMap & OSRM Routing</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Disaster Advisory</h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 mb-1" />
              All risk assessments and flood predictions are computational estimates based on telemetry, satellite weather, and community reports. Always heed official district administration evacuation mandates.
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Emergency Helplines</h4>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              <div>National Emergency: <span className="text-rose-400 font-bold">112</span></div>
              <div>Disaster Control: <span className="text-cyan-400 font-bold">1070</span></div>
              <div>District Cell: <span className="text-cyan-400 font-bold">1077</span></div>
              <div>Ambulance: <span className="text-emerald-400 font-bold">108</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FloodRoute AI. Built for India Disaster Preparedness & Citizen Safety.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-mono">Demo accounts & simulated conditions marked [DEMO DATA]</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
