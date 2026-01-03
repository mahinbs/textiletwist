import { CookieOptions } from 'express';

// Cookie names
export const ACCESS_TOKEN_COOKIE = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE = 'sb_refresh_token';

// Cookie configuration
const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptions: CookieOptions = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: isProduction, // HTTPS only in production
  sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
};

export const refreshCookieOptions: CookieOptions = {
  ...cookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
};

/**
 * Helper to clear auth cookies
 */
export const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
  maxAge: 0,
};

