/**
 * PAIRITY — App-wide constants
 * Single source of truth. Import from here everywhere — never hardcode strings.
 */

// ── Evaluation domains ─────────────────────────────────────────────────────
export const DOMAINS = [
  "financial",
  "parenting",
  "health",
  "career",
  "elderly_care",
  "travel",
  "privacy",
];

// --DEEPER EVALUATION DOMAINS = ─────────────────────────────────────────────────────
export const DEEPER_DOMAINS = ["home", "sprituality", "intimacy", "values"];

// Which domains each plan unlocks
export const PLAN_DOMAINS = {
  spark: ["financial", "parenting", "health"],
  bond: [...DOMAINS], // all 7
  align: [...DOMAINS,...DEEPER_DOMAINS], // all 7
};

// Conversation starters count per plan
export const PLAN_STARTERS = {
  spark: 3,
  bond: 5,
  align: 10,
};

// ── Pricing (paise — never rupees directly) ────────────────────────────────
export const PLAN_PRICES = {
  spark: 0,
  bond: 79900, // ₹799
  align: 179900, // ₹1,799
};

// ── Session status lifecycle ───────────────────────────────────────────────
export const SESSION_STATUS = {
  PENDING_PARTNER: "pending_partner", // created, waiting for partner
  IN_PROGRESS: "in_progress", // both joined, answering
  PENDING_REPORT: "pending_report", // both submitted, AI queued
  COMPLETED: "completed", // report generated
  EXPIRED: "expired", // partner never joined within TTL
  DELETED: "deleted", // initiator cancelled
};

// ── Payment status ─────────────────────────────────────────────────────────
export const PAYMENT_STATUS = {
  CREATED: "created",
  ATTEMPTED: "attempted",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// ── Report labels ──────────────────────────────────────────────────────────
export const REPORT_LABELS = [
  "Strong",
  "Good",
  "Moderate",
  "Needs Attention",
  "Significant Divergence",
];

// Thresholds for auto-labelling a domain score
export const SCORE_THRESHOLDS = {
  STRONG: 80, // >= 80 → Strong
  GOOD: 65, // >= 65 → Good
  MODERATE: 50, // >= 50 → Moderate
  ATTENTION: 35, // >= 35 → Needs Attention
  //  < 35 → Significant Divergence
};

// ── Audit actions ──────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
  // Auth
  USER_REGISTER: "user.register",
  USER_LOGIN: "user.login",
  USER_LOGIN_FAILED: "user.login_failed",
  USER_LOGOUT: "user.logout",
  USER_PASSWORD_RESET_REQUESTED: "user.password_reset_requested",
  USER_EMAIL_VERIFIED: "user.email_verified",
  USER_OTP_REQUESTED: "user.otp_requested",

  // Sessions
  SESSION_CREATED: "session.created",
  SESSION_PARTNER_JOINED: "session.partner_joined",
  SESSION_DOMAIN_COMPLETED: "session.domain_completed",
  SESSION_ALL_SUBMITTED: "session.all_submitted",
  SESSION_DELETED: "session.deleted",

  // Reports
  REPORT_GENERATED: "report.generated",
  REPORT_UNLOCKED: "report.unlocked",
  REPORT_PDF_DOWNLOADED: "report.pdf_downloaded",
  REPORT_SHARE_LINK_CREATED: "report.share_link_created",
  REPORT_DELETED: "report.deleted",

  // Payments
  PAYMENT_INITIATED: "payment.initiated",
  PAYMENT_COMPLETED: "payment.completed",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_REFUNDED: "payment.refunded",

  // Privacy / data
  USER_DATA_EXPORT_REQUESTED: "user.data_export_requested",
  USER_ACCOUNT_DELETED: "user.account_deleted",
  RESPONSE_OPENTEXT_PURGED: "response.opentext_purged",
};

// Flat array version — used in Mongoose enum validation
export const AUDIT_ACTIONS_LIST = Object.values(AUDIT_ACTIONS);

// ── OTP types ──────────────────────────────────────────────────────────────
export const OTP_TYPES = {
  LOGIN: "login",
  VERIFY_EMAIL: "verify_email",
};

// ── Partner labels ─────────────────────────────────────────────────────────
export const PARTNER_LABELS = {
  A: "A", // always the initiator
  B: "B", // always the one who joined
};

// ── Session TTL ────────────────────────────────────────────────────────────
export const SESSION_TTL_DAYS = 30;

// ── Misc ───────────────────────────────────────────────────────────────────
export const REPORT_PDF_PRESIGN_EXPIRY = 3600; // seconds — 1 hour
