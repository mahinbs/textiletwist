import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

type ShippingSettings = {
  shipping_enabled: boolean;
  shipping_flat_fee: number;
  shipping_free_threshold: number;
};

const DEFAULT_SETTINGS: ShippingSettings = {
  shipping_enabled: true,
  shipping_flat_fee: 500,
  shipping_free_threshold: 5000,
};

async function getStoreSettings(): Promise<ShippingSettings> {
  if (!supabaseAdmin) return DEFAULT_SETTINGS;

  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .select('shipping_enabled, shipping_flat_fee, shipping_free_threshold')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_SETTINGS;
  }

  return {
    shipping_enabled: data.shipping_enabled ?? DEFAULT_SETTINGS.shipping_enabled,
    shipping_flat_fee: Number(data.shipping_flat_fee ?? DEFAULT_SETTINGS.shipping_flat_fee),
    shipping_free_threshold: Number(
      data.shipping_free_threshold ?? DEFAULT_SETTINGS.shipping_free_threshold
    ),
  };
}

/**
 * Public endpoint - anyone (including guests) can read shipping settings.
 * GET /settings/shipping-public
 */
router.get('/shipping-public', async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getStoreSettings();
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Get public shipping settings error:', error);
    res.status(500).json({ error: 'Failed to fetch shipping settings' });
  }
});

/**
 * Admin-only endpoint to read shipping settings
 * GET /admin/settings/shipping
 */
router.get('/shipping', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabaseAdmin) {
      res.status(500).json({ error: 'Supabase admin client not configured' });
      return;
    }

    // Check admin role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', req.user!.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    const settings = await getStoreSettings();
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Get admin shipping settings error:', error);
    res.status(500).json({ error: 'Failed to fetch shipping settings' });
  }
});

/**
 * Admin-only endpoint to update shipping settings
 * PUT /admin/settings/shipping
 */
router.put('/shipping', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabaseAdmin) {
      res.status(500).json({ error: 'Supabase admin client not configured' });
      return;
    }

    // Check admin role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', req.user!.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    const { shipping_enabled, shipping_flat_fee, shipping_free_threshold } = req.body as Partial<
      ShippingSettings
    >;

    const updates: ShippingSettings = {
      shipping_enabled:
        typeof shipping_enabled === 'boolean' ? shipping_enabled : DEFAULT_SETTINGS.shipping_enabled,
      shipping_flat_fee:
        typeof shipping_flat_fee === 'number'
          ? shipping_flat_fee
          : DEFAULT_SETTINGS.shipping_flat_fee,
      shipping_free_threshold:
        typeof shipping_free_threshold === 'number'
          ? shipping_free_threshold
          : DEFAULT_SETTINGS.shipping_free_threshold,
    };

    // Check if a row exists
    const { data: existing } = await supabaseAdmin
      .from('store_settings')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('store_settings')
        .update({
          shipping_enabled: updates.shipping_enabled,
          shipping_flat_fee: updates.shipping_flat_fee,
          shipping_free_threshold: updates.shipping_free_threshold,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Update store settings error:', updateError);
        res.status(500).json({ error: 'Failed to update settings' });
        return;
      }
    } else {
      const { error: insertError } = await supabaseAdmin.from('store_settings').insert(updates);
      if (insertError) {
        console.error('Insert store settings error:', insertError);
        res.status(500).json({ error: 'Failed to create settings' });
        return;
      }
    }

    res.status(200).json({ settings: updates });
  } catch (error) {
    console.error('Update shipping settings error:', error);
    res.status(500).json({ error: 'Failed to update shipping settings' });
  }
});

export default router;

