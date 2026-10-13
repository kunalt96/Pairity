import { Router } from 'express';
import { authLimiter, otpLimiter } from '../middleware/rateLimit.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  requestOtpSchema,
  verifyOtpSchema,
  refreshSchema,
  updateMeSchema,
} from '../validators/auth.validators.js';
import {
  requestOtp,
  verifyOtpRequest,
  refresh,
  logout,
  getMe,
  updateMe,
  deleteMe,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/request-otp', otpLimiter, validate(requestOtpSchema), requestOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyOtpRequest);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, validate(updateMeSchema), updateMe);
router.delete('/me', requireAuth, deleteMe);

export default router;
