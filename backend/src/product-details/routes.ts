import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /product-details/product/:productId
 * Get all details for a product
 */
router.get('/product/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('product_details')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ details: data || [] });
  } catch (error) {
    console.error('Get product details error:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

/**
 * POST /product-details
 * Create or update product detail (admin only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, heading, value, display_order } = req.body;

    if (!product_id || !heading || value === undefined) {
      res.status(400).json({ error: 'Product ID, heading, and value are required' }); return;
    }

    // Check if detail with same heading already exists for this product
    const { data: existing } = await supabaseAdmin!
      .from('product_details')
      .select('id')
      .eq('product_id', product_id)
      .eq('heading', heading)
      .maybeSingle();

    let detail;
    if (existing) {
      // Update existing detail
      const { data, error } = await supabaseAdmin!
        .from('product_details')
        .update({ 
          value, 
          display_order: display_order || 0,
          updated_at: new Date().toISOString() 
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message }); return;
      }
      detail = data;
    } else {
      // Create new detail
      const { data, error } = await supabaseAdmin!
        .from('product_details')
        .insert({ 
          product_id, 
          heading, 
          value,
          display_order: display_order || 0
        })
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message }); return;
      }
      detail = data;
    }

    res.status(200).json({ detail, message: existing ? 'Detail updated' : 'Detail created' });
  } catch (error) {
    console.error('Create product detail error:', error);
    res.status(500).json({ error: 'Failed to create product detail' });
  }
});

/**
 * DELETE /product-details/:id
 * Delete product detail (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('product_details')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Detail deleted successfully' });
  } catch (error) {
    console.error('Delete product detail error:', error);
    res.status(500).json({ error: 'Failed to delete product detail' });
  }
});

export default router;

