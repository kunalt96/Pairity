import "dotenv/config";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5001;

async function start() {
  // Connect to MongoDB Atlas first — fail hard if it can't connect
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`✓ Pairity API running → http://localhost:${PORT}`);
    logger.info(`  ENV: ${process.env.NODE_ENV || "development"}`);
    logger.info(`  Health: http://localhost:${PORT}/health`);
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────
  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      logger.info("HTTP server closed");
      await disconnectDB();
      logger.info("MongoDB disconnected — goodbye");
      process.exit(0);
    });

    // Force kill after 10s if something hangs
    setTimeout(() => {
      logger.error("Graceful shutdown timed out — forcing exit");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM")); // Railway/Render send this
  process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in dev

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });
}

start();
