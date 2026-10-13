import { badRequest } from '../utils/responses.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map(({ path, message }) => ({
      path: path.join('.'),
      message,
    }));
    return badRequest(res, 'Request validation failed', 'VALIDATION_ERROR', details);
  }

  req.body = result.data;
  return next();
};
