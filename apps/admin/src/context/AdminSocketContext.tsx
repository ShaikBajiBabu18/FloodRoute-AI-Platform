import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface AdminSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastEvent: { type: string; data: any; time: number } | null;
}

const AdminSocketContext = createContext<AdminSocketContextType>({
  socket: null,
  isConnected: false,
  lastEvent: null,
});

export const AdminSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<{ type: string; data: any; time: number } | null>(null);

  useEffect(() => {
    const s = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      setIsConnected(true);
      console.log('[AdminSocket] Connected to live incident broadcast mesh');
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    const events = [
      'report.created',
      'report.updated',
      'report.approved',
      'report.rejected',
      'report.resolved',
      'alert.created',
      'alert.updated',
      'road.updated',
    ];

    events.forEach((ev) => {
      s.on(ev, (data) => {
        setLastEvent({ type: ev, data, time: Date.now() });
      });
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <AdminSocketContext.Provider value={{ socket, isConnected, lastEvent }}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export const useAdminSocket = () => useContext(AdminSocketContext);
