import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, CheckCircle2, Clock, AlertTriangle, Eye, ThumbsUp } from 'lucide-react';
import { api } from '../services/api';
import { FloodReportItem } from '@floodroute/shared';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFloodReports({ limit: 50 })
      .then((res) => setReports(res.reports || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>My Submitted Flood Reports</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track verification status, moderation notes, and AI computer vision estimates.
          </p>
        </div>

        <Link
          to="/report-hazard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </Link>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-400">{report.reportCode}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-semibold text-white">{report.locationName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    {report.severity}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      report.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

              {report.aiAnalysis && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1 text-[11px]">
                    <span>AI Vision Analysis:</span>
                    <span className="text-white font-normal">{report.aiAnalysis.explanation}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Confidence: {report.aiAnalysis.confidence}% • Road Visibility: {report.aiAnalysis.roadVisibility}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Reported: {new Date(report.reportedAt).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  {report.upvotes || 0} Upvotes
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No reports filed yet</h3>
          <p className="text-xs text-slate-400">When you submit road inundation observations, they will be listed here.</p>
        </div>
      )}
    </div>
  );
};
