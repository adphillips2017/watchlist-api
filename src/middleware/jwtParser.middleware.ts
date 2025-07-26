import { IncomingMessage, ServerResponse } from 'http';
import { ApiErrors } from '../constants/errors.constants.js';
import { ApiError } from '../errors/api.error.js';
import Route from '../models/route.model.js';
import { stringUtils } from '../utils/string.util.js';


export interface AuthenticatedUser {
  id: string;
  username: string;
}

// Extend IncomingMessage to include a 'user' property for parsed jwt data.
declare module 'http' {
  interface IncomingMessage {
    user?: AuthenticatedUser;
  }
}

const unprotectedRoutes: Omit<Route, 'handler'>[] = [
  {
    method: 'POST',
    path: '/user/register'
  },
  {
    method: 'POST',
    path: '/user/login'
  },
  {
    method: 'GET',
    path: '/health'
  },
  {
    method: 'GET',
    path: '/favicon.ico'
  }
]

/**
 * Middleware to parse and validate a JWT from the Authorization header.
 * Skips validation for explicitly defined unprotected routes.
 * For protected routes:
 * - Extracts the token from the 'Authorization: Bearer <token>' header.
 * - Validates the token's signature and expiration using `stringUtils.validateJwt`.
 * - If valid, attaches the decoded user payload to `req.user`.
 * - If invalid, missing, or malformed for a protected route, it sends an appropriate error response.
 *
 * @param {IncomingMessage} req - The Node.js IncomingMessage object.
 * @param {ServerResponse} res - The Node.js ServerResponse object.
 * @param {() => void} next - The next middleware or route handler function in the chain.
 */
export function jwtParser(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  if (routeIsUnprotected(req.url)) {
    next();
    return;
  }

  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new ApiError(ApiErrors.TOKEN_MISSING);
    }

    const token = authorizationHeader.split(' ')[1];
    const decodedPayload = stringUtils.validateJwt(token);

    req.user = {
      id: decodedPayload.id as string,
      username: decodedPayload.username as string
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[JWT Middleware - ApiError] Status: ${error.error.statusCode}, Message: ${error.error.message}.`);
      res.statusCode = error.error.statusCode;
      res.end(JSON.stringify(error.error));
    } else {
      console.error(`[JWT Middleware - Unhandled Error]:`, error);
      res.statusCode = 500;
      res.end(JSON.stringify(error));
    }
  }

  function routeIsUnprotected(url: string | undefined): boolean {
    // Parse the URL object to strip any query params
    const parsedUrl = new URL(url || '/', `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const unprotectedRoute = unprotectedRoutes.find(
      route => route.path === pathname && route.method === req.method
    );

    return !!unprotectedRoute;
  }
}