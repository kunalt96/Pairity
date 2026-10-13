import mongoose from 'mongoose';
import { OTP_TYPES } from '../config/constants.js';
const { Schema, model } = mongoose;

/**
 * OTP_CODE
 * One document per OTP request.
 * The TTL index on expiresAt auto-deletes documents after they expire —
 * no manual cleanup needed.
 *
 * The code field stores a bcrypt hash — never the plain OTP.
 * Raw OTPs are never logged or stored anywhere.
 */
const OtpCodeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      select: false,
      // bcrypt hash of the 6-digit plain OTP
      // otp.service explicitly selects it when verifying a submitted code
    },
    type: {
      type: String,
      enum: Object.values(OTP_TYPES),
      required: true,
      default: OTP_TYPES.LOGIN,
    },
    attempts: {
      type: Number,
      default: 0,
      max: [10, 'Attempt count exceeded safety limit'], // hard cap
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: MongoDB auto-deletes this doc when expiresAt is in the past
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
    collection: 'otp_codes',
  }
);

// Fast lookup: find active OTP for an email + type
OtpCodeSchema.index({ email: 1, type: 1, verified: 1 });

export default model('OtpCode', OtpCodeSchema);
