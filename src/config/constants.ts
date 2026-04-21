export const ERROR_MESSAGES = {
  // Auth Errors
  LOGIN_FAILED: 'Something went wrong. Please try again.',
  SIGNUP_FAILED: 'Registration failed. Please check your details.',
  FORGOT_PASSWORD_FAILED: 'Could not send reset link. Please try again.',
  RESET_PASSWORD_FAILED: 'Failed to reset password. The link may be expired.',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token.',
  
  // Validation Errors
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORD_SPECIAL: 'Password must contain at least one special character',
  
  FULL_NAME_REQUIRED: 'Full name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',
  NAME_MAX_LENGTH: 'Name must be under 50 characters',
  NAME_INVALID_CHARS: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PASSWORDS_MUST_MATCH: "Passwords don't match",
  GENERIC_ERROR: 'Something went wrong',
  VALIDATION_REQUIREMENTS_NOT_MET: 'Please fulfill all the requirements.',

  INTEREST_REQUIRED: 'Please select at least one interest.',
  INTEREST_FAILED: 'Failed to save interests. Please try again.',
} as const;

export const UI_STRINGS = {
  // Password Validation Labels
  PASSWORD_CHECK_NUMBER: 'Must contain at least one number',
  PASSWORD_CHECK_LOWERCASE: 'Must contain at least one lowercase letter',
  PASSWORD_CHECK_UPPERCASE: 'Must contain at least one uppercase letter',
  PASSWORD_CHECK_SPECIAL: 'Must contain at least one special character',
  PASSWORD_CHECK_LENGTH: 'Length must be at least 8 characters',
} as const;
