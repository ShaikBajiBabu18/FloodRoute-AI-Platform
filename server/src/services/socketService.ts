import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { ENV } from '../config/env';

export class SocketService {
  private io: SocketIOServer | null = null;

  init(server: http.Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [ENV.CLIENT_URL, ENV.ADMIN_URL, 'http://localhost:5173', 'http://localhost:5174'],
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

  emitToUser(userId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, payload);
    }
  }
}

export const socketService = new SocketService();
