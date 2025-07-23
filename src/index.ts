import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import { initializeDatabase } from './db.js';
import { bodyParser } from './middleware/bodyParser.middleware.js';
import { headerMiddleware } from './middleware/header.middleware.js';
import { jwtParser } from './middleware/jwtParser.middleware.js';
import logger from './middleware/logger.middleware.js';
import Router from './router.js';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

try {
  await initializeDatabase();

  const router = new Router();
  router.initializeRoutes();

  // Create the server, register Middleware and Router.
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    logger(req, res, () => {
      jwtParser(req, res, () => {
        headerMiddleware(req, res, () => {
          bodyParser(req, res, () => {
            router.route(req, res);
          });
        });
      });
    });
  });

  // Run the server.
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
