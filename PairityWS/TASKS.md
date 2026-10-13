# Pairity Backend — Full Build Task List
> `pairity_ws` · Express · Node 20 · MongoDB Atlas

Track every task here. Status: ✅ Done · 🔨 In progress · ⬜ Not started

---

## PHASE 1 — Foundation
> Server boots, connects to DB, health check works. Nothing else.

- [x] `package.json` — all dependencies declared
- [x] `.env.example` — all keys documented
- [x] `.gitignore`
- [x] `src/utils/logger.js` — Winston (dev pretty / prod JSON)
- [x] `src/utils/responses.js` — standardised ok/created/badRequest/... helpers
- [x] `src/utils/crypto.js` — AES-256-CBC encrypt/decrypt + SHA-256 hash for IPs
- [x] `src/config/db.js` — MongoDB Atlas connect/disconnect with reconnect logic
- [ ] `src/config/constants.js` — DOMAINS enum, PLAN_DOMAINS map, AUDIT_ACTIONS enum
- [ ] `src/middleware/cors.middleware.js` — allowlist: pairity.app + app.pairity.app + localhost
- [ ] `src/middleware/error.middleware.js` — global Express error handler (4xx/5xx, hide stack in prod)
- [ ] `src/middleware/rateLimit.middleware.js` — otpLimiter / authLimiter / apiLimiter / reportLimiter
- [ ] `src/app.js` — Express setup: helmet, cors, morgan, json body limit, routes mount, error handler
- [ ] `src/server.js` — listen + connectDB, graceful shutdown on SIGTERM/SIGINT
- [ ] **CHECKPOINT** `GET /health` returns `{ status: 'ok', env, timestamp }`

---

## PHASE 2 — Models
> All Mongoose schemas created with correct indexes and field-level options.

- [ ] `src/models/User.js`
      email (unique, lowercase), name (optional), plan enum,
      timezone, isVerified, deletedAt (soft delete)
      Index: email+deletedAt

- [ ] `src/models/OtpCode.js`
      email, code (bcrypt hash), type enum (login/verify_email),
      attempts, verified, expiresAt (TTL index → auto-delete)

- [ ] `src/models/Session.js`
      token (UUID, unique), initiatorId, partnerId (null until joined),
      status enum (7 states), plan, domainsEnabled[],
      progress.initiator / progress.partner subdocs,
      expiresAt (TTL 30 days), completedAt, deletedAt
      Indexes: token, initiatorId+status, partnerId+status

- [ ] `src/models/Response.js`
      sessionId, userId, partnerLabel (A/B), domain, questionId,
      questionType (likert/open_ended), scale (1-5), openText (encrypted, select:false)
      Indexes: sessionId+domain, sessionId+userId+domain
      Unique: sessionId+userId+questionId

- [ ] `src/models/Report.js`
      sessionId (unique), overallScore, overallLabel, overallInsight,
      domains[] (DomainResultSchema subdoc), criticalAreas[],
      conversationStarters[], pdfKey, pdfGeneratedAt,
      isVisible, unlockedBy[]

- [ ] `src/models/Payment.js`
      userId, sessionId, provider enum (razorpay/stripe),
      providerOrderId (unique), providerPaymentId,
      status enum (5 states), amountSmallestUnit (paise),
      currency, plan, webhookVerified, paidAt, meta (select:false)

- [ ] `src/models/AuditLog.js`
      userId, sessionId, action (enum of all audit actions),
      ipHash, userAgent, meta
      timestamp (TTL 365 days, index)
      Append-only — no updates ever

- [ ] **CHECKPOINT** All models import cleanly. Run a test insert for each. Atlas shows all indexes created.

---

## PHASE 3 — Auth System
> OTP login → JWT issued → protected routes work.

### Services
- [x] `src/services/otp.service.js`
      `generateOtp()` — crypto.randomInt 6-digit
      `storeOtp(email, plain, type)` — delete old → bcrypt hash → insert with TTL
      `verifyOtp(email, plain, type)` — find active → increment attempts → bcrypt.compare → mark verified

- [x] `src/services/jwt.service.js`
      `signAccessToken(userId)` — 7d expiry
      `signRefreshToken(userId)` — 30d expiry
      `verifyAccessToken(token)`
      `verifyRefreshToken(token)`

- [x] `src/services/audit.service.js`
      `log(action, { userId, sessionId, ip, userAgent, meta })` — fire-and-forget, never throws

- [x] `src/services/email.service.js`  ← OTP email only at this phase
      `sendOtpEmail(email, otp)` — Resend SDK, inline HTML template

