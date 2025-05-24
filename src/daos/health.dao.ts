import { Database } from 'sqlite';
import { getDb } from '../db.js';
import HealthStatus from '../models/healthStatus.model.js';

export class HealthDao {
  private db: Database;

  constructor() {
    this.db = getDb();
  }

  /**
   * Fetches the current health status from the database.
   * Assumes there's only one row in the health table, with id=1.
   * @returns {Promise<HealthStatus | undefined>} A promise that resolves to the health status or undefined if not found.
   */
  async getHealthStatus(): Promise<HealthStatus | undefined> {
    try {
      return await this.db.get<HealthStatus>('SELECT id, healthy FROM health WHERE id = 1;');
    } catch (error) {
      console.error('Error fetching health status from DB in HealthDao:', error);
      throw error;
    }
  }
}