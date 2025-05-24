import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new UUID (version 4) string.
 * This function abstracts the specifics of the UUID library,
 * and makes switching ID generation in the future easier.
 * @returns {string} A new ID string.
 */
export function generateId(): string {
  return uuidv4();
}
