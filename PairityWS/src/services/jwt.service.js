import jwt from 'jsonwebtoken';

const ISSUER = 'pairity-api';
const ACCESS_AUDIENCE = 'pairity-app';
const REFRESH_AUDIENCE = 'pairity-refresh';

function getSecret(name) {
  const secret = process.env[name];
  if (!secret || secret.length < 32) {
    throw new Error(`${name} must be configured with at least 32 characters`);
  }
  return secret;
}

function signToken(userId, secretName, expiresIn, audience) {
  return jwt.sign({}, getSecret(secretName), {
    algorithm: 'HS256',
    subject: userId.toString(),
    issuer: ISSUER,
    audience,
    expiresIn,
  });
}

function verifyToken(token, secretName, audience) {
  return jwt.verify(token, getSecret(secretName), {
    algorithms: ['HS256'],
    issuer: ISSUER,
    audience,
  });
}

export const signAccessToken = (userId) =>
  signToken(userId, 'JWT_ACCESS_SECRET', '7d', ACCESS_AUDIENCE);

export const signRefreshToken = (userId) =>
  signToken(userId, 'JWT_REFRESH_SECRET', '30d', REFRESH_AUDIENCE);

export const verifyAccessToken = (token) =>
  verifyToken(token, 'JWT_ACCESS_SECRET', ACCESS_AUDIENCE);

export const verifyRefreshToken = (token) =>
  verifyToken(token, 'JWT_REFRESH_SECRET', REFRESH_AUDIENCE);