### Middleware
- [x] `src/middleware/auth.middleware.js`
      `requireAuth` — extract Bearer token → verifyAccessToken → attach req.user
      Handle TokenExpiredError → 401 with code TOKEN_EXPIRED

### Zod Schemas
- [x] `src/validators/auth.validators.js`
      requestOtpSchema, verifyOtpSchema, refreshSchema, updateMeSchema

### Controller + Routes
- [x] `src/controllers/auth.controller.js`
      `requestOtp` — validate → upsert User → generateOtp → storeOtp → sendOtpEmail → log audit
      `verifyOtp` — validate → verifyOtp service → upsert isVerified → sign tokens → log audit
      `refresh` — verifyRefreshToken → sign new accessToken
      `logout` — log audit → 200
      `getMe` — return req.user
      `updateMe` — patch name/timezone
      `deleteMe` — soft delete user + all sessions → log audit

- [x] `src/routes/auth.routes.js`
      POST /request-otp (otpLimiter + validate)
      POST /verify-otp (authLimiter + validate)
      POST /refresh (validate)
      POST /logout (requireAuth)
      GET  /me (requireAuth)
      PATCH /me (requireAuth + validate)
      DELETE /me (requireAuth)

- [ ] **CHECKPOINT** Full OTP login flow works end-to-end via Postman.
      Token in → protected GET /api/auth/me → returns user ✓

---

## PHASE 4 — Sessions
> Partner A creates. Partner B joins via token. Status lifecycle works.

### Email
- [ ] `email.service.js` — add `sendSessionInvite(toEmail, inviteUrl, initiatorName)`

### Zod Schemas
- [ ] `src/validators/session.validators.js`

