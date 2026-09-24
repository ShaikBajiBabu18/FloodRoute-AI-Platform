import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('floodroute_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Auth
  login: async (credentials: any) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // KPI & Analytics
  getKpis: async () => {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },
  getAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics');
    return res.data;
  },
  getAiAnalytics: async () => {
    const res = await apiClient.get('/admin/ai-analytics');
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  },

  // Flood Reports Moderation
  getReports: async (params?: any) => {
    const res = await apiClient.get('/reports', { params });
    return res.data;
  },
  updateReportStatus: async (id: string, payload: { status: string; severity?: string; notes?: string }) => {
    const res = await apiClient.put(`/reports/${id}/status`, payload);
    return res.data;
  },

  // Road Conditions Management
  getRoads: async (params?: any) => {
    const res = await apiClient.get('/roads', { params });
    return res.data;
  },
  createRoad: async (data: any) => {
    const res = await apiClient.post('/roads', data);
    return res.data;
  },
  updateRoad: async (id: string, data: any) => {
    const res = await apiClient.put(`/roads/${id}`, data);
    return res.data;
  },
  deleteRoad: async (id: string) => {
    const res = await apiClient.delete(`/roads/${id}`);
    return res.data;
  },

  // Alerts Management
  getAlerts: async (params?: any) => {
    const res = await apiClient.get('/alerts', { params });
    return res.data;
  },
  createPlatformAlert: async (data: any) => {
    const res = await apiClient.post('/alerts', data);
    return res.data;
  },
  updateAlert: async (id: string, data: any) => {
    const res = await apiClient.put(`/alerts/${id}`, data);
    return res.data;
  },

  // Users Management
  getUsers: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  },
  updateUser: async (id: string, data: { role?: string; isActive?: boolean }) => {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },

  // Resources
  getResources: async () => {
    const res = await apiClient.get('/resources');
    return res.data;
  },
  createResource: async (data: any) => {
    const res = await apiClient.post('/resources', data);
    return res.data;
  },
};
