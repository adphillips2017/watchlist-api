import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { HealthController } from './controllers/health.controller.js';
import { initializeDatabase } from './db.js';
import logger from './middleware/logger.middleware.js';
import { Router } from './router.js';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

try {
  await initializeDatabase();

  // Register Routes with the Router.
  const router = new Router();
  const healthController = new HealthController();
  router.get('/health', healthController.getHealthStatus.bind(healthController));


  // Create the server, and register Middleware.
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    logger(req, res, () => {
        router.route(req, res);
      });
  });

  // Run the server.
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server: Database initialization error:', error);
  process.exit(1);
}