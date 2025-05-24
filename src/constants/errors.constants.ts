import ApiErrorObject from "../models/apiError.model.js";
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "./config.constants.js";

const ErrorDefinitions = {
  // --- Authentication/User Specific Errors ---
  USERNAME_ALREADY_TAKEN: {
    message: 'Username already taken.',
    statusCode: 409
  } as ApiErrorObject,

  USERNAME_MIN_LENGTH: {
    message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`,
    statusCode: 400
  } as ApiErrorObject,

  PASSWORD_NOT_STRONG: {
    message: `Password is not strong enough. It must be at least ${PASSWORD_MIN_LENGTH} characters long, contain uppercase, lowercase, number, and special character.`,
    statusCode: 400
  } as ApiErrorObject,

  // --- New Request Body Parsing Errors ---
  NO_REQUEST_BODY: {
    message: 'Request body is missing.',
    statusCode: 400
  } as ApiErrorObject,

  INVALID_REQUEST_BODY: {
    message: 'Request body contains invalid JSON.',
    statusCode: 400
  } as ApiErrorObject,

  REQUEST_STREAM_ERROR: {
    message: 'Server encountered an error reading the request stream.',
    statusCode: 500
  } as ApiErrorObject,

  // --- Generic Application Errors ---
  FAILED_TO_REGISTER_USER: {
    message: 'Failed to register user due to an unexpected server error.',
    statusCode: 500
  } as ApiErrorObject,

  FAILED_TO_RETRIEVE_CREATED_USER: {
    message: 'Failed to retrieve newly created user after insertion. Data integrity issue.',
    statusCode: 500
  } as ApiErrorObject,

  INVALID_CREDENTIALS: {
    message: 'Invalid username or password.',
    statusCode: 401
  },

  NOT_FOUND: {
    message: 'Resource not found.',
    statusCode: 404
  }
};
// This ensures that `ApiErrors` cannot be modified after it's defined.
export const ApiErrors = Object.freeze(ErrorDefinitions);

