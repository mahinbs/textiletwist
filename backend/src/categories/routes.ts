import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /categories
 * Get all categories (public)
 * Query params: featured=true to get only featured categories
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured } = req.query;
    
    let query = supabaseAdmin!.from('categories').select('*');
    
    if (featured === 'true') {
      query = query
        .eq('is_featured', true)
        .not('featured_order', 'is', null)
        .order('featured_order', { ascending: true });
    } else {
      query = query.order('name', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ categories: data || [] });
    return;
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
    return;
  }
});

/**
 * GET /categories/:id
 * Get single category by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Category not found' }); return;
    }

    res.status(200).json({ category: data });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

/**
 * POST /categories
 * Create new category (admin only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image_url, is_featured, featured_order } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Category name is required' }); return;
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Validate featured_order if is_featured is true
    if (is_featured && (featured_order < 1 || featured_order > 3)) {
      res.status(400).json({ error: 'featured_order must be between 1 and 3' }); return;
    }

    // Check if we're trying to set a featured order that's already taken
    if (is_featured && featured_order) {
      const { data: existing } = await supabaseAdmin!
        .from('categories')
        .select('id')
        .eq('is_featured', true)
        .eq('featured_order', featured_order)
        .maybeSingle();
      
      if (existing) {
        res.status(400).json({ error: `Featured order ${featured_order} is already taken. Please choose another position (1-3).` }); return;
      }
    }

    const { data, error } = await supabaseAdmin!
      .from('categories')
      .insert({
        name,
        slug: categorySlug,
        description: description || null,
        image_url: image_url || null,
        is_featured: is_featured || false,
        featured_order: is_featured && featured_order ? featured_order : null,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(201).json({ category: data, message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

/**
 * PUT /categories/:id
 * Update category (admin only)
 */
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, image_url, is_featured, featured_order } = req.body;

    // Validate featured_order if is_featured is true
    if (is_featured !== undefined && is_featured && featured_order !== undefined) {
      if (featured_order < 1 || featured_order > 3) {
        res.status(400).json({ error: 'featured_order must be between 1 and 3' }); return;
      }

      // Check if featured_order is already taken by another category
      const { data: existing } = await supabaseAdmin!
        .from('categories')
        .select('id')
        .eq('is_featured', true)
        .eq('featured_order', featured_order)
        .neq('id', id)
        .maybeSingle();
      
      if (existing) {
        res.status(400).json({ error: `Featured order ${featured_order} is already taken. Please choose another position (1-3).` }); return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_featured !== undefined) {
      updateData.is_featured = is_featured;
      // Clear featured_order if not featured
      if (!is_featured) {
        updateData.featured_order = null;
      } else if (featured_order !== undefined) {
        updateData.featured_order = featured_order;
      }
    } else if (featured_order !== undefined) {
      updateData.featured_order = featured_order;
    }

    const { data, error } = await supabaseAdmin!
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Category not found' }); return;
    }

    res.status(200).json({ category: data, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

/**
 * DELETE /categories/:id
 * Delete category (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;

