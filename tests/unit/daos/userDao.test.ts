import { Database } from 'sqlite';
import { MockedFunction } from 'vitest';
import UserDao from '../../../src/daos/user.dao.js';
import User from '../../../src/models/user.model.js'; // <--- ADD THIS IMPORT
import { stringUtils } from '../../../src/utils/string.util.js'; // <--- ADD THIS IMPORT



// Mock DB
const mockDbInstance = {
  get: vi.fn(),
  run: vi.fn()
} as unknown as Database;

const mockDbGet: MockedFunction<Database['get']> = mockDbInstance.get as MockedFunction<Database['get']>;
const mockDbRun: MockedFunction<Database['run']> = mockDbInstance.run as MockedFunction<Database['run']>;

vi.mock('../../../src/db.js', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));


// Mock StringUtils
vi.mock('../../../src/utils/string.util.js', () => ({
  stringUtils: {
    generateId: vi.fn()
  }
}));
const mockStringUtilsGenerateId: MockedFunction<typeof stringUtils.generateId> = stringUtils.generateId as MockedFunction<typeof stringUtils.generateId>;


describe('UserDao.createUser() Unit Tests', () => {
  let userDao: UserDao;

  beforeEach(() => {
    vi.clearAllMocks();
    userDao = new UserDao();
  });


  it('should create a new user and return the complete user object', async () => {
    const mockId = 'test-user-id-123-456';
    const username = 'newuser';
    const passwordHash = 'hashedpassword123';
    const userToCreate = { username, password_hash: passwordHash };
    const expectedCreatedUser: User = {
      id: mockId,
      username,
      password_hash: passwordHash,
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };

    mockStringUtilsGenerateId.mockReturnValue(mockId);
    mockDbRun.mockResolvedValue({ lastID: 1, changes: 1, stmt: {} as any });
    mockDbGet.mockResolvedValue(expectedCreatedUser);

    const result = await userDao.createUser(userToCreate);


    expect(mockStringUtilsGenerateId).toHaveBeenCalledTimes(1);
    expect(mockDbRun).toHaveBeenCalledWith(
      'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
      mockId,
      username,
      passwordHash
    );
    expect(mockDbGet).toHaveBeenCalledWith(
      'SELECT id, username, password_hash, created_at, updated_at FROM users WHERE id = ?',
      mockId
    );
    expect(result).toEqual(expectedCreatedUser);
  });

  // TODO
  // - what happens if createUser fails to retrieve the user after insert? (e.g., mockDbGet returns undefined)
  // - what happens if the db.run operation itself throws an error?
});