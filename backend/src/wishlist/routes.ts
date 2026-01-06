import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /wishlist
 * Get user's wishlist items
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' }); return;
    }

    const { data, error } = await supabaseAdmin!
      .from('wishlist')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ wishlist: data || [] });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

/**
 * POST /wishlist
 * Add item to wishlist
 */
router.post('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' }); return;
    }

    const { product_id } = req.body;

    if (!product_id) {
      res.status(400).json({ error: 'Product ID is required' }); return;
    }

    // Check if product exists
    const { data: product, error: productError } = await supabaseAdmin!
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      res.status(404).json({ error: 'Product not found' }); return;
    }

    // Check if already in wishlist
    const { data: existing } = await supabaseAdmin!
      .from('wishlist')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      res.status(400).json({ error: 'Product already in wishlist' }); return;
    }

    // Insert new item
    const { data, error } = await supabaseAdmin!
      .from('wishlist')
      .insert({
        user_id: req.user.id,
        product_id,
      })
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(201).json({ wishlistItem: data, message: 'Item added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

/**
 * DELETE /wishlist/:product_id
 * Remove item from wishlist
 */
router.delete('/:product_id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' }); return;
    }

    const { product_id } = req.params;

    const { error } = await supabaseAdmin!
      .from('wishlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', product_id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

/**
 * GET /wishlist/check/:product_id
 * Check if product is in wishlist
 */
router.get('/check/:product_id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(200).json({ inWishlist: false }); return;
    }

    const { product_id } = req.params;

    const { data } = await supabaseAdmin!
      .from('wishlist')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    res.status(200).json({ inWishlist: !!data });
  } catch (error) {
    res.status(200).json({ inWishlist: false });
  }
});

export default router;


