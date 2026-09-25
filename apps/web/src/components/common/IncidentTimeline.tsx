import React from 'react';
import { CheckCircle2, Clock, Bot, ShieldCheck, AlertCircle } from 'lucide-react';

interface IncidentTimelineProps {
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';
  createdAt: string;
  hasAiAnalysis?: boolean;
  verifiedAt?: string;
  resolvedAt?: string;
  verifiedBy?: string;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  status,
  createdAt,
  hasAiAnalysis = true,
  verifiedAt,
  resolvedAt,
  verifiedBy,
}) => {
  const steps = [
    {
      title: 'Report Created by Citizen',
      subtitle: 'Geotagged submission and photo uploaded',
      time: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDone: true,
      icon: Clock,
      color: 'text-cyan-400 border-cyan-400 bg-cyan-950',
    },
    {
      title: 'AI Computer Vision Analyzed',
      subtitle: hasAiAnalysis ? 'Water segmentation and severity classified' : 'Pending AI inference',
      time: hasAiAnalysis ? '+1.2s' : 'Waiting',
      isDone: hasAiAnalysis,
      icon: Bot,
      color: hasAiAnalysis ? 'text-sky-400 border-sky-400 bg-sky-950' : 'text-slate-600 border-slate-700 bg-slate-900',
    },
    {
      title: 'NDRF Moderator Review',
      subtitle:
        status === 'PENDING'
          ? 'Queued for emergency officer triage'
          : `Reviewed by ${verifiedBy || 'Disaster Analyst'}`,
      time: status !== 'PENDING' ? '+4 min' : 'In queue',
      isDone: status !== 'PENDING',
      icon: ShieldCheck,
      color: status !== 'PENDING' ? 'text-amber-400 border-amber-400 bg-amber-950' : 'text-slate-600 border-slate-700 bg-slate-900',
    },
    {
      title: 'Status Verified & Public Broadcast',
      subtitle: status === 'VERIFIED' || status === 'RESOLVED' ? 'Active hazard warning live on GIS grid' : 'Awaiting confirmation',
      time: verifiedAt ? new Date(verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
      isDone: status === 'VERIFIED' || status === 'RESOLVED',
      icon: CheckCircle2,
      color: status === 'VERIFIED' || status === 'RESOLVED' ? 'text-emerald-400 border-emerald-400 bg-emerald-950' : 'text-slate-600 border-slate-700 bg-slate-900',
    },
    {
      title: 'Incident Resolved & Water Receded',
      subtitle: status === 'RESOLVED' ? 'Municipal pump drainage complete. Route reopened.' : 'Active monitoring',
      time: resolvedAt ? new Date(resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing',
      isDone: status === 'RESOLVED',
      icon: CheckCircle2,
      color: status === 'RESOLVED' ? 'text-emerald-400 border-emerald-400 bg-emerald-950' : 'text-slate-600 border-slate-700 bg-slate-900',
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 font-mono">
        Incident Verification Timeline
      </h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="relative flex items-start justify-between gap-4 text-xs">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${st.color}`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>
              <div className="space-y-0.5">
                <div className={`font-bold ${st.isDone ? 'text-white' : 'text-slate-500'}`}>{st.title}</div>
                <div className="text-[11px] text-slate-400">{st.subtitle}</div>
              </div>
              <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap">{st.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
