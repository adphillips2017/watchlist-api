import http, { IncomingMessage, ServerResponse } from 'http';

const PORT = 8000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello world.</h1>');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});