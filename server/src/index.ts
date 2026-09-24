import http from 'http';
import { app } from './app';
import { ENV } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { socketService } from './services/socketService';

const server = http.createServer(app);

// Initialize real-time Socket.IO
socketService.init(server);

async function startServer() {
  try {
    await connectDatabase();

    server.listen(ENV.PORT, () => {
      console.log('====================================================');
      console.log(` FloodRoute AI Central API Gateway is Operational`);
      console.log(` Port: ${ENV.PORT}`);
      console.log(` Environment: ${ENV.NODE_ENV}`);
      console.log(` Citizen Web App: ${ENV.CLIENT_URL}`);
      console.log(` Admin Command Dashboard: ${ENV.ADMIN_URL}`);
      console.log(` AI Microservice Endpoint: ${ENV.AI_SERVICE_URL}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Gracefully shutting down.');
  await disconnectDatabase();
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Gracefully shutting down.');
  await disconnectDatabase();
  server.close(() => {
    process.exit(0);
  });
});

startServer();
