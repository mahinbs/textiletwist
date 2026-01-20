import { CookieOptions } from 'express';

// Cookie names
export const ACCESS_TOKEN_COOKIE = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE = 'sb_refresh_token';

// Cookie configuration
export const cookieOptions: CookieOptions = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: true, // Always use secure in production (HTTPS)
  sameSite: 'none', // Allow cross-domain cookies
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
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 0,
};

