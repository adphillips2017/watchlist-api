import { IncomingMessage, ServerResponse } from "http";

export default (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, { 'content-type': 'application/json'});
  res.end(JSON.stringify({ message: 'Not Found' }));
};