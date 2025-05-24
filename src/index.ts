import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { initializeDatabase } from './db.js';
import { bodyParser } from './middleware/bodyParser.middleware.js';
import { headerMiddleware } from './middleware/header.middleware.js';
import logger from './middleware/logger.middleware.js';
import router from './router.js';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

try {
  await initializeDatabase();

  // Create the server, and register Middleware.
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    logger(req, res, () => {
      headerMiddleware(req, res, () => {
        bodyParser(req, res, () => {
          router.route(req, res);
        });
      });
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
