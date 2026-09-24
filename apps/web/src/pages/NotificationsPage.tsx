import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { lastEvent } = useSocket();

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch {
      // Fallback mock notifications for citizen demonstration
      setNotifications([
        {
          id: 'notif-1',
          title: 'Flood Report Verified Near Your Saved Location',
          message: 'Velachery 100 Feet Road report FR-2026-000182 has been confirmed by disaster analysts.',
          type: 'ALERT',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'notif-2',
          title: 'Heavy Rainfall Warning Detected',
          message: 'IMD convective storm alert active for your corridor.',
          type: 'ROAD_UPDATE',
          isRead: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (lastEvent) loadNotifications();
  }, [lastEvent]);

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-cyan-400" />
          <span>Real-Time Notifications</span>
        </h1>
        <p className="text-xs text-slate-400">
          Proximity alerts, verified hazard notifications, and severe weather warnings.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
              n.isRead
                ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                : 'glass-panel border-cyan-500/30 text-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">{n.title}</span>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 pt-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {!n.isRead && (
              <button
                onClick={() => markRead(n.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                title="Mark as read"
              >
                <Check className="w-4 h-4 text-cyan-400" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
