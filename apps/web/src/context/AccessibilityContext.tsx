import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../services/api';

interface QueuedReport {
  id: string;
  data: any;
  timestamp: string;
}

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeText: boolean;
  toggleLargeText: () => void;
  isOffline: boolean;
  queuedReports: QueuedReport[];
  queueReportOffline: (reportData: any) => void;
  syncOfflineQueue: () => Promise<number>;
  readAloud: (text: string) => void;
  stopReadAloud: () => void;
  isSpeaking: boolean;
  openSosModal: boolean;
  setOpenSosModal: (open: boolean) => void;
  openDemoModal: boolean;
  setOpenDemoModal: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('floodroute_high_contrast') === 'true';
  });

  const [largeText, setLargeText] = useState<boolean>(() => {
    return localStorage.getItem('floodroute_large_text') === 'true';
  });

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [openSosModal, setOpenSosModal] = useState<boolean>(false);
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false);

  const [queuedReports, setQueuedReports] = useState<QueuedReport[]>(() => {
    try {
      const saved = localStorage.getItem('floodroute_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('floodroute_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('contrast-more');
      document.body.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('contrast-more');
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('floodroute_large_text', String(largeText));
    if (largeText) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [largeText]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Auto sync queued reports when connection is restored
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleLargeText = () => setLargeText((prev) => !prev);

  const queueReportOffline = (reportData: any) => {
    const item: QueuedReport = {
      id: `offline-${Date.now()}`,
      data: reportData,
      timestamp: new Date().toISOString(),
    };
    const updated = [...queuedReports, item];
    setQueuedReports(updated);
    localStorage.setItem('floodroute_offline_queue', JSON.stringify(updated));
  };

  const syncOfflineQueue = async (): Promise<number> => {
    if (queuedReports.length === 0 || !navigator.onLine) return 0;
    let synced = 0;
    const remaining: QueuedReport[] = [];

    for (const item of queuedReports) {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        if (res.ok) {
          synced++;
        } else {
          remaining.push(item);
        }
      } catch (err) {
        remaining.push(item);
      }
    }

    setQueuedReports(remaining);
    localStorage.setItem('floodroute_offline_queue', JSON.stringify(remaining));
    return synced;
  };

  const readAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        isOffline,
        queuedReports,
        queueReportOffline,
        syncOfflineQueue,
        readAloud,
        stopReadAloud,
        isSpeaking,
        openSosModal,
        setOpenSosModal,
        openDemoModal,
        setOpenDemoModal,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return ctx;
};
