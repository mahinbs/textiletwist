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
 * Verifies the access token from cookies or Authorization header and attaches user to req.user
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Try to get token from Authorization header first, then cookies
    let accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
    
    // Check for Bearer token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }

    if (!accessToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify token and get user
    const user = await verifyToken(accessToken);

    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 * Attaches user to req.user if valid token exists (from cookies or Authorization header)
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    // Try to get token from Authorization header first, then cookies
    let accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
    
    // Check for Bearer token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }

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

