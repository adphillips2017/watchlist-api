import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_EXPIRATION_TIME, PASSWORD_MIN_LENGTH, SALT_ROUNDS } from '../constants/config.constants.js';
import { ApiErrors } from '../constants/errors.constants.js';
import { ApiError } from '../errors/api.error.js';
import User from '../models/user.model.js';



class StringUtils {
  private static instance: StringUtils;

  private constructor() { }

  public static getInstance(): StringUtils {
    if (!StringUtils.instance) {
      StringUtils.instance = new StringUtils();
    }
    return StringUtils.instance;
  }

  /**
   * Generates an ID using the UUID package.
   * @returns {string} An ID ready for db use.
   */
  public generateId(): string {
    return uuidv4();
  }

  /**
   * Hashes a plain text password using bcrypt.
   * @param password The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves to the hashed password string.
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a stored bcrypt hash.
   * @param plainPassword The plain text password provided by the user (e.g., during login).
   * @param hashedPassword The hashed password retrieved from the database.
   * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
   */
  public async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Checks the strength of a password based on predefined criteria.
   *
   * @param password The password string to evaluate for strength.
   * @returns {boolean} True if the password meets all defined strength criteria, false otherwise.
   *
   * @remarks
   * Current criteria include:
   * - Minimum length of 8 characters.
   * - At least one uppercase letter (A-Z).
   * - At least one lowercase letter (a-z).
   * - At least one number (0-9).
   * - At least one special character (e.g., !@#$%^&*).
   */
  public passwordIsStrong(password: string): boolean {
    const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
    if (!hasMinLength) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) return false;

    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) return false;

    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) return false;

    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    if (!hasSpecialChar) return false;

    return true;
  }

  /**
   * Generates a JSON Web Token (JWT) for a given user.
   * The token includes the user's ID and username in its payload and is signed
   * with a secret key, expiring after a configured duration.
   *
   * @param {User} user - The user object for whom the JWT is to be generated.
   * The user's `id` and `username` will be included in the token's payload.
   * @returns {string} The generated JWT string.
   * @throws {Error} If `JWT_SECRET` is not defined in the environment, indicating a critical configuration error.
   */
  public generateJwt(user: User): string {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined. Cannot generate token.");
    }

    const payload = {
      id: user.id,
      username: user.username
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
  }

  /**
   * Validates a given JSON Web Token (JWT).
   * This method verifies the token's signature using the secret key and checks its expiration.
   *
   * @param {string} token - The JWT string to validate.
   * @returns {jwt.JwtPayload} The decoded payload of the JWT if validation is successful.
   * @throws {ApiError} If the token is missing, invalid, or expired.
  */
  public validateJwt(token: string): jwt.JwtPayload {
    if (!token) {
      throw new ApiError(ApiErrors.TOKEN_MISSING);
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined. Cannot validate token.");
    }

    try {
      return jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(ApiErrors.TOKEN_EXPIRED, error);
      } else if (error instanceof jwt.JsonWebTokenError) {
        // This catches errors like "invalid signature", "invalid token", etc.
        throw new ApiError(ApiErrors.TOKEN_INVALID, error);
      } else {
        throw new ApiError(ApiErrors.UNAUTHORIZED, error as Error);
      }
    }
  }
}


export const stringUtils = StringUtils.getInstance();
