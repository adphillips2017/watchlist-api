import { USERNAME_MIN_LENGTH } from "../constants/config.constants.js";
import { ApiErrors } from "../constants/errors.constants.js";
import UserDao from "../daos/user.dao.js";
import { ApiError } from "../errors/api.error.js";
import User from "../models/user.model.js";
import { stringUtils } from "../utils/string.util.js";

export default class UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async registerUser(username: string, password: string): Promise<Omit<User, 'password_hash'>> {
    if (!username || username.trim().length < USERNAME_MIN_LENGTH) {
      console.log(ApiErrors.USERNAME_MIN_LENGTH.message);
      throw new ApiError(ApiErrors.USERNAME_MIN_LENGTH);
    }

    const passwordIsStrong = stringUtils.passwordIsStrong(password);
    if (!password || !passwordIsStrong) {
      console.log(ApiErrors.PASSWORD_NOT_STRONG.message);
      throw new ApiError(ApiErrors.PASSWORD_NOT_STRONG);
    }

    try {
      const usernameIsUnique = !(await this.userDao.getUserByUsername(username));
      if (!usernameIsUnique) {
        console.log(ApiErrors.USERNAME_ALREADY_TAKEN.message);
        throw new ApiError(ApiErrors.USERNAME_ALREADY_TAKEN);
      }

      const passwordHash = await stringUtils.hashPassword(password);

      const dbUser: Omit<User, 'id' | 'created_at' | 'updated_at'> = { username, password_hash: passwordHash };
      const createdUser: User = await this.userDao.createUser(dbUser);
      const { password_hash, ...newUser } = createdUser;
      return newUser;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`[UserService - Handled ApiError] Code: ${error.error.statusCode}, Message: ${error.error.message}.`);
        throw error;
      }

      console.error(`[UserService - Unhandled Error] during user registration for ${username}:`, error);
      throw new ApiError(
        ApiErrors.FAILED_TO_REGISTER_USER,
        error as Error
      );
    }
  }
}