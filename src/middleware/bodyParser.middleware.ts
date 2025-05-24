import { IncomingMessage, ServerResponse } from 'http';
import { ApiErrors } from '../constants/errors.constants.js';



// Extend IncomingMessage to include a 'body' property for parsed data.
declare module 'http' {
  interface IncomingMessage {
    body?: any;
  }
}

/**
 * Middleware function to parse JSON request bodies for POST, PUT, and PATCH requests.
 * - Attaches the parsed JSON object to `req.body`.
 * - If parsing fails or the body is missing for expected methods, it sends an
 *   appropriate error response and ends the request, preventing further processing.
 * - If successful, calls the `next()` callback to pass control to the next handler.
 *
 * @param req The IncomingMessage object from Node.js HTTP server.
 * @param res The ServerResponse object from Node.js HTTP server.
 * @param next A callback function to pass control to the next middleware or route handler.
 */
export function bodyParser(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  // Check if the request method typically contains a body.
  if (!['POST', 'PUT', 'PATCH'].includes(req.method ?? '')) {
    next();
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    if (!body) {
      res.writeHead(ApiErrors.NO_REQUEST_BODY.statusCode);
      res.end(JSON.stringify({ message: ApiErrors.NO_REQUEST_BODY.message }));
      return;
    }

    try {
      (req as any).body = JSON.parse(body);
      next();
    } catch (parseError) {
      console.error('[jsonBodyParser] Failed to parse request JSON:', parseError);
      res.writeHead(ApiErrors.INVALID_REQUEST_BODY.statusCode);
      res.end(JSON.stringify({ message: ApiErrors.INVALID_REQUEST_BODY.message }));
      return;
    }
  });

  req.on('error', (err) => {
    console.error('[jsonBodyParser] Request stream error:', err);
    if (!res.headersSent) {
      res.writeHead(ApiErrors.REQUEST_STREAM_ERROR.statusCode);
      res.end(JSON.stringify({ message: ApiErrors.REQUEST_STREAM_ERROR.message }));
    }
  });
}