import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../supabase/client.js';
import { ACCESS_TOKEN_COOKIE } from './cookies.js';
import { User } from '@supabase/supabase-js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to require authentication
 * Verifies the access token from cookies and attaches user to req.user
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    if (!accessToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token and get user
    const user = await verifyToken(accessToken);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 * Attaches user to req.user if valid token exists
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    if (accessToken) {
      const user = await verifyToken(accessToken);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}

