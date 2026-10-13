import { OTP_TYPES, SESSION_STATUS, AUDIT_ACTIONS } from '../config/constants.js';
import OtpCode from '../models/OtpCode.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { generateOtp, storeOtp, verifyOtp } from '../services/otp.service.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../services/jwt.service.js';
import { log } from '../services/audit.service.js';
import { sendOtpEmail } from '../services/email.service.js';
import { accepted, ok, unauthorized } from '../utils/responses.js';

function auditRequest(req, action, userId = null, meta) {
  log(action, {
    userId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    meta,
  });
}

export async function requestOtp(req, res) {
  const { email } = req.body;
  const result = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      includeResultMetadata: true,
    },
  );
  const user = result.value;
  if (!user) throw new Error('Unable to prepare account for OTP request');
  const isNewUser = result.lastErrorObject?.updatedExisting === false;

  auditRequest(req, AUDIT_ACTIONS.USER_OTP_REQUESTED, user?._id, { type: OTP_TYPES.LOGIN });
  if (isNewUser) auditRequest(req, AUDIT_ACTIONS.USER_REGISTER, user._id);

  // Keep the response identical for active, deleted, and newly created accounts.
  if (user.deletedAt == null) {
    const otp = generateOtp();
    await storeOtp(email, otp, OTP_TYPES.LOGIN);
    await sendOtpEmail(email, otp);
  }

  return accepted(res, {}, 'If this email can be used, a verification code will be sent.');
}

export async function verifyOtpRequest(req, res) {
  const { email, otp } = req.body;
  const isValid = await verifyOtp(email, otp, OTP_TYPES.LOGIN);
  if (!isValid) {
    const user = await User.findOne({ email, deletedAt: null }).select('_id');
    auditRequest(req, AUDIT_ACTIONS.USER_LOGIN_FAILED, user?._id, { reason: 'invalid_otp' });
    return unauthorized(res, 'The code is invalid or expired', 'INVALID_OTP');
  }

  const user = await User.findOneAndUpdate(
    { email, deletedAt: null },
    { $set: { isVerified: true } },
    { new: true, runValidators: true },
  );
  if (!user) return unauthorized(res, 'The code is invalid or expired', 'INVALID_OTP');

  auditRequest(req, AUDIT_ACTIONS.USER_LOGIN, user._id);

  return ok(res, {
    user: user.toPublic(),
    accessToken: signAccessToken(user._id),
    refreshToken: signRefreshToken(user._id),
  });
}

export async function refresh(req, res) {
  let payload;
  try {
    payload = verifyRefreshToken(req.body.refreshToken);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Refresh token has expired', 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return unauthorized(res, 'Invalid refresh token', 'INVALID_TOKEN');
    }
    throw error;
  }

  const user = await User.findOne({ _id: payload.sub, deletedAt: null }).select('_id');
  if (!user) return unauthorized(res, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');

  return ok(res, { accessToken: signAccessToken(user._id) });
}

export function logout(req, res) {
  auditRequest(req, AUDIT_ACTIONS.USER_LOGOUT, req.user._id);
  return ok(res, {}, 'Logged out');
}

export function getMe(req, res) {
  return ok(res, { user: req.user.toPublic() });
}

export async function updateMe(req, res) {
  const updates = { ...req.body };
  if (updates.name === '') updates.name = null;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!user) return unauthorized(res, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');
  return ok(res, { user: user.toPublic() });
}

export async function deleteMe(req, res) {
  const deletedAt = new Date();
  await User.updateOne(
    { _id: req.user._id, deletedAt: null },
    { $set: { deletedAt } },
  );
  await Session.updateMany(
    { $or: [{ initiatorId: req.user._id }, { partnerId: req.user._id }] },
    { $set: { status: SESSION_STATUS.DELETED, deletedAt } },
  );

  auditRequest(req, AUDIT_ACTIONS.USER_ACCOUNT_DELETED, req.user._id);
  return ok(res, {}, 'Account deleted');
}

