import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { ENV } from '../config/env';

export interface TypedSocketEvents {
  'report.created': (report: any) => void;
  'report.updated': (report: any) => void;
  'report.verified': (report: any) => void;
  'report.resolved': (report: any) => void;
  'alert.created': (alert: any) => void;
  'road.updated': (road: any) => void;
  'notification.created': (notification: any) => void;
  'weather.updated': (weather: any) => void;
}

export class SocketService {
  private io: SocketIOServer | null = null;

  init(server: http.Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          ENV.CLIENT_URL,
          ENV.ADMIN_URL,
          'http://localhost:8080',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://127.0.0.1:8080',
          'http://127.0.0.1:5174',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`[Socket.IO] Client connected: ${socket.id}`);

      socket.on('join:room', (room: string) => {
        socket.join(room);
        console.log(`[Socket.IO] ${socket.id} joined room: ${room}`);
      });

      socket.on('leave:room', (room: string) => {
        socket.leave(room);
        console.log(`[Socket.IO] ${socket.id} left room: ${room}`);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      });
    });

    console.log('[Socket.IO] Real-time messaging service initialized.');
  }

  broadcast(event: string, payload: any) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }

  broadcastReportCreated(report: any) {
    this.broadcast('report.created', report);
  }

  broadcastReportVerified(report: any) {
    this.broadcast('report.verified', report);
    this.broadcast('report.updated', report);
  }

  broadcastReportResolved(report: any) {
    this.broadcast('report.resolved', report);
    this.broadcast('report.updated', report);
  }

  broadcastAlertCreated(alert: any) {
    this.broadcast('alert.created', alert);
  }

  broadcastRoadUpdated(road: any) {
    this.broadcast('road.updated', road);
  }

  broadcastNotification(userId: string, notification: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit('notification.created', notification);
      this.io.emit('notification.created', notification);
    }
  }

  broadcastWeatherUpdated(weather: any) {
    this.broadcast('weather.updated', weather);
  }

  emitToUser(userId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, payload);
    }
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const socketService = new SocketService();
