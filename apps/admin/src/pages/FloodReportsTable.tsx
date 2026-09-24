import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Check,
  X,
  CheckCircle2,
  Eye,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { FloodReportItem } from '@floodroute/shared';

export const FloodReportsTable: React.FC = () => {
  const [reports, setReports] = useState<FloodReportItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<FloodReportItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;

      const res = await adminApi.getReports(params);
      setReports(res.reports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, severityFilter]);

  const handleAction = async (id: string, status: string) => {
    try {
      await adminApi.updateReportStatus(id, { status });
      fetchReports();
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <span>Flood Reports Moderation Ledger</span>
          </h1>
          <p className="text-xs text-slate-400">
            Review, verify, and escalate crowdsourced ground observations and AI predictions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-navy-900 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search report code, location, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReports()}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
        >
          <option value="">All Severities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button
          onClick={fetchReports}
          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="admin-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Report Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Hazard Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">AI Vision</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{r.reportCode}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-slate-200">
                    {r.locationName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{r.hazardType.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        r.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300'
                          : r.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.aiAnalysis ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-cyan-400 font-bold">
                        <Sparkles className="w-3 h-3" />
                        {r.aiAnalysis.floodDetected ? 'Flood (' + r.aiAnalysis.confidence + '%)' : 'Clear'}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-[10px]">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        r.status === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : r.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(r.reportedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="View Report Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'VERIFIED')}
                        className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/60"
                        title="Approve Report"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'REJECTED')}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-800/60"
                        title="Reject Report"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'RESOLVED')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        title="Mark Resolved"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Detailed Inspection */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-cyan-400">{selectedReport.reportCode}</span>
              <span className="text-slate-500">•</span>
              <span className="font-bold text-white text-sm">{selectedReport.locationName}</span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {selectedReport.description}
            </p>

            {selectedReport.aiAnalysis && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 space-y-1.5 text-xs">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  AI Vision Telemetry Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>Flood Detected: <strong>{selectedReport.aiAnalysis.floodDetected ? 'YES' : 'NO'}</strong></div>
                  <div>Confidence: <strong>{selectedReport.aiAnalysis.confidence}%</strong></div>
                  <div>Water Coverage: <strong>{selectedReport.aiAnalysis.waterCoveragePercent}%</strong></div>
                  <div>Accessibility: <strong>{selectedReport.aiAnalysis.vehicleAccessibility}</strong></div>
                </div>
                <p className="text-[11px] text-slate-300 pt-1">{selectedReport.aiAnalysis.explanation}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleAction(selectedReport.id, 'VERIFIED')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
              >
                Approve & Broadcast
              </button>
              <button
                onClick={() => handleAction(selectedReport.id, 'REJECTED')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Reject Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
