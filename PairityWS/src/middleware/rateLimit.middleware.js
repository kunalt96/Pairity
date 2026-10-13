import rateLimit from 'express-rate-limit';

const json429 = (message) => (_req, res) => {
  res.status(429).json({ success: false, error: message, code: 'RATE_LIMIT_EXCEEDED' });
};

/**
 * OTP requests — very tight.
 * 3 requests per 15 minutes per IP.
 * Protects against OTP spam / brute-force email flooding.
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json429('Too many OTP requests. Please wait 15 minutes and try again.'),
});

/**
 * Auth endpoints (verify-otp, refresh, login).
 * 20 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json429('Too many authentication requests. Please slow down.'),
});

/**
 * General API — applied globally as default.
 * 120 requests per minute per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json429('Too many requests. Please slow down.'),
});

/**
 * Report generation — expensive (AI + PDF + S3).
 * 5 generations per hour per IP.
 */
export const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json429('Too many report generation requests. Try again in an hour.'),
});

/**
 * Website public endpoints (waitlist, contact).
 * 10 requests per hour per IP.
 */
export const websiteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json429('Too many requests from this IP. Try again later.'),
});
