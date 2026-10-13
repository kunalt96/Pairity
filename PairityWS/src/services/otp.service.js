import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import OtpCode from '../models/OtpCode.js';
import { OTP_TYPES } from '../config/constants.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const BCRYPT_ROUNDS = 12;

export function generateOtp() {
  return crypto.randomInt(100_000, 1_000_000).toString();
}

export async function storeOtp(email, plain, type = OTP_TYPES.LOGIN) {
  const normalizedEmail = email.trim().toLowerCase();

  await OtpCode.deleteMany({ email: normalizedEmail, type });

  const code = await bcrypt.hash(plain, BCRYPT_ROUNDS);
  return OtpCode.create({
    email: normalizedEmail,
    code,
    type,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });
}

export async function verifyOtp(email, plain, type = OTP_TYPES.LOGIN) {
  const now = new Date();
  const otp = await OtpCode.findOneAndUpdate(
    {
      email: email.trim().toLowerCase(),
      type,
      verified: false,
      expiresAt: { $gt: now },
      attempts: { $lt: MAX_ATTEMPTS },
    },
    { $inc: { attempts: 1 } },
    { new: true, sort: { createdAt: -1 } },
  ).select('+code');

  if (!otp || !(await bcrypt.compare(plain, otp.code))) return false;

  // Only one concurrent request can consume a particular OTP attempt.
  const consumed = await OtpCode.findOneAndUpdate(
    { _id: otp._id, verified: false, attempts: otp.attempts },
    { $set: { verified: true } },
    { new: true },
  );

  return Boolean(consumed);
}
