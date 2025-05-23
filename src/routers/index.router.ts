import { IncomingMessage, ServerResponse } from "http";
import healthStatus from '../controllers/health.controller';
import notFound from '../controllers/notFound.controller';

const router = (req: IncomingMessage, res: ServerResponse) => {
  switch(req.url) {
    case('/health'):
      healthStatus(req, res);
      break;
    default:
      notFound(req, res);
      break;
  }
};

export default router;