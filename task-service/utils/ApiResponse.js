/**
 * Standardised JSON response helpers.
 * Every successful response follows the same envelope so clients
 * can rely on a predictable shape.
 */

const sendSuccess = (res, statusCode = 200, message = "Success", data = null, meta = {}) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (Object.keys(meta).length) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = []) => {
  const payload = { success: false, message };
  if (errors.length) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
