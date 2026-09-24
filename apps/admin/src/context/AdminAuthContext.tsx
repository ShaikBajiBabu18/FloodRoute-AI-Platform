import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('floodroute_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await adminApi.getMe();
          if (['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST'].includes(res.user?.role)) {
            setAdmin(res.user);
          } else {
            console.warn('Citizen accounts cannot access incident command admin.');
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await adminApi.login(credentials);
    if (!['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST'].includes(res.user?.role)) {
      throw new Error('Access Denied: You do not possess incident command administrative authorization.');
    }
    localStorage.setItem('floodroute_admin_token', res.token);
    setToken(res.token);
    setAdmin(res.user);
  };

  const logout = () => {
    localStorage.removeItem('floodroute_admin_token');
    setToken(null);
    setAdmin(null);
  };

  const hasRole = (roles: string[]) => {
    if (!admin) return false;
    return roles.includes(admin.role);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, isLoading, login, logout, hasRole }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};
