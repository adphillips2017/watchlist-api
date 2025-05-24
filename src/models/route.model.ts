import { RouteHandler } from "./routeHandler.model.js";

export default interface Route {
  path: string;
  method: string;
  handler: RouteHandler;
}
