import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /product-sizes/product/:productId
 * Get all sizes for a product
 */
router.get('/product/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('product_sizes')
      .select('*')
      .eq('product_id', productId)
      .order('size_name', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ sizes: data || [] });
  } catch (error) {
    console.error('Get product sizes error:', error);
    res.status(500).json({ error: 'Failed to fetch product sizes' });
  }
});

/**
 * POST /product-sizes
 * Create or update product size (admin only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, size_name, quantity } = req.body;

    if (!product_id || !size_name || quantity === undefined) {
      res.status(400).json({ error: 'Product ID, size name, and quantity are required' }); return;
    }

    // Check if size already exists
    const { data: existing } = await supabaseAdmin!
      .from('product_sizes')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('size_name', size_name)
      .maybeSingle();

    let size;
    if (existing) {
      // Update existing size
      const { data, error } = await supabaseAdmin!
        .from('product_sizes')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message }); return;
      }
      size = data;
    } else {
      // Create new size
      const { data, error } = await supabaseAdmin!
        .from('product_sizes')
        .insert({ product_id, size_name, quantity })
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message }); return;
      }
      size = data;
    }

    res.status(200).json({ size, message: existing ? 'Size updated' : 'Size created' });
  } catch (error) {
    console.error('Create product size error:', error);
    res.status(500).json({ error: 'Failed to create product size' });
  }
});

/**
 * DELETE /product-sizes/:id
 * Delete product size (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('product_sizes')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Size deleted successfully' });
  } catch (error) {
    console.error('Delete product size error:', error);
    res.status(500).json({ error: 'Failed to delete product size' });
  }
});

export default router;

