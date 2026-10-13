import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email().max(254);

export const requestOtpSchema = z.object({
  email: emailSchema,
}).strict();

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
}).strict();

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).max(4096),
}).strict();

const timezoneSchema = z.string().trim().min(1).max(100).refine((timezone) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}, 'Timezone must be a valid IANA timezone');

export const updateMeSchema = z.object({
  name: z.string().trim().max(100).optional(),
  timezone: timezoneSchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: 'Provide at least one field to update',
});
