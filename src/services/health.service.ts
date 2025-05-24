import { HealthDao } from "../daos/health.dao.js";
import HealthStatus from "../models/healthStatus.model.js";

export default class HealthService {
  private healthDao: HealthDao;

  constructor() {
    this.healthDao = new HealthDao();
  }

  async getHealth(): Promise<boolean> {
    const healthStatus: HealthStatus | undefined = await this.healthDao.getHealthStatus();
    return healthStatus?.healthy === 1;
  }
}
