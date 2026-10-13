import mongoose from 'mongoose';
import { DOMAINS, REPORT_LABELS } from '../config/constants.js';
const { Schema, model, Types } = mongoose;

/**
 * REPORT
 * One document per completed session — strict unique constraint.
 *
 * Stores the full AI JSON output that drives both in-app UI and PDF.
 * The actual PDF file lives in S3 — pdfKey is just the S3 object key.
 *
 * Unlock flow:
 *   isVisible = false until at least one partner calls /unlock
 *   unlockedBy tracks which partners have unlocked
 *   Neither partner can see the report until they unlock it themselves
 */

// ── Subdoc: per-domain analysis result ────────────────────────────────────
const DomainResultSchema = new Schema(
  {
    domain: {
      type: String,
      enum: DOMAINS,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    label: {
      type: String,
      enum: REPORT_LABELS,
      required: true,
    },
    agreements: {
      type: [String],
      default: [],
      // Short strings — areas where both partners clearly aligned
    },
    divergences: {
      type: [String],
      default: [],
      // Short strings — areas where partners differed
    },
    insight: {
      type: String,
      required: true,
      // AI-generated paragraph — constructive, non-judgmental
    },
    isFlagged: {
      type: Boolean,
      default: false,
      // true when score < 55 or critical mismatch detected by AI
    },
  },
  { _id: false }
);

// ── Main schema ────────────────────────────────────────────────────────────
const ReportSchema = new Schema(
  {
    sessionId: {
      type: Types.ObjectId,
      ref: 'Session',
      required: true,
      unique: true, // One report per session — always
      index: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    overallLabel: {
      type: String,
      enum: REPORT_LABELS,
      required: true,
    },
    overallInsight: {
      type: String,
      required: true,
      // 1-2 sentence AI summary of the couple's overall compatibility
    },
    domains: {
      type: [DomainResultSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= DOMAINS.length,
        message: `domains must have between 1 and ${DOMAINS.length} entries`,
      },
    },
    criticalAreas: {
      type: [String],
      default: [],
      // Domain names where isFlagged = true — surfaced prominently in UI
    },
    conversationStarters: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'Maximum 10 conversation starters allowed',
      },
    },
    pdfKey: {
      type: String,
      default: null,
      // S3 object key e.g. "reports/sessionId/compatibility-report.pdf"
      // null until PDF is generated and uploaded
    },
    pdfGeneratedAt: {
      type: Date,
      default: null,
    },
    isVisible: {
      type: Boolean,
      default: false,
      // Set to true when first partner unlocks
    },
    unlockedBy: {
      type: [{ type: Types.ObjectId, ref: 'User' }],
      default: [],
      // Both partners must independently unlock to view
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'reports',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        // Never expose raw S3 key — only pdfReady boolean
        const pdfReady = ret.pdfKey != null;
        delete ret.pdfKey;
        ret.pdfReady = pdfReady;
        return ret;
      },
    },
  }
);

// ── Instance helpers ───────────────────────────────────────────────────────

// Has a specific user unlocked this report?
ReportSchema.methods.isUnlockedBy = function (userId) {
  return this.unlockedBy.some((id) => id.toString() === userId.toString());
};

// Get a domain result by name
ReportSchema.methods.getDomain = function (domainName) {
  return this.domains.find((d) => d.domain === domainName) || null;
};

export default model('Report', ReportSchema);
