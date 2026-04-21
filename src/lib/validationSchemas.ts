import { z } from 'zod';
import { ERROR_MESSAGES } from '../config/constants';

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
  password: z
    .string()
    .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(/[A-Z]/, ERROR_MESSAGES.PASSWORD_UPPERCASE)
    .regex(/[a-z]/, ERROR_MESSAGES.PASSWORD_LOWERCASE)
    .regex(/[0-9]/, ERROR_MESSAGES.PASSWORD_NUMBER)
    .regex(/[^A-Za-z0-9]/, ERROR_MESSAGES.PASSWORD_SPECIAL),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Signup ───────────────────────────────────────────────────────────────────

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, ERROR_MESSAGES.FULL_NAME_REQUIRED)
      .min(2, ERROR_MESSAGES.NAME_MIN_LENGTH)
      .max(50, ERROR_MESSAGES.NAME_MAX_LENGTH)
      .regex(
        /^[a-zA-Z\s'-]+$/,
        ERROR_MESSAGES.NAME_INVALID_CHARS,
      ),
    email: z
      .string()
      .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
      .email(ERROR_MESSAGES.INVALID_EMAIL),
    password: z
      .string()
      .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
      .min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(/[A-Z]/, ERROR_MESSAGES.PASSWORD_UPPERCASE)
      .regex(/[a-z]/, ERROR_MESSAGES.PASSWORD_LOWERCASE)
      .regex(/[0-9]/, ERROR_MESSAGES.PASSWORD_NUMBER)
      .regex(/[^A-Za-z0-9]/, ERROR_MESSAGES.PASSWORD_SPECIAL),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_MUST_MATCH,
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
      .min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(/[A-Z]/, ERROR_MESSAGES.PASSWORD_UPPERCASE)
      .regex(/[a-z]/, ERROR_MESSAGES.PASSWORD_LOWERCASE)
      .regex(/[0-9]/, ERROR_MESSAGES.PASSWORD_NUMBER)
      .regex(/[^A-Za-z0-9]/, ERROR_MESSAGES.PASSWORD_SPECIAL),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_MUST_MATCH,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
