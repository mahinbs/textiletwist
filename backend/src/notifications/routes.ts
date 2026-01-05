import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /notifications
 * Get user's notifications (admin or customer)
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' }); return;
    }

    const { limit = 50, unread_only = false } = req.query;

    let query = supabaseAdmin!
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (unread_only === 'true') {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ notifications: data || [] });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * GET /notifications/unread-count
 * Get count of unread notifications
 */
router.get('/unread-count', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(200).json({ count: 0 }); return;
    }

    const { count, error } = await supabaseAdmin!
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ count: count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

/**
 * PUT /notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' }); return;
    }

    const { id } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Notification not found' }); return;
    }

    res.status(200).json({ notification: data });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

/**
 * PUT /notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' }); return;
    }

    const { error } = await supabaseAdmin!
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

/**
 * DELETE /notifications/:id
 * Delete notification
 */
router.delete('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' }); return;
    }

    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;

