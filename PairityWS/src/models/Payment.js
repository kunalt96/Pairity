import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../config/constants.js';
const { Schema, model, Types } = mongoose;

/**
 * PAYMENT
 * One document per payment attempt — including failed/abandoned ones.
 * Gives a full audit trail for every checkout initiated.
 *
 * Amounts always stored in smallest currency unit:
 *   INR → paise   (₹799 = 79900 paise)
 *   USD → cents   ($7.99 = 799 cents)
 *
 * Never store rupees/dollars directly — avoids floating-point errors.
 *
 * webhookVerified must be true before upgrading session plan.
 * The verify endpoint and the webhook handler both set this — whichever
 * arrives first wins (idempotent).
 */
const PaymentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ['razorpay', 'stripe'],
      required: true,
      default: 'razorpay',
    },
    providerOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // Razorpay: order_xxx  |  Stripe: pi_xxx
      // Used for idempotency checks in webhook handler
    },
    providerPaymentId: {
      type: String,
      default: null,
      // Populated on successful payment
      // Razorpay: pay_xxx  |  Stripe: ch_xxx
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },
    amountSmallestUnit: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
      // Paise for INR, cents for USD
    },
    currency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'INR',
    },
    plan: {
      type: String,
      enum: ['spark', 'bond', 'align'],
      required: true,
      // The plan tier this payment is for
    },
    webhookVerified: {
      type: Boolean,
      default: false,
      // MUST be true before session.plan is upgraded
      // Set by webhook handler after signature verification
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    meta: {
      // Raw provider response snapshot — for debugging and reconciliation
      type: Schema.Types.Mixed,
      select: false,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'payments',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.meta; // Never expose raw webhook payloads
        return ret;
      },
    },
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────

// "Has this session been paid for?"
PaymentSchema.index({ sessionId: 1, status: 1 });

// "My payment history" — user's payments newest first
PaymentSchema.index({ userId: 1, createdAt: -1 });

// ── Virtual: human-readable amount ────────────────────────────────────────
PaymentSchema.virtual('amountReadable').get(function () {
  const divisor = this.currency === 'INR' ? 100 : 100;
  const symbol  = this.currency === 'INR' ? '₹' : '$';
  return `${symbol}${(this.amountSmallestUnit / divisor).toFixed(2)}`;
});

export default model('Payment', PaymentSchema);
