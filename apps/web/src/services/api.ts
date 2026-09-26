import axios from 'axios';
import {
  WeatherForecast,
  LocationSearchResult,
  RouteOption,
  FloodReportItem,
  DisasterAlertItem,
  EmergencyResourceItem,
  RoadConditionItem,
  AIAnalysisResult,
  CalculatedRisk,
} from '@floodroute/shared';

export const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('floodroute_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Health
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Auth
  login: async (credentials: any) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  register: async (payload: any) => {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Weather
  getWeatherCurrent: async (lat: number, lng: number) => {
    const res = await apiClient.get(`/weather/current?lat=${lat}&lng=${lng}`);
    return res.data;
  },
  getWeatherForecast: async (lat: number, lng: number): Promise<{ forecast: WeatherForecast }> => {
    const res = await apiClient.get(`/weather/forecast?lat=${lat}&lng=${lng}`);
    const data = res.data;
    if (data.forecast) return data;
    return {
      forecast: {
        current: data.current,
        hourly: data.hourly || [],
        daily: data.daily || [],
        sourceMeta: data.sourceMeta,
      } as any,
    };
  },

  // Flood Intelligence
  getFloodRisk: async (lat: number, lng: number, locationName?: string): Promise<CalculatedRisk & { breakdown: any }> => {
    const res = await apiClient.get(`/flood/risk?lat=${lat}&lng=${lng}&location=${encodeURIComponent(locationName || '')}`);
    return res.data;
  },
  getFloodReports: async (params?: any): Promise<{ reports: FloodReportItem[] }> => {
    const res = await apiClient.get('/reports', { params });
    return res.data;
  },
  getReportById: async (id: string): Promise<{ report: FloodReportItem }> => {
    const res = await apiClient.get(`/reports/${id}`);
    return res.data;
  },
  createReport: async (formData: FormData): Promise<any> => {
    const res = await apiClient.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  upvoteReport: async (id: string) => {
    const res = await apiClient.post(`/reports/${id}/upvote`);
    return res.data;
  },

  // Routing
  searchLocations: async (query: string): Promise<{ locations: LocationSearchResult[] }> => {
    const res = await apiClient.get(`/routes/geocode?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  calculateRoutes: async (payload: {
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    originName?: string;
    destName?: string;
    avoidFlooded?: boolean;
    avoidHighRisk?: boolean;
    preferSafer?: boolean;
    preferFastest?: boolean;
  }): Promise<{ routes: RouteOption[]; meta: any }> => {
    const res = await apiClient.post('/routes/calculate', payload);
    return {
      routes: res.data.options || res.data.routes || [],
      meta: res.data.summary || {},
    };
  },

  // Alerts
  getAlerts: async (params?: any): Promise<{ alerts: DisasterAlertItem[] }> => {
    const res = await apiClient.get('/alerts', { params });
    return res.data;
  },

  // Emergency Resources
  getResources: async (params?: any): Promise<{ resources: EmergencyResourceItem[] }> => {
    const res = await apiClient.get('/resources', { params });
    return res.data;
  },

  // Road Conditions
  getRoadConditions: async (params?: any): Promise<{ roads: RoadConditionItem[] }> => {
    const res = await apiClient.get('/roads', { params });
    return res.data;
  },

  // Saved Locations & Notifications
  getSavedLocations: async () => {
    const res = await apiClient.get('/users/saved-locations');
    return res.data;
  },
  addSavedLocation: async (data: any) => {
    const res = await apiClient.post('/users/saved-locations', data);
    return res.data;
  },
  deleteSavedLocation: async (id: string) => {
    const res = await apiClient.delete(`/users/saved-locations/${id}`);
    return res.data;
  },
  getNotifications: async () => {
    const res = await apiClient.get('/users/notifications');
    return res.data;
  },
  markNotificationRead: async (id: string) => {
    const res = await apiClient.put(`/users/notifications/${id}/read`);
    return res.data;
  },
};
