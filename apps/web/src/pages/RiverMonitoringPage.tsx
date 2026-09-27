import React, { useState, useEffect } from 'react';
import { RiverStation } from '@floodroute/shared';
import { API_BASE } from '../services/api';
import { Waves, TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, RefreshCw, Gauge, MapPin } from 'lucide-react';

export const RiverMonitoringPage: React.FC = () => {
  const [stations, setStations] = useState<RiverStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<string>('ALL');

  useEffect(() => {
    fetch(`${API_BASE}/rivers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stations) setStations(data.stations);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredStations = filterState === 'ALL'
    ? stations
    : stations.filter((s) => s.state.toLowerCase().includes(filterState.toLowerCase()));

  const getStatusBadge = (status: string): React.ReactElement => {
    if (status === 'DANGER') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">DANGER LEVEL BREACHED</span>;
    }
    if (status === 'WARNING') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">WARNING STAGE</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">NORMAL LEVEL</span>;
  };

  const getTrendIcon = (trend: string): React.ReactElement => {
    if (trend === 'RISING') {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-bold text-xs">
          <TrendingUp className="w-4 h-4" /> Rising
        </span>
      );
    }
    if (trend === 'FALLING') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
          <TrendingDown className="w-4 h-4" /> Falling
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-cyan-400 font-bold text-xs">
        <Minus className="w-4 h-4" /> Steady
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Waves className="w-4 h-4" />
            Central Water Commission (CWC) • Hydro-Meteorological Ingestion Grid
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            Live River Basin & Discharge Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time stage heights, discharge rates, danger levels and hydrological trends across India.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-3">
          <select
            value={filterState}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterState(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All River Basins</option>
            <option value="Tamil Nadu">Tamil Nadu (Adyar / Cooum)</option>
            <option value="Maharashtra">Maharashtra (Mithi)</option>
            <option value="Assam">Assam (Brahmaputra)</option>
            <option value="Bihar">Bihar (Ganga)</option>
            <option value="Delhi">Delhi (Yamuna)</option>
            <option value="Kerala">Kerala (Periyar)</option>
          </select>
        </div>
      </div>

      {/* Grid of River Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading river gauging telemetry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => {
            const dangerRatio = (station.currentLevelM / station.dangerLevelM) * 100;
            const isDanger = station.status === 'DANGER';

            return (
              <div
                key={station.id}
                className={`rounded-2xl p-6 bg-slate-900/80 backdrop-blur-xl border transition-all hover:border-cyan-500/50 shadow-xl space-y-5 ${
                  isDanger ? 'border-rose-500/60 shadow-rose-500/10' : 'border-slate-800'
                }`}
              >
                {/* Station Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">{station.riverName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {station.station}
                    </p>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {station.district}, {station.state}
                    </span>
                  </div>
                  {getStatusBadge(station.status)}
                </div>

                {/* Gauge Level Progress */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Current Gauge Level:</span>
                    <span className="text-2xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                      {station.currentLevelM.toFixed(2)} m
                    </span>
                  </div>

                  {/* Level Gauge Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDanger
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                          : dangerRatio > 85
                          ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(100, dangerRatio)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Warn: <strong>{station.warningLevelM}m</strong></span>
                    <span className="text-rose-400">Danger: <strong>{station.dangerLevelM}m</strong></span>
                    <span>HFL: <strong>{station.hflLevelM}m</strong></span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50">
                    <div className="text-slate-400 text-[10px] uppercase">Trend Direction</div>
                    <div className="mt-1">{getTrendIcon(station.trend)}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50">
                    <div className="text-slate-400 text-[10px] uppercase">Discharge Volume</div>
                    <div className="text-slate-100 font-bold font-mono mt-1">
                      {station.dischargeCusecs.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">cusecs</span>
                    </div>
                  </div>
                </div>

                {/* Footer timestamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                  <span>Source: CWC Basin Division</span>
                  <span>{new Date(station.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
