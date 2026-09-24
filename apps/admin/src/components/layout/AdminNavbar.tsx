import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminSocket } from '../../context/AdminSocketContext';
import { LogOut, Radio, Shield, User } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const { isConnected } = useAdminSocket();

  return (
    <header className="h-14 bg-navy-950/90 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
          <Radio className={`w-3 h-3 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
          <span>{isConnected ? 'INCIDENT MESH: CONNECTED' : 'INCIDENT MESH: CONNECTING'}</span>
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {admin && (
          <div className="flex items-center gap-3 pl-3">
            <div className="text-right">
              <div className="font-bold text-slate-200">{admin.name}</div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold">{admin.role}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 font-bold flex items-center justify-center">
              {admin.name.charAt(0)}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
              title="Logout from Incident Command"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
