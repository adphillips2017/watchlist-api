import { IncomingMessage, ServerResponse } from "http";
import notFound from './controllers/notFound.controller.js';



export type RouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;

export interface Route {
  path: string;
  method: string;
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'GET', handler });
  }

  post(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'POST', handler });
  }

  put(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'POST', handler });
  }

  patch(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'POST', handler });
  }

  delete(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'POST', handler });
  }

  /**
   * This is the main request handler for the server.
   * It finds a matching route and dispatches the request.
   */
  async route(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const matchedRoute = this.routes.find(
      route => route.path === req.url && route.method === req.method
    );

    if (!matchedRoute) {
      notFound(req, res);
    }

    try {
      await matchedRoute?.handler(req, res);
    } catch (error) {
      console.error(`Error handling request for ${req.url} ${req.method}:`, error);
      // Generic 500 error for unhandled exceptions in route handlers
      res.statusCode = 500;
      res.end(JSON.stringify({
        message: 'Internal Server Error',
        error: (error instanceof Error) ? error.message : 'Unknown server error'
      }));
    }
  }
}