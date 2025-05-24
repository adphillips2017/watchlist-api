import { IncomingMessage, ServerResponse } from "http";
import { HealthController } from './controllers/health.controller.js';
import notFound from './controllers/notFound.controller.js';
import UserController from './controllers/user.controller.js';
import Route from "./models/route.model.js";
import { RouteHandler } from "./models/routeHandler.model.js";


class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'GET', handler });
  }

  post(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'POST', handler });
  }

  put(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'PUT', handler });
  }

  patch(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'PATCH', handler });
  }

  delete(path: string, handler: RouteHandler): void {
    this.routes.push({ path, method: 'DELETE', handler });
  }

  /**
   * Initializes and registers all application routes.
   * This method instantiates controllers and registers their handlers
   * with the router's internal route collection.
   */
  public initializeRoutes(): void { // <-- NEW METHOD
    const healthController = new HealthController();
    const userController = new UserController();

    this.get('/health', healthController.getHealthStatus.bind(healthController));
    this.post('/user', userController.registerUser.bind(userController));
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
      return;
    }

    try {
      await matchedRoute?.handler(req, res);
    } catch (error) {
      console.error(`Error handling request for ${req.url} ${req.method}:`, error);
      res.statusCode = 500;
      res.end(JSON.stringify({
        message: 'Internal Server Error',
        error: (error instanceof Error) ? error.message : 'Unknown server error'
      }));
    }
  }
}


const router = new Router();
router.initializeRoutes();
export default router;
