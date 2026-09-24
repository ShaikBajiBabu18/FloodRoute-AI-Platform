import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSocketProvider } from './context/AdminSocketContext';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminNavbar } from './components/layout/AdminNavbar';

// Pages
import { DashboardOverview } from './pages/DashboardOverview';
import { LiveOperationsMap } from './pages/LiveOperationsMap';
import { FloodReportsTable } from './pages/FloodReportsTable';
import { RoadConditionsPage } from './pages/RoadConditionsPage';
import { AlertsManagerPage } from './pages/AlertsManagerPage';
import { AiAnalyticsPage } from './pages/AiAnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

const queryClient = new QueryClient();

const ProtectedAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-xs font-mono text-cyan-400">
        Authenticating Operator Credentials...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <AdminSocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AdminLoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedAdminLayout>
                    <Routes>
                      <Route path="/" element={<DashboardOverview />} />
                      <Route path="/operations-map" element={<LiveOperationsMap />} />
                      <Route path="/reports" element={<FloodReportsTable />} />
                      <Route path="/road-conditions" element={<RoadConditionsPage />} />
                      <Route path="/alerts" element={<AlertsManagerPage />} />
                      <Route path="/ai-analytics" element={<AiAnalyticsPage />} />
                      <Route path="/users" element={<UserManagementPage />} />
                      <Route path="/audit-logs" element={<AuditLogsPage />} />
                    </Routes>
                  </ProtectedAdminLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </AdminSocketProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
