import { logger } from '../utils/logger.js';

/**
 * Global Express error handler.
 * Must be registered LAST in app.js — after all routes.
 * Works with express-async-errors — no try/catch needed in controllers.
 *
 * Error shape sent to client:
 * { success: false, error: string, code?: string, details?: [] }
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isProd = process.env.NODE_ENV === 'production';

  // Determine HTTP status
  let status = err.status || err.statusCode || 500;

  // Handle specific known error types
  if (err.name === 'ValidationError') status = 400;       // Mongoose validation
  if (err.name === 'CastError') status = 400;             // Mongoose bad ObjectId
  if (err.name === 'JsonWebTokenError') status = 401;
  if (err.name === 'TokenExpiredError') status = 401;
  if (err.code === 11000) status = 409;                   // Mongoose duplicate key

  // Build client-safe message
  let message = err.message || 'Internal server error';
  let code = err.code || null;

  if (err.name === 'CastError') {
    message = `Invalid value for field: ${err.path}`;
    code = 'INVALID_ID';
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
    code = 'DUPLICATE_KEY';
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token has expired';
    code = 'TOKEN_EXPIRED';
  }

  // In production hide internal 5xx details
  if (isProd && status >= 500) {
    message = 'Internal server error';
    code = 'SERVER_ERROR';
  }

  // Always log the real error server-side
  logger.error({
    status,
    message: err.message,
    code: err.code,
    path: req.path,
    method: req.method,
    stack: isProd ? undefined : err.stack,
  });

  const body = { success: false, error: message };
  if (code) body.code = code;

  return res.status(status).json(body);
}

/**
 * 404 handler — mount BEFORE errorHandler, AFTER all routes.
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
}
