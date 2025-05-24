import { IncomingMessage, ServerResponse } from "http";

export type RouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
