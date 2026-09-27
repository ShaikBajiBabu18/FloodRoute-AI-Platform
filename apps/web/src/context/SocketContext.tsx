import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastEvent: { type: string; data: any; time: number } | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  lastEvent: null,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<{ type: string; data: any; time: number } | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_WS_URL || window.location.origin;
    const s = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to real-time event grid');
    });

    s.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected');
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
      'notification.created',
    ];

    events.forEach(ev => {
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
    <SocketContext.Provider value={{ socket, isConnected, lastEvent }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
