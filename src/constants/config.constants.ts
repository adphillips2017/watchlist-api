// User Config
export const USERNAME_MIN_LENGTH: number = 4;
export const PASSWORD_MIN_LENGTH: number = 8;

// Security Config
export const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS ?? '') || 10;

const oneHourInSeconds: number = 60 * 60;
export const JWT_EXPIRATION_TIME: number = parseInt(process.env.JWT_EXPIRATION_TIME ?? '') || oneHourInSeconds;

