import React from 'react';
import { Home, ShieldCheck, Navigation, Users, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface ShelterRecommendationCardProps {
  currentRiskScore: number;
}

export const ShelterRecommendationCard: React.FC<ShelterRecommendationCardProps> = ({ currentRiskScore }) => {
  if (currentRiskScore < 50) return null;

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-xl shadow-emerald-950/40 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-emerald-400">
              AI SHELTER RECOMMENDATION
            </span>
            <h4 className="text-sm font-bold text-white">High-Ground Safe Shelter Identified</h4>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
          ZERO FLOOD EXPOSURE
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="text-sm font-bold text-slate-100">Guru Nanak College Relief Center & Auditorium</h5>
            <p className="text-xs text-slate-400">Velachery Main Rd, Guru Nanak Salai, Chennai (Elevation: 12.8m MSL)</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">1.2 km away</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~6 mins transit</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Capacity: 850 Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dry Ration & Medical</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400">Calculated safe corridor bypassing submerged culverts</span>
        <a
          href="/route-planner?destLat=12.9912&destLng=80.2225&destName=Guru+Nanak+College+Shelter&preferSafer=true"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <span>Navigate to Shelter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
