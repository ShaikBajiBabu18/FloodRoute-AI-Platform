import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FileCheck2,
  Construction,
  BellRing,
  Sparkles,
  Users,
  ScrollText,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Live Operations Map', path: '/operations-map', icon: Map },
    { label: 'Flood Reports', path: '/reports', icon: FileCheck2 },
    { label: 'Road Conditions', path: '/road-conditions', icon: Construction },
    { label: 'Disaster Alerts', path: '/alerts', icon: BellRing },
    { label: 'AI Analytics', path: '/ai-analytics', icon: Sparkles },
    { label: 'User Directory', path: '/users', icon: Users },
    { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
  ];

  return (
    <aside className="w-64 bg-navy-950 border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
            FR
          </div>
          <div>
            <div className="font-extrabold text-sm text-white tracking-wide">
              FloodRoute <span className="text-cyan-400">OPS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">Command & Control v1.0</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Switch to Citizen App footer link */}
      <div className="p-4 border-t border-slate-800/80">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Public Citizen Portal</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </a>
      </div>
    </aside>
  );
};
