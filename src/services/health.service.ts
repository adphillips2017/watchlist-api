import { HealthDao, HealthStatus } from "../daos/health.dao.js";

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