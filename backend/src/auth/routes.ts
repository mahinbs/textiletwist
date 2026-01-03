import { Router, Request, Response } from 'express';
import { supabase } from '../supabase/client.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  cookieOptions,
  refreshCookieOptions,
  clearCookieOptions,
} from './cookies.js';
import { requireAuth } from './middleware.js';

const router = Router();

/**
 * POST /auth/signup
 * Register a new user with email and password
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.session || !data.user) {
      // Email confirmation might be required
      return res.status(200).json({
        message: 'Signup successful. Please check your email for verification.',
        user: data.user,
      });
    }

    // Set auth cookies
    res.cookie(ACCESS_TOKEN_COOKIE, data.session.access_token, cookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, refreshCookieOptions);

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

/**
 * POST /auth/login
 * Sign in with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.session || !data.user) {
      return res.status(401).json({ error: 'Login failed' });
    }

    // Set auth cookies
    res.cookie(ACCESS_TOKEN_COOKIE, data.session.access_token, cookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, refreshCookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /auth/logout
 * Sign out and clear cookies
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    // Sign out from Supabase if we have a token
    if (accessToken) {
      await supabase.auth.signOut();
    }

    // Clear cookies
    res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if Supabase signout fails
    res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);
    res.status(200).json({ message: 'Logout successful' });
  }
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name,
        created_at: req.user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
      res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);
      return res.status(401).json({ error: 'Failed to refresh token' });
    }

    // Update cookies with new tokens
    res.cookie(ACCESS_TOKEN_COOKIE, data.session.access_token, cookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, refreshCookieOptions);

    res.status(200).json({
      message: 'Token refreshed successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        full_name: data.user?.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;