### Controller + Routes
- [ ] `src/controllers/session.controller.js`
      `createSession`
        → check user has no active pending_partner session (max 1 active free)
        → generate UUID token
        → set domainsEnabled based on plan
        → set expiresAt = now + 30d
        → init progress.initiator
        → log audit: session.created

      `getMySessions` — find all sessions where initiatorId or partnerId = req.user._id

      `getSessionById` — verify req.user is initiator or partner → return session (no responses)

      `joinSession`
        → find session by token
        → validate: not expired, status=pending_partner, partnerId=null
        → forbid: req.user._id === initiatorId (can't join own session)
        → set partnerId, status=in_progress, init progress.partner
        → log audit: session.partner_joined

      `cancelSession`
        → only initiator can cancel
        → set status=deleted, deletedAt=now
        → log audit: session.deleted

      `getSessionProgress`
        → return progress object (which domains each partner completed)
        → NEVER return any response answers

- [ ] `src/routes/session.routes.js`
      POST   /             (requireAuth + validate)
      GET    /             (requireAuth)
      GET    /:id          (requireAuth)
      POST   /join/:token  (requireAuth)
      PATCH  /:id/cancel   (requireAuth)
      GET    /:id/progress (requireAuth)

- [ ] **CHECKPOINT** Create session → get inviteUrl → second user joins → status = in_progress ✓

---

## PHASE 5 — Responses
> Both partners answer questions. Open text encrypted. Progress tracked.

### Zod Schemas
- [ ] `src/validators/response.validators.js`
      submitDomainSchema — domain enum, answers[] with per-type validation

### Controller + Routes
- [ ] `src/controllers/response.controller.js`
      `submitDomain`
        → verify session exists + user is a participant
        → verify session status = in_progress
        → verify domain is in session.domainsEnabled
        → verify domain not already submitted by this user
        → for each answer:
            - if open_ended: encrypt(openText) before save
            - upsert by { sessionId, userId, questionId }
        → update session.progress.[initiator|partner].domainsCompleted
        → if both partners done ALL enabled domains:
            set session.status = pending_report
        → log audit: session.domain_completed
        → return { domainsCompleted, sessionStatus }

      `getMyProgress`
        → return only THIS user's completed domains for the session
        → never return partner's progress breakdown

- [ ] `src/routes/response.routes.js`
      POST /api/responses/:sessionId  (requireAuth + validate)
      GET  /api/responses/:sessionId/progress (requireAuth)

- [ ] **CHECKPOINT** Both users submit all domains → session.status = pending_report ✓
      Verify openText is encrypted in Atlas (should look like "abc123:def456") ✓

---

## PHASE 6 — Payments
> Razorpay order created. Signature verified. Session plan upgrades.

### Service
- [ ] `src/services/payment.service.js`
      `PLAN_PRICES` — { spark:0, bond:79900, align:179900 } (paise)
      `createOrder(plan, sessionId, userId)` — Razorpay order
      `verifyPaymentSignature(orderId, paymentId, signature)` — HMAC-SHA256
      `verifyWebhookSignature(rawBody, signature)` — webhook guard

### Zod Schemas
- [ ] `src/validators/payment.validators.js`

### Controller + Routes
- [ ] `src/controllers/payment.controller.js`
      `createOrder`
        → validate plan is not 'spark' (free, no payment)
        → check session belongs to req.user
        → create Razorpay order
        → save Payment doc (status: created)
        → log audit: payment.initiated
        → return { orderId, amount, currency, keyId }

      `verifyPayment`
        → verifyPaymentSignature
        → update Payment: status=paid, providerPaymentId, webhookVerified=true, paidAt
        → update Session: plan, domainsEnabled (all 7), status stays as-is
        → update User: plan if this is higher tier
        → log audit: payment.completed
        → return { success: true, session }

      `razorpayWebhook`
        → raw body needed (express.raw middleware on this route)
        → verifyWebhookSignature — reject if invalid
        → handle payment.captured event only
        → idempotent: skip if Payment already webhookVerified
        → same upgrades as verifyPayment

      `getPaymentHistory` — req.user's payments, newest first

- [ ] `src/routes/payment.routes.js`
      POST /api/payments/create-order  (requireAuth + validate)
      POST /api/payments/verify        (requireAuth + validate)
      POST /api/payments/webhook       (express.raw — NO requireAuth, NO json parser)
      GET  /api/payments/history       (requireAuth)

- [ ] **CHECKPOINT** Test mode: create order → Razorpay test checkout → verify → session.plan = 'bond' ✓

---

## PHASE 7 — Reports (structure only, no AI yet)
> Report skeleton, unlock flow, PDF placeholder. AI fills in later.

### Service stubs (empty — filled in Phase 9)
- [ ] `src/services/ai.service.js` — export `synthesiseReport()` that throws `NOT_IMPLEMENTED`
- [ ] `src/services/pdf.service.js` — export `generateReportPdf()` that throws `NOT_IMPLEMENTED`
- [ ] `src/services/s3.service.js` — `uploadPdf()` and `getPresignedDownloadUrl()` — real S3 code, but only called once AI/PDF work

### Controller + Routes
- [ ] `src/controllers/report.controller.js`
      `generateReport`
        → verify session.status = pending_report
        → verify req.user is initiator or partner
        → return 503 SERVICE_UNAVAILABLE with message "AI synthesis not yet enabled"
        → (Phase 9 replaces this with real call)

      `getReport`
        → verify session participant
        → verify report exists
        → verify req.user._id in report.unlockedBy → else 403 REPORT_LOCKED
        → return full report object (no pdfKey exposed, only pdfReady: bool)

      `unlockReport`
        → add req.user._id to report.unlockedBy if not already there
        → log audit: report.unlocked
        → return { isVisible: true }

      `getPdfUrl`
        → verify report.pdfKey exists
        → verify req.user in unlockedBy
        → call s3.service.getPresignedDownloadUrl(pdfKey, 3600)
        → log audit: report.pdf_downloaded
        → return { url, expiresIn: 3600 }

      `deleteReport`
        → only for initiator
        → set all response.openText = null for this session → log audit: response.opentext_purged
        → delete Report doc
        → delete PDF from S3 if pdfKey exists
        → log audit: report.deleted

- [ ] `src/routes/report.routes.js`
      POST   /api/reports/:sessionId/generate  (requireAuth + reportLimiter)
      GET    /api/reports/:sessionId           (requireAuth)
      POST   /api/reports/:sessionId/unlock    (requireAuth)
      GET    /api/reports/:sessionId/pdf       (requireAuth)
      DELETE /api/reports/:sessionId           (requireAuth)

- [ ] **CHECKPOINT** Unlock flow works. GET /report returns 403 before unlock, 200 after ✓

---

## PHASE 8 — Website Routes + Waitlist
> Static marketing site can hit the API. Waitlist + contact form.

- [ ] `src/models/Waitlist.js`
      email (unique), plan (which plan they clicked), source, createdAt

- [ ] `src/controllers/website.controller.js`
      `joinWaitlist` — upsert by email, ignore duplicate
      `contactForm` — validate + send email to Kunal via Resend
      `getPricing` — return PLAN_PRICES object (so website prices are API-driven)

- [ ] `src/routes/website.routes.js`
      POST /api/website/waitlist  (apiLimiter + validate)
      POST /api/website/contact   (apiLimiter + validate)
      GET  /api/website/pricing   (public, no auth)

- [ ] `email.service.js` — add `sendContactNotification()` and `sendWaitlistConfirmation()`

- [ ] **CHECKPOINT** POST /api/website/waitlist from pairity.app domain (test CORS) → email arrives ✓

---

## PHASE 9 — AI + PDF + S3 (last)
> Replace the Phase 7 stubs with real implementations.

### S3 (implement first — needed by PDF)
- [ ] `src/config/s3.js` — AWS S3Client setup
- [ ] `src/services/s3.service.js` — fill in `uploadPdf()` and `getPresignedDownloadUrl()`
- [ ] **CHECKPOINT** Upload a test buffer to S3 → get presigned URL → download works ✓

### AI
- [ ] `src/services/ai.service.js` — fill in `synthesiseReport(partnerAResponses, partnerBResponses, domains)`
      System prompt: neutral counsellor, no real names, JSON-only output
      `buildReportPrompt()` — assembles anonymised Partner A/B payload
      Parse + validate JSON response against expected schema
      Retry once on JSON parse failure

- [ ] **CHECKPOINT** Pass mock Partner A + B response arrays → get valid report JSON back ✓

### PDF
- [ ] `src/services/pdf.service.js` — fill in `generateReportPdf(reportData, sessionData)`
      Puppeteer → A4 → inline CSS → no external resources
      Returns Buffer

- [ ] **CHECKPOINT** Call with mock report data → PDF buffer → save locally → open and verify layout ✓

### Wire it all together
- [ ] `src/controllers/report.controller.js` — replace `generateReport` stub:
      1. Fetch all responses for session (decrypt openText)
      2. Split into partnerA / partnerB arrays by partnerLabel
      3. Call `ai.service.synthesiseReport()`
      4. Save Report doc
      5. Call `pdf.service.generateReportPdf()`
      6. Call `s3.service.uploadPdf()` → save pdfKey to Report
      7. Purge all openText → log audit: response.opentext_purged
      8. Set session.status = completed
      9. Send "report ready" email to both partners
      10. Return 200 with report

- [ ] **CHECKPOINT** Full end-to-end: two users answer all domains → generate → report in DB → PDF in S3 → both unlock → download ✓

---

## PHASE 10 — Hardening (before first deploy)

- [ ] All Zod validators cover every route — no unvalidated input reaches controllers
- [ ] `express-async-errors` imported at top of `app.js` — no try/catch needed in controllers
- [ ] All `console.log` replaced with `logger.*`
- [ ] Razorpay webhook uses `express.raw()` not `express.json()` on that route
- [ ] `.env` confirmed in `.gitignore` — run `git status` to verify
- [ ] All rate limiters applied (otpLimiter on /request-otp, apiLimiter everywhere else)
- [ ] `express.json({ limit: '10kb' })` — body size cap
- [ ] `app.set('trust proxy', 1)` — for Railway/Render IP accuracy
- [ ] `helmet()` applied before all routes
- [ ] CORS allowlist confirmed — no wildcard `*` in production
- [ ] `select: false` on OtpCode.code and Response.openText — verified in queries
- [ ] MongoDB Atlas Network Access locked to server IP after Railway deploy
- [ ] `NODE_ENV=production` set in Railway — stack traces hidden from API responses
- [ ] Health check endpoint returns 200 from Railway URL

---

## Build order summary

```
Phase 1  →  Foundation + server boots           [PARTIAL — utils + db done]
Phase 2  →  All 7 Mongoose models
Phase 3  →  OTP auth + JWT + protected routes
Phase 4  →  Sessions (create, join, lifecycle)
Phase 5  →  Responses (submit, encrypt, progress)
Phase 6  →  Payments (Razorpay)
Phase 7  →  Reports skeleton (no AI yet)
Phase 8  →  Website routes + waitlist
Phase 9  →  AI + PDF + S3 (last)
Phase 10 →  Hardening + deploy
```

---

## Files already created

```
pairity_ws/
├── .env.example          ✅
├── .gitignore            ✅
├── package.json          ✅
├── src/
│   ├── config/
│   │   └── db.js         ✅
│   └── utils/
│       ├── crypto.js     ✅
│       ├── logger.js     ✅
│       └── responses.js  ✅
```

---

*Last updated: October 2026 · pairity_ws build tracker*
