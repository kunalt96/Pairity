/**
 * Standardised API response helpers.
 * All routes use these — consistent shape across every endpoint.
 *
 * Success:  { success: true,  data: {...},  message?: string }
 * Error:    { success: false, error: string, code?: string, details?: [] }
 */

export const ok = (res, data = {}, message = null, status = 200) => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
};

export const created = (res, data = {}, message = null) =>
  ok(res, data, message, 201);

export const accepted = (res, data = {}, message = null) =>
  ok(res, data, message, 202);

export const noContent = (res) => res.status(204).send();

export const badRequest = (
  res,
  message = "Bad request",
  code = null,
  details = [],
) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  if (details.length) body.details = details;
  return res.status(400).json(body);
};

export const unauthorized = (res, message = "Unauthorized", code = null) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return res.status(401).json(body);
};

export const forbidden = (res, message = "Forbidden", code = null) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return res.status(403).json(body);
};

export const notFound = (res, message = "Not found", code = null) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return res.status(404).json(body);
};

export const conflict = (res, message = "Conflict", code = null) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return res.status(409).json(body);
};

export const tooManyRequests = (res, message = "Too many requests") =>
  res.status(429).json({ success: false, error: message });

export const serverError = (
  res,
  message = "Internal server error",
  code = null,
) => {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return res.status(500).json(body);
};
