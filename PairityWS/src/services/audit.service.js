import AuditLog from '../models/AuditLog.js';
import { hashSHA256 } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

/** Audit writes must never delay or fail the user-facing operation. */
export function log(action, { userId = null, sessionId = null, ip, userAgent, meta } = {}) {
  try {
    const entry = {
      action,
      userId: userId || null,
      sessionId: sessionId || null,
      ipHash: ip ? hashSHA256(ip) : null,
      userAgent: userAgent ? userAgent.slice(0, 500) : null,
      ...(meta ? { meta } : {}),
    };

    void AuditLog.create(entry).catch((error) => {
      logger.error(`Audit log write failed (${action}): ${error.message}`);
    });
  } catch (error) {
    logger.error(`Audit log preparation failed (${action}): ${error.message}`);
  }
}
