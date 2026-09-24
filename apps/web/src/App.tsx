import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { WeatherPage } from './pages/WeatherPage';
import { FloodIntelligencePage } from './pages/FloodIntelligencePage';
import { DisasterAlertsPage } from './pages/DisasterAlertsPage';
import { ReportHazardPage } from './pages/ReportHazardPage';
import { EmergencyResourcesPage } from './pages/EmergencyResourcesPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen pb-14 lg:pb-0">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/live-map" element={<LiveMapPage />} />
                  <Route path="/route-planner" element={<RoutePlannerPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/flood-intelligence" element={<FloodIntelligencePage />} />
                  <Route path="/disaster-alerts" element={<DisasterAlertsPage />} />
                  <Route path="/report-hazard" element={<ReportHazardPage />} />
                  <Route path="/emergency-resources" element={<EmergencyResourcesPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
              <MobileNav />
            </div>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
