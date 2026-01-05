import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /cart
 * Get user's cart items
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { data, error } = await supabaseAdmin!
      .from('cart')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ cart: data || [] });
    return;
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
    return;
  }
});

/**
 * POST /cart
 * Add item to cart
 */
router.post('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { product_id, quantity } = req.body;

    if (!product_id) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const qty = quantity ? parseInt(quantity) : 1;
    if (qty <= 0) {
      res.status(400).json({ error: 'Quantity must be greater than 0' });
      return;
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabaseAdmin!
      .from('products')
      .select('id, quantity, is_active')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (!product.is_active) {
      res.status(400).json({ error: 'Product is not available' });
      return;
    }

    if (product.quantity < qty) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabaseAdmin!
      .from('cart')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + qty;
      if (product.quantity < newQuantity) {
        res.status(400).json({ error: 'Insufficient stock' });
        return;
      }

      const { data, error } = await supabaseAdmin!
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(200).json({ cartItem: data, message: 'Cart updated' });
      return;
    }

    // Insert new item
    const { data, error } = await supabaseAdmin!
      .from('cart')
      .insert({
        user_id: req.user.id,
        product_id,
        quantity: qty,
      })
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({ cartItem: data, message: 'Item added to cart' });
    return;
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
    return;
  }
});

/**
 * PUT /cart/:id
 * Update cart item quantity
 */
router.put('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || parseInt(quantity) <= 0) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    // Check if cart item belongs to user
    const { data: cartItem } = await supabaseAdmin!
      .from('cart')
      .select('product_id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    // Check product stock
    const { data: product } = await supabaseAdmin!
      .from('products')
      .select('quantity')
      .eq('id', cartItem.product_id)
      .single();

    if (product && product.quantity < parseInt(quantity)) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    const { data, error } = await supabaseAdmin!
      .from('cart')
      .update({ quantity: parseInt(quantity) })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ cartItem: data, message: 'Cart updated' });
    return;
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
    return;
  }
});

/**
 * DELETE /cart/:id
 * Remove item from cart
 */
router.delete('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('cart')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Item removed from cart' });
    return;
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
    return;
  }
});

/**
 * DELETE /cart
 * Clear entire cart
 */
router.delete('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { error } = await supabaseAdmin!
      .from('cart')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Cart cleared' });
    return;
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
    return;
  }
});

export default router;

