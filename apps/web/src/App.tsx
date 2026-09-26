import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { I18nProvider } from './context/I18nContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Global Overlays & Floating Tools
import { LiveStatusBar } from './components/common/LiveStatusBar';
import { CopilotChat } from './components/common/CopilotChat';
import { EmergencySosModal } from './components/common/EmergencySosModal';
import { DemoModeRunner } from './components/common/DemoModeRunner';
import { DemoProvider } from './context/DemoContext';
import { DemoControlPanel } from './components/common/DemoControlPanel';
import { OneClickJudgeDemo } from './components/common/OneClickJudgeDemo';

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

// New Advanced Disaster Response Pages
import { RiverMonitoringPage } from './pages/RiverMonitoringPage';
import { DistrictCommandPage } from './pages/DistrictCommandPage';
import { IotArchitecturePage } from './pages/IotArchitecturePage';
import { NationalOverviewPage } from './pages/NationalOverviewPage';
import { CommunityLeaderboardPage } from './pages/CommunityLeaderboardPage';

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
          <ToastProvider>
            <I18nProvider>
              <AccessibilityProvider>
                <BrowserRouter>
                  <DemoProvider>
                    <div className="flex flex-col min-h-screen pb-16 lg:pb-0 bg-[#020617] text-slate-100 relative">
                      {/* Top National Telemetry Ribbon */}
                      <LiveStatusBar />

                      {/* Navigation Bar */}
                      <Navbar />

                      {/* Main Content Viewport */}
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/live-map" element={<LiveMapPage />} />
                          <Route path="/map" element={<Navigate to="/live-map" replace />} />
                          <Route path="/route-planner" element={<RoutePlannerPage />} />
                          <Route path="/routes" element={<Navigate to="/route-planner" replace />} />
                          <Route path="/weather" element={<WeatherPage />} />
                          <Route path="/flood-intelligence" element={<FloodIntelligencePage />} />
                          <Route path="/flood" element={<Navigate to="/flood-intelligence" replace />} />
                          <Route path="/rivers" element={<RiverMonitoringPage />} />
                          <Route path="/districts" element={<DistrictCommandPage />} />
                          <Route path="/iot-architecture" element={<IotArchitecturePage />} />
                          <Route path="/national-overview" element={<NationalOverviewPage />} />
                          <Route path="/community" element={<CommunityLeaderboardPage />} />
                          <Route path="/disaster-alerts" element={<DisasterAlertsPage />} />
                          <Route path="/alerts" element={<Navigate to="/disaster-alerts" replace />} />
                          <Route path="/report-hazard" element={<ReportHazardPage />} />
                          <Route path="/report" element={<Navigate to="/report-hazard" replace />} />
                          <Route path="/emergency-resources" element={<EmergencyResourcesPage />} />
                          <Route path="/emergency" element={<Navigate to="/emergency-resources" replace />} />
                          <Route path="/my-reports" element={<MyReportsPage />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route
                            path="/admin"
                            element={
                              <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm font-semibold text-slate-300">Connecting to Admin Command Center...</p>
                                <a
                                  href="http://localhost:5174"
                                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
                                >
                                  Launch Admin Portal (Port 5174)
                                </a>
                              </div>
                            }
                          />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>

                      {/* Footer */}
                      <Footer />
                      <MobileNav />

                      {/* Floating Copilot Assistant */}
                      <CopilotChat />

                      {/* Global Emergency Modals */}
                      <EmergencySosModal />
                      <DemoModeRunner />

                      {/* Unified Demo Orchestration */}
                      <OneClickJudgeDemo />
                      <DemoControlPanel />
                    </div>
                  </DemoProvider>
                </BrowserRouter>
              </AccessibilityProvider>
            </I18nProvider>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
