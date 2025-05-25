import { Database } from 'sqlite';
import { MockedFunction } from 'vitest';
import { HealthDao } from '../../../src/daos/health.dao.js';

const mockDbInstance = {
  get: vi.fn(),
} as unknown as Database;

const mockDbGet: MockedFunction<Database['get']> = mockDbInstance.get as MockedFunction<Database['get']>;

vi.mock('../../../src/db.js', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));

describe('HealthDao Unit Tests', () => {
  let healthDao: HealthDao;

  beforeEach(() => {
    vi.clearAllMocks();
    healthDao = new HealthDao();
  });

  it('should return health status when found', async () => {
    const expectedHealthStatus = { id: 1, healthy: true };
    mockDbGet.mockResolvedValue(expectedHealthStatus);

    const result = await healthDao.getHealthStatus();

    expect(result).toEqual(expectedHealthStatus);
    expect(mockDbGet).toHaveBeenCalledWith('SELECT id, healthy FROM health WHERE id = 1;');
  });

  it('should return undefined if health status is not found', async () => {
    mockDbGet.mockResolvedValue(undefined);

    const result = await healthDao.getHealthStatus();

    expect(result).toBeUndefined();
    expect(mockDbGet).toHaveBeenCalledWith('SELECT id, healthy FROM health WHERE id = 1;');
  });

  it('should throw an error if the database operation fails', async () => {
    const dbError = new Error('Database connection failed');
    mockDbGet.mockRejectedValue(dbError);

    await expect(healthDao.getHealthStatus()).rejects.toThrow(dbError);
    expect(mockDbGet).toHaveBeenCalledWith('SELECT id, healthy FROM health WHERE id = 1;');
  });
});