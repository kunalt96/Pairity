import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY env variable is not set");
  return Buffer.from(key, "hex"); // must be 32 bytes = 64 hex chars
}

/**
 * Encrypt a plaintext string.
 * Returns: "ivHex:encryptedHex"
 */
export function encrypt(plainText) {
  const iv = crypto.randomBytes(Number(process.env.ENCRYPTION_IV_LENGTH) || 16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypt a string previously encrypted with encrypt().
 * Expects: "ivHex:encryptedHex"
 */
export function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
}

/**
 * One-way SHA-256 hash — used for IP addresses in audit logs.
 * Never reversible. Never store raw IPs.
 */
export function hashSHA256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
