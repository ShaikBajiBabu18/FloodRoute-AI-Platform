import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AiAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAiStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAiAnalytics();
      setStats(res.aiStats);
    } catch (err) {
      console.error('Failed to load AI analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Computer Vision & Intelligence Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400">
            OpenCV automated segmentation metrics, water coverage percentages, and vehicle passability models.
          </p>
        </div>

        <button
          onClick={fetchAiStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh AI Telemetry</span>
        </button>
      </div>

      {stats && (
        <div className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Analyzed</span>
              <div className="text-2xl font-black text-white">{stats.totalAnalyzed}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 block uppercase">Flood Detected</span>
              <div className="text-2xl font-black text-emerald-400">{stats.floodDetected}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">No Inundation</span>
              <div className="text-2xl font-black text-slate-300">{stats.notFlood}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-rose-400 block uppercase">High / Critical</span>
              <div className="text-2xl font-black text-rose-400">{stats.highSeverity}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 block uppercase">Medium Severity</span>
              <div className="text-2xl font-black text-amber-400">{stats.mediumSeverity}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase">Low Severity</span>
              <div className="text-2xl font-black text-cyan-400">{stats.lowSeverity}</div>
            </div>

            <div className="admin-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 block uppercase">Avg Confidence</span>
              <div className="text-2xl font-black text-blue-400">{stats.averageConfidence}%</div>
            </div>
          </div>

          {/* Vision Pipeline Architecture Card */}
          <div className="admin-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Active Vision Pipeline Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white">Color Space HSV Banding</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Extracts silted muddy water corridors and reflective standing surface pooling across the lower 65% of the vehicle ground plane.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white">Laplacian Variance Filter</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Evaluates high-frequency asphalt textures versus low-variance smooth specular water surfaces to eliminate dry shadow false positives.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-white">Axle Clearance Heuristic</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Maps coverage ratios (&gt;35% partially submerged, &gt;55% completely submerged) into discrete vehicle passability advisories.
                </p>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-500 italic pt-2 border-t border-slate-800">
              Statutory Disclaimer: AI-assisted estimate. Not an official disaster determination. Used strictly as a triage accelerator for disaster analysts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
