import dotenv from 'dotenv';
import http, { IncomingMessage, ServerResponse } from 'http';
import logger from './middleware/logger.middleware';
import router from './routers/index.router';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  logger(req, res, () => {
    router(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});