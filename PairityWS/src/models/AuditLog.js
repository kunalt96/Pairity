import mongoose from 'mongoose';
import { AUDIT_ACTIONS_LIST } from '../config/constants.js';
const { Schema, model, Types } = mongoose;

/**
 * AUDIT_LOG
 * Append-only log of all privacy-relevant user actions.
 * Required for DPDP Act 2023 compliance and incident response.
 *
 * Rules:
 * - NEVER update after insert
 * - NEVER store raw IP addresses — SHA-256 hash only
 * - TTL: auto-deleted after 365 days
 * - userId and sessionId may be null (e.g. failed login before user exists)
 */
const AuditLogSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    sessionId: {
      type: Types.ObjectId,
      ref: 'Session',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: AUDIT_ACTIONS_LIST,
    },
    ipHash: {
      type: String,
      default: null,
      // SHA-256 of the raw IP address
      // Allows rate-limit forensics without storing the actual IP
    },
    userAgent: {
      type: String,
      default: null,
      maxlength: 500,
    },
    meta: {
      // Non-PII contextual data only
      // e.g. { plan: 'bond', domain: 'financial', reason: 'max_attempts' }
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
      // TTL: MongoDB auto-deletes this document 365 days after timestamp
      expires: 60 * 60 * 24 * 365,
    },
  },
  {
    // No updatedAt — this document must never be updated after creation
    timestamps: false,
    collection: 'audit_logs',
    strict: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────

// User's full action timeline — for data export requests (DPDP compliance)
AuditLogSchema.index({ userId: 1, timestamp: -1 });

// ── Guard against accidental updates ──────────────────────────────────────
AuditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('AuditLog documents are append-only and cannot be updated');
});

AuditLogSchema.pre('updateOne', function () {
  throw new Error('AuditLog documents are append-only and cannot be updated');
});

AuditLogSchema.pre('updateMany', function () {
  throw new Error('AuditLog documents are append-only and cannot be updated');
});

export default model('AuditLog', AuditLogSchema);
