import { IncomingMessage, ServerResponse } from "http";

export default (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not Found' }));
};