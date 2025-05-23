import { IncomingMessage, ServerResponse } from "http";

export default (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};