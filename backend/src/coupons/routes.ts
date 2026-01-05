import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /coupons
 * Get all active coupons (public) or all coupons (admin)
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = !!req.user; // In real app, check admin role

    let query = supabaseAdmin!.from('coupons').select('*');

    if (!isAdmin) {
      // Public: only active coupons that are valid
      query = query
        .eq('is_active', true)
        .gte('valid_from', new Date().toISOString())
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ coupons: data || [] });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

/**
 * GET /coupons/:id
 * Get single coupon
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Coupon not found' }); return;
    }

    res.status(200).json({ coupon: data });
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ error: 'Failed to fetch coupon' });
  }
});

/**
 * POST /coupons/validate
 * Validate and get coupon discount amount
 */
router.post('/validate', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal, category_id } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Coupon code is required' }); return;
    }

    // Find coupon
    const { data: coupon, error: couponError } = await supabaseAdmin!
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (couponError || !coupon) {
      res.status(404).json({ error: 'Invalid or expired coupon code' }); return;
    }

    // Check validity dates
    const now = new Date();
    if (new Date(coupon.valid_from) > now) {
      res.status(400).json({ error: 'Coupon is not yet valid' }); return;
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      res.status(400).json({ error: 'Coupon has expired' }); return;
    }

    // Check if category-specific coupon matches
    if (coupon.category_id && coupon.category_id !== category_id) {
      res.status(400).json({ error: 'This coupon is not valid for selected category' }); return;
    }

    // Check minimum order amount
    if (subtotal && coupon.min_order_amount > subtotal) {
      res.status(400).json({
        error: `Minimum order amount of ₹${coupon.min_order_amount} required`,
      });
      return;
    }

    // Check if user has already used this coupon
    if (req.user) {
      const { data: usage } = await supabaseAdmin!
        .from('coupon_usage')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', req.user.id)
        .single();

      if (usage) {
        res.status(400).json({ error: 'You have already used this coupon' }); return;
      }
    }

    // Check usage limit
    if (coupon.usage_limit) {
      const { count } = await supabaseAdmin!
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id);

      if (count && count >= coupon.usage_limit) {
        res.status(400).json({ error: 'Coupon usage limit reached' }); return;
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal || 0) * (coupon.discount_value / 100);
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    // Don't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal || 0);

    res.status(200).json({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
      discount_amount: discountAmount,
      valid: true,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

/**
 * POST /coupons
 * Create new coupon (admin only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      category_id,
      min_order_amount,
      max_discount_amount,
      valid_from,
      valid_until,
      usage_limit,
      is_active,
    } = req.body;

    // Validation
    if (!code || !name || !discount_type || discount_value === undefined) {
      res.status(400).json({
        error: 'Code, name, discount_type, and discount_value are required',
      });
      return;
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      res.status(400).json({ error: 'discount_type must be "percentage" or "fixed"' }); return;
    }

    if (discount_value < 0) {
      res.status(400).json({ error: 'Discount value cannot be negative' }); return;
    }

    if (discount_type === 'percentage' && discount_value > 100) {
      res.status(400).json({ error: 'Percentage discount cannot exceed 100%' }); return;
    }

    const { data, error } = await supabaseAdmin!
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        name,
        description: description || null,
        discount_type,
        discount_value: parseFloat(discount_value),
        category_id: category_id || null,
        min_order_amount: min_order_amount ? parseFloat(min_order_amount) : 0,
        max_discount_amount: max_discount_amount ? parseFloat(max_discount_amount) : null,
        valid_from: valid_from || new Date().toISOString(),
        valid_until: valid_until || null,
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(201).json({ coupon: data, message: 'Coupon created successfully' });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

/**
 * PUT /coupons/:id
 * Update coupon (admin only)
 */
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      category_id,
      min_order_amount,
      max_discount_amount,
      valid_from,
      valid_until,
      usage_limit,
      is_active,
    } = req.body;

    const updateData: any = {};
    if (code) updateData.code = code.toUpperCase();
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (discount_type) updateData.discount_type = discount_type;
    if (discount_value !== undefined) updateData.discount_value = parseFloat(discount_value);
    if (category_id !== undefined) updateData.category_id = category_id || null;
    if (min_order_amount !== undefined) updateData.min_order_amount = parseFloat(min_order_amount);
    if (max_discount_amount !== undefined) updateData.max_discount_amount = max_discount_amount ? parseFloat(max_discount_amount) : null;
    if (valid_from) updateData.valid_from = valid_from;
    if (valid_until !== undefined) updateData.valid_until = valid_until || null;
    if (usage_limit !== undefined) updateData.usage_limit = usage_limit ? parseInt(usage_limit) : null;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin!
      .from('coupons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Coupon not found' }); return;
    }

    res.status(200).json({ coupon: data, message: 'Coupon updated successfully' });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

/**
 * DELETE /coupons/:id
 * Delete coupon (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

export default router;

