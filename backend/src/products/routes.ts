import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /products
 * Get all products (public, with optional filters)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id, is_active, search } = req.query;

    let query = supabaseAdmin!
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('created_at', { ascending: false });

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ products: data || [] });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /products/:id
 * Get single product by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Product not found' }); return;
    }

    res.status(200).json({ product: data });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /products
 * Create new product (admin only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      description,
      category_id,
      price,
      discount_percentage,
      quantity,
      image_url,
      images,
      is_active,
    } = req.body;

    // Validation
    if (!name || !price || price < 0) {
      res.status(400).json({ error: 'Name and valid price are required' }); return;
    }

    if (quantity !== undefined && quantity < 0) {
      res.status(400).json({ error: 'Quantity cannot be negative' }); return;
    }

    if (discount_percentage !== undefined && (discount_percentage < 0 || discount_percentage > 100)) {
      res.status(400).json({ error: 'Discount percentage must be between 0 and 100' }); return;
    }

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabaseAdmin!
      .from('products')
      .insert({
        name,
        slug: productSlug,
        description,
        category_id: category_id || null,
        price: parseFloat(price),
        discount_percentage: discount_percentage ? parseFloat(discount_percentage) : 0,
        quantity: quantity ? parseInt(quantity) : 0,
        image_url: image_url || null,
        images: images || [],
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(201).json({ product: data, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /products/:id
 * Update product (admin only)
 */
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      category_id,
      price,
      discount_percentage,
      quantity,
      image_url,
      images,
      is_active,
    } = req.body;

    // Validation
    if (price !== undefined && price < 0) {
      res.status(400).json({ error: 'Price cannot be negative' }); return;
    }

    if (quantity !== undefined && quantity < 0) {
      res.status(400).json({ error: 'Quantity cannot be negative' }); return;
    }

    if (discount_percentage !== undefined && (discount_percentage < 0 || discount_percentage > 100)) {
      res.status(400).json({ error: 'Discount percentage must be between 0 and 100' }); return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (category_id !== undefined) updateData.category_id = category_id || null;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discount_percentage !== undefined) updateData.discount_percentage = parseFloat(discount_percentage);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (images !== undefined) updateData.images = images;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin!
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Product not found' }); return;
    }

    res.status(200).json({ product: data, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /products/:id
 * Delete product (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;

