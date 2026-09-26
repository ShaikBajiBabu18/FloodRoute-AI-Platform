import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_CONFIG, DemoScenarioData } from '../config/demoConfig';

export interface DemoStepInfo {
  step: number;
  name: string;
  title: string;
  loadingMessage: string;
  routePath?: string;
}

export const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    name: 'Location',
    title: 'Demo Location Selection',
    loadingMessage: 'Analyzing target location and terrain contours...',
    routePath: '/live-map',
  },
  {
    step: 2,
    name: 'Weather',
    title: 'Weather Telemetry Ingestion',
    loadingMessage: 'Fetching real-time radar precipitation and accumulation...',
    routePath: '/live-map',
  },
  {
    step: 3,
    name: 'Flood Risk',
    title: 'Multi-Factor Risk Modeling',
    loadingMessage: 'Calculating explainable flood risk and factor breakdown...',
    routePath: '/live-map',
  },
  {
    step: 4,
    name: 'Alerts',
    title: 'Statutory Disaster Warnings',
    loadingMessage: 'Synchronizing official NDMA/IMD disaster advisories...',
    routePath: '/disaster-alerts',
  },
  {
    step: 5,
    name: 'Emergency',
    title: 'High-Ground Emergency Shelters',
    loadingMessage: 'Loading nearest high-ground relief centers and 112 hotline...',
    routePath: '/emergency-resources',
  },
  {
    step: 6,
    name: 'Route',
    title: 'Flood-Resilient Route Analysis',
    loadingMessage: 'Calculating route comparison for lower modeled risk exposure...',
    routePath: '/route-planner',
  },
  {
    step: 7,
    name: 'AI Explanation',
    title: 'Context-Aware AI Assistant',
    loadingMessage: 'Generating context-aware hydrological explanation...',
  },
];

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (val: boolean) => void;
  isLoading: boolean;
  loadingMessage: string;
  demoConfig: DemoScenarioData;
  startDemo: () => void;
  resetDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  showDemoModal: boolean;
  setShowDemoModal: (val: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('floodroute_demo_mode') === 'true';
  });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('floodroute_demo_mode', isDemoMode.toString());
  }, [isDemoMode]);

  const jumpToStep = useCallback((step: number) => {
    if (step < 1 || step > DEMO_STEPS.length) return;
    const stepInfo = DEMO_STEPS[step - 1];
    setIsLoading(true);
    setLoadingMessage(stepInfo.loadingMessage);

    setTimeout(() => {
      setActiveStep(step);
      setIsLoading(false);
      setLoadingMessage('');
    }, 450);
  }, []);

  const nextStep = useCallback(() => {
    if (activeStep < DEMO_STEPS.length) {
      jumpToStep(activeStep + 1);
    } else {
      setIsAutoPlaying(false);
    }
  }, [activeStep, jumpToStep]);

  const prevStep = useCallback(() => {
    if (activeStep > 1) {
      jumpToStep(activeStep - 1);
    }
  }, [activeStep, jumpToStep]);

  const startDemo = useCallback(() => {
    setDemoMode(true);
    setShowDemoModal(true);
    jumpToStep(1);
    setIsAutoPlaying(false);
  }, [jumpToStep]);

  const resetDemo = useCallback(() => {
    setDemoMode(false);
    setActiveStep(0);
    setIsAutoPlaying(false);
    setIsLoading(false);
    setLoadingMessage('');
    setShowDemoModal(false);
  }, []);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        activeStep,
        setActiveStep,
        isAutoPlaying,
        setIsAutoPlaying,
        isLoading,
        loadingMessage,
        demoConfig: DEMO_CONFIG,
        startDemo,
        resetDemo,
        nextStep,
        prevStep,
        jumpToStep,
        showDemoModal,
        setShowDemoModal,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
