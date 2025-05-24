import ApiErrorObject from "../models/apiError.model.js";


export class ApiError extends Error {
  public readonly error: ApiErrorObject;

  constructor(apiErrorObject: ApiErrorObject, originalError?: Error) {
    super(apiErrorObject.message);
    this.name = 'ApiError';

    this.error = apiErrorObject;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}