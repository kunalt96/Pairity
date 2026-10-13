import "express-async-errors"; // Must be first — patches async error propagation
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { corsMiddleware } from "./middleware/cors.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";

// ── Route imports ─────────────────────────────────────────────────────────
// import sessionRoutes  from './routes/session.routes.js';
// import responseRoutes from './routes/response.routes.js';
// import reportRoutes   from './routes/report.routes.js';
// import paymentRoutes  from './routes/payment.routes.js';
// import websiteRoutes  from './routes/website.routes.js';

const app = express();

// ── Trust proxy (Railway / Render sit behind a reverse proxy) ─────────────
app.set("trust proxy", 1);

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(corsMiddleware);

// ── HTTP request logging ───────────────────────────────────────────────────
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (_req, res) =>
      res.statusCode < 400 && process.env.NODE_ENV === "production",
  }),
);

// ── Body parsers ───────────────────────────────────────────────────────────
// NOTE: Razorpay webhook route needs raw body — handled in payment.routes.js
// with express.raw() BEFORE this json parser mounts for that specific path.
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Global rate limit ──────────────────────────────────────────────────────
app.use("/api/", apiLimiter);

// ── Health check (no auth, no rate limit) ─────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "pairity-api",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes (mount as phases complete) ─────────────────────────────────
app.use('/api/auth', authRoutes);
// app.use('/api/sessions',  sessionRoutes);
// app.use('/api/responses', responseRoutes);
// app.use('/api/reports',   reportRoutes);
// app.use('/api/payments',  paymentRoutes);
// app.use('/api/website',   websiteRoutes);

// ── 404 — must come after all routes ──────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler — must be last ───────────────────────────────────
app.use(errorHandler);

export default app;
