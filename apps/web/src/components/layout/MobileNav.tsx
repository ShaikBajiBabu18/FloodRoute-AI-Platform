import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Compass, CloudRain, Bell, PlusCircle } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { label: 'Map', path: '/live-map', icon: MapPin },
    { label: 'Route', path: '/route-planner', icon: Compass },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Alerts', path: '/disaster-alerts', icon: Bell },
    { label: 'Report', path: '/report-hazard', icon: PlusCircle, highlight: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel bg-navy-950/95 border-t border-slate-800/90 px-2 py-1.5 backdrop-blur-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  tab.highlight
                    ? isActive
                      ? 'text-rose-400 font-bold'
                      : 'text-rose-500 font-semibold'
                    : isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg ${
                      tab.highlight
                        ? 'bg-rose-500/20 text-rose-400'
                        : isActive
                        ? 'bg-cyan-500/15'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
