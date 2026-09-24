import React, { useEffect, useState } from 'react';
import { Users, Shield, UserCheck, UserX, Edit3 } from 'lucide-react';
import { adminApi } from '../services/api';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUser(userId, { role: newRole });
      fetchUsers();
    } catch {
      alert('Failed to update role.');
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await adminApi.updateUser(userId, { isActive: !currentStatus });
      fetchUsers();
    } catch {
      alert('Failed to toggle user status.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>User Directory & Role-Based Access Control</span>
        </h1>
        <p className="text-xs text-slate-400">
          Manage operational roles (SUPER_ADMIN, ADMIN, MODERATOR, ANALYST) and citizen accounts.
        </p>
      </div>

      <div className="admin-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Reports Filed</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-bold"
                    >
                      <option value="CITIZEN">CITIZEN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {u.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{u._count?.reports || 0}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        u.isActive
                          ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
