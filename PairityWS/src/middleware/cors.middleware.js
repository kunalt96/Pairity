import cors from 'cors';
import { logger } from '../utils/logger.js';

const buildAllowedOrigins = () => {
  const origins = [
    process.env.CORS_ORIGIN_WEBSITE, // https://pairity.app
    process.env.CORS_ORIGIN_APP,     // https://app.pairity.app
  ].filter(Boolean); // drop undefined in case env vars aren't set yet

  // Always allow localhost in non-production
  if (process.env.NODE_ENV !== 'production') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    );
  }

  return origins;
};

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = buildAllowedOrigins();

    // Allow server-to-server requests (no Origin header — e.g. Razorpay webhooks, Postman)
    if (!origin) return callback(null, true);

    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`CORS blocked request from origin: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // preflight cache 24h
});
