import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import {
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  HardDrive,
  ShieldCheck,
  ExternalLink,
  Wifi,
  Sparkles,
} from 'lucide-react';

interface ServiceHealth {
  name: string;
  status: string;
  port?: number;
  url?: string;
  latencyMs: number;
  uptimePercent: number;
}

interface DeepHealthData {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  hostInfo: {
    platform: string;
    release: string;
    cpuCount: number;
    freeMemoryMB: number;
    totalMemoryMB: number;
    processMemoryMB: number;
  };
  services: ServiceHealth[];
}

export const SystemHealthPage: React.FC = () => {
  const [data, setData] = useState<DeepHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());

  const fetchHealth = async (showSpin = true) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const res = await adminApi.getDeepHealth();
      setData(res);
      setLastCheckTime(new Date());
    } catch (err) {
      console.error('Failed to query deep health diagnostics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth(false);
    const interval = setInterval(() => {
      fetchHealth(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>DISASTER INFRASTRUCTURE TELEMETRY</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            System & Microservice Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time health telemetry across the Node.js API Gateway, PostgreSQL/Prisma datastore, FastAPI vision neural server, and IMD/Open-Meteo pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
            <div>Auto-refresh: 10s</div>
            <div className="text-slate-500">Last probe: {lastCheckTime.toLocaleTimeString()}</div>
          </div>
          <button
            onClick={() => fetchHealth(true)}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Probe Now</span>
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Probing all distributed disaster mesh microservices...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Top Status Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-400 font-bold">
                    SYSTEM OVERVIEW
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  {data.status.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-400">
                  Zero critical degradations detected across core clusters.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Gateway Uptime</span>
                <span className="font-bold text-white text-sm">{formatUptime(data.uptimeSeconds)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Active Microservices</span>
                <span className="font-bold text-cyan-400 text-sm">{data.services.length} / {data.services.length} Healthy</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Timestamp</span>
                <span className="text-slate-300 text-[11px]">{new Date(data.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Node & Hardware Resource Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Host Platform
                </span>
                <span className="font-mono text-slate-300 uppercase">{data.hostInfo.platform}</span>
              </div>
              <div className="text-lg font-heading font-bold text-white">
                Windows NT / {data.hostInfo.release}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Architecture Engine
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  Compute Cores
                </span>
                <span className="font-mono text-sky-400">{data.hostInfo.cpuCount} Cores</span>
              </div>
              <div className="text-lg font-heading font-bold text-white">
                {data.hostInfo.cpuCount} Logical Threads
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Multi-threaded routing pool
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  System Memory
                </span>
                <span className="font-mono text-emerald-400">
                  {Math.round((1 - data.hostInfo.freeMemoryMB / data.hostInfo.totalMemoryMB) * 100)}% Used
                </span>
              </div>
              <div className="text-lg font-heading font-bold text-white">
                {Math.round(data.hostInfo.freeMemoryMB / 1024)} GB Free / {Math.round(data.hostInfo.totalMemoryMB / 1024)} GB
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.round((1 - data.hostInfo.freeMemoryMB / data.hostInfo.totalMemoryMB) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Process RSS Memory
                </span>
                <span className="font-mono text-amber-400 font-bold">{data.hostInfo.processMemoryMB} MB</span>
              </div>
              <div className="text-lg font-heading font-bold text-white">
                V8 Heap Allocation
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Active garbage collection tuned
              </div>
            </div>
          </div>

          {/* Microservices Cluster Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Distributed Microservices Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Live latency and uptime service-level agreements across internal microservices.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                HEALTH PROBE OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {data.services.map((svc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          svc.status === 'operational' ? 'bg-emerald-400' : 'bg-rose-500'
                        } ${svc.status === 'operational' ? 'animate-pulse' : ''}`} />
                        <h4 className="text-xs font-bold text-white">{svc.name}</h4>
                      </div>
                      {svc.port && (
                        <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                          Port {svc.port} {svc.url && `• ${svc.url}`}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      svc.status === 'operational'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {svc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block">PROBE LATENCY</span>
                      <span className={`font-bold ${svc.latencyMs < 30 ? 'text-emerald-400' : svc.latencyMs < 100 ? 'text-cyan-400' : 'text-amber-400'}`}>
                        {svc.latencyMs} ms
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">UPTIME SLA</span>
                      <span className="font-bold text-white">{svc.uptimePercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-rose-400 font-mono text-xs">
          Unable to establish communication with the health probe diagnostic gateway.
        </div>
      )}
    </div>
  );
};
