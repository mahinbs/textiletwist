import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../supabase/client.js';
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
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
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
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data.session || !data.user) {
      // Email confirmation might be required
      res.status(200).json({
        message: 'Signup successful. Please check your email for verification.',
        user: data.user,
      });
      return;
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
      access_token: data.session.access_token, // Also return token in body for cross-domain
    });
    return;
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
    return;
  }
});

/**
 * POST /auth/login
 * Sign in with email and password
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (!data.session || !data.user) {
      res.status(401).json({ error: 'Login failed' });
      return;
    }

    // Set auth cookies
    res.cookie(ACCESS_TOKEN_COOKIE, data.session.access_token, cookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, refreshCookieOptions);

    // Get user profile to check role
    const { data: profile } = await supabaseAdmin!
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        role: profile?.role || 'user',
      },
      access_token: data.session.access_token, // Also return token in body for cross-domain
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
    return;
  }
});

/**
 * POST /auth/logout
 * Sign out and clear cookies
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if Supabase signout fails
    res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);
    res.status(200).json({ message: 'Logout successful' });
    return;
  }
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user profile to check role
    const { data: profile } = await supabaseAdmin!
      .from('user_profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name,
        created_at: req.user.created_at,
        role: profile?.role || 'user',
      },
    });
    return;
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
    return;
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token not found' });
      return;
    }

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      res.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
      res.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);
      res.status(401).json({ error: 'Failed to refresh token' });
      return;
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
    return;
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
    return;
  }
});

/**
 * PUT /auth/change-password
 * Change user password (requires current password)
 */
router.put('/change-password', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: req.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Update password using Supabase Admin API
    // Note: This requires service role key
    const { supabaseAdmin } = await import('../supabase/client.js');
    
    if (!supabaseAdmin) {
      res.status(500).json({ error: 'Admin client not available' });
      return;
    }

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      res.status(400).json({ error: updateError.message || 'Failed to update password' });
      return;
    }

    res.status(200).json({ message: 'Password updated successfully' });
    return;
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
    return;
  }
});

export default router;

