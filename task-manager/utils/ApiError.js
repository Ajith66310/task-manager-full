/**
 * Custom operational error with an HTTP status code.
 * Distinguishes "expected" API errors from unexpected programming errors.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;         // validation error details array
    this.isOperational = true;    // flag so the global handler knows it's safe to expose
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
