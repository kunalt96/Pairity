import mongoose from 'mongoose';
import { DOMAINS, PARTNER_LABELS } from '../config/constants.js';
const { Schema, model, Types } = mongoose;

/**
 * RESPONSE
 * One document per question answered by a partner.
 * For 7 domains × ~8 questions × 2 partners = ~112 docs per completed session.
 *
 * PRIVACY RULES enforced at schema level:
 * - openText stored as AES-256 ciphertext — encrypted before insert in the controller
 * - openText has select:false — NEVER returned in any list query accidentally
 * - openText is purged (set to null) after report generation
 * - partnerLabel is always 'A' or 'B' — real names never stored here
 */
const ResponseSchema = new Schema(
  {
    sessionId: {
      type: Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      // Stored for audit/deletion only — never included in AI prompts
    },
    partnerLabel: {
      type: String,
      enum: Object.values(PARTNER_LABELS),
      required: true,
      // 'A' = initiator, 'B' = partner who joined
    },
    domain: {
      type: String,
      enum: DOMAINS,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
      trim: true,
      // e.g. "F1", "C3", "CA2" — matches question bank in PRD
    },
    questionType: {
      type: String,
      enum: ['likert', 'open_ended'],
      required: true,
    },
    scale: {
      // 1 (Strongly Disagree) → 5 (Strongly Agree)
      // null for open_ended questions
      type: Number,
      min: [1, 'Scale must be between 1 and 5'],
      max: [5, 'Scale must be between 1 and 5'],
      default: null,
    },
    openText: {
      // AES-256-CBC encrypted string: "ivHex:encryptedHex"
      // Purged to null after report generation
      type: String,
      default: null,
      select: false, // NEVER returned unless explicitly projected with +openText
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'responses',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.openText; // extra safety — never leak ciphertext in JSON
        return ret;
      },
    },
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────

// Report generator fetches all responses for a session grouped by domain
ResponseSchema.index({ sessionId: 1, domain: 1 });

// Progress check: has this user answered this domain in this session?
ResponseSchema.index({ sessionId: 1, userId: 1, domain: 1 });

// Prevent duplicate answers: one answer per question per user per session
ResponseSchema.index(
  { sessionId: 1, userId: 1, questionId: 1 },
  { unique: true }
);

// ── Validation ─────────────────────────────────────────────────────────────
ResponseSchema.pre('save', function (next) {
  if (this.questionType === 'likert' && this.scale == null) {
    return next(new Error('scale is required for likert questions'));
  }
  if (this.questionType === 'open_ended' && !this.openText) {
    return next(new Error('openText is required for open_ended questions'));
  }
  next();
});

export default model('Response', ResponseSchema);
