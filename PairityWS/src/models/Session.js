import mongoose from 'mongoose';
import {
  DOMAINS,
  PLAN_DOMAINS,
  SESSION_STATUS,
} from '../config/constants.js';

const { Schema, model, Types } = mongoose;

// ── Subdoc: single domain completion entry ─────────────────────────────────
const DomainProgressSchema = new Schema(
  {
    domain: {
      type: String,
      enum: DOMAINS,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ── Subdoc: one partner's overall progress ─────────────────────────────────
const PartnerProgressSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    domainsCompleted: {
      type: [DomainProgressSchema],
      default: [],
    },
    submittedAt: {
      // Set when this partner has finished ALL enabled domains
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

// ── Main schema ────────────────────────────────────────────────────────────
const SessionSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // UUID v4 — generated in the controller before insert, never sequential
    },
    initiatorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    partnerId: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.PENDING_PARTNER,
      index: true,
    },
    plan: {
      type: String,
      enum: ['spark', 'bond', 'align'],
      default: 'spark',
    },
    domainsEnabled: {
      // Derived from plan at creation time, updated on payment upgrade
      type: [{ type: String, enum: DOMAINS }],
      default: PLAN_DOMAINS.spark,
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= DOMAINS.length,
        message: 'domainsEnabled must have 1–7 entries',
      },
    },
    progress: {
      initiator: {
        type: PartnerProgressSchema,
        default: null,
        // Populated when session is created
      },
      partner: {
        type: PartnerProgressSchema,
        default: null,
        // Populated when partner joins
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: auto-deletes sessions that were never completed within 30 days
      index: { expireAfterSeconds: 0 },
    },
    completedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'sessions',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
// "My active sessions" — all sessions a user initiated
SessionSchema.index({ initiatorId: 1, status: 1 });

// "Sessions I joined as partner"
SessionSchema.index({ partnerId: 1, status: 1 });

// ── Virtuals ───────────────────────────────────────────────────────────────

// The full invite URL — consumed by the controller when returning session data
SessionSchema.virtual('inviteUrl').get(function () {
  const base = process.env.APP_URL || 'https://app.pairity.app';
  return `${base}/join/${this.token}`;
});

// ── Instance helpers ───────────────────────────────────────────────────────

// Is a given userId a participant in this session?
SessionSchema.methods.isParticipant = function (userId) {
  const uid = userId.toString();
  return (
    this.initiatorId.toString() === uid ||
    (this.partnerId && this.partnerId.toString() === uid)
  );
};

// Get 'A' or 'B' label for a participant
SessionSchema.methods.getLabelFor = function (userId) {
  if (this.initiatorId.toString() === userId.toString()) return 'A';
  if (this.partnerId && this.partnerId.toString() === userId.toString()) return 'B';
  return null;
};

// Which progress subdoc belongs to a userId?
SessionSchema.methods.getProgressFor = function (userId) {
  const uid = userId.toString();
  if (this.initiatorId.toString() === uid) return this.progress.initiator;
  if (this.partnerId && this.partnerId.toString() === uid) return this.progress.partner;
  return null;
};

// Has this partner completed all enabled domains?
SessionSchema.methods.hasPartnerSubmittedAll = function (userId) {
  const progress = this.getProgressFor(userId);
  if (!progress) return false;
  const completed = progress.domainsCompleted.map((d) => d.domain);
  return this.domainsEnabled.every((d) => completed.includes(d));
};

// Have BOTH partners submitted all domains?
SessionSchema.methods.areBothSubmitted = function () {
  return (
    this.progress.initiator?.submittedAt != null &&
    this.progress.partner?.submittedAt != null
  );
};

export default model('Session', SessionSchema);
