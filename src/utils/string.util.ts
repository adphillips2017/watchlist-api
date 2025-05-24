import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PASSWORD_MIN_LENGTH, SALT_ROUNDS } from '../constants/config.constants.js';



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
}


export const stringUtils = StringUtils.getInstance();
