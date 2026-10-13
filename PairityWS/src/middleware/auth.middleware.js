import User from '../models/User.js';
import { verifyAccessToken } from '../services/jwt.service.js';
import { unauthorized } from '../utils/responses.js';

export async function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) return unauthorized(res, 'Authentication required', 'AUTH_REQUIRED');

  let payload;
  try {
    payload = verifyAccessToken(match[1]);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Access token has expired', 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return unauthorized(res, 'Invalid access token', 'INVALID_TOKEN');
    }
    return next(error);
  }

  if (!payload.sub) return unauthorized(res, 'Invalid access token', 'INVALID_TOKEN');

  const user = await User.findOne({ _id: payload.sub, deletedAt: null });
  if (!user) return unauthorized(res, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');

  req.user = user;
  return next();
}
