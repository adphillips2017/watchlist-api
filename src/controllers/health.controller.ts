import { IncomingMessage, ServerResponse } from "http";
import HealthService from "../services/health.service.js";

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  /**
   * Handles the HTTP request for the health endpoint.
   * @param req The incoming HTTP request.
   * @param res The server response object.
   */
  async getHealthStatus(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let errorMessage: string | null = null;
    let healthy = false;

    try {
      healthy = await this.healthService.getHealth();
    } catch (error) {
      console.error('Error encountered in health check service:', error);
      healthy = false;
      errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
    }

    const statusCode = healthy ? 200 : 500;
    const statusDescription = healthy ? 'Healthy' : 'Database Connection Error';

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: statusDescription,
      timestamp: new Date().toISOString(),
      error: errorMessage
    }));
  }
}