import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { initializeDatabase } from './db.js';
import logger from './middleware/logger.middleware.js';
import router from './routers/index.router.js';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

try {
  await initializeDatabase();

  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    logger(req, res, () => {
        router(req, res);
      });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server: Database initialization error:', error);
  process.exit(1);
}