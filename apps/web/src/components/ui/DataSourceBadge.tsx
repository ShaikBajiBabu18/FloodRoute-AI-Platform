import React from 'react';
import { Database, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface DataSourceBadgeProps {
  source: string;
  dataType: string;
  updatedAt?: string;
  status?: 'LIVE' | 'STALE' | 'UNAVAILABLE' | 'DEMO';
  isDemo?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  source,
  dataType,
  updatedAt,
  status = 'LIVE',
  isDemo = false,
}) => {
  const effectiveStatus = isDemo ? 'DEMO' : status;

  const statusColors = {
    LIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    STALE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    UNAVAILABLE: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    DEMO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 font-mono">
      <div className="flex items-center gap-1 text-slate-300">
        <Database className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200">Source:</span>
        <span className="truncate max-w-[160px]">{source}</span>
      </div>

      <div className="hidden sm:inline-block text-slate-600">•</div>

      <div className="flex items-center gap-1">
        <span className="text-slate-400">Type:</span>
        <span className="text-slate-300">{dataType}</span>
      </div>

      {updatedAt && (
        <>
          <div className="hidden sm:inline-block text-slate-600">•</div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Updated: {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </>
      )}

      <div className="ml-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusColors[effectiveStatus]}`}>
          {effectiveStatus === 'DEMO' ? 'DEMO DATA' : effectiveStatus}
        </span>
      </div>
    </div>
  );
};
