import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /reviews/product/:productId
 * Get all reviews for a product (public)
 */
router.get('/product/:productId', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    // First get reviews
    const { data: reviewsData, error: reviewsError } = await supabaseAdmin!
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      res.status(400).json({ error: reviewsError.message }); return;
    }

    // Then get user profiles for each review
    const reviews = reviewsData || [];
    const userIds = [...new Set(reviews.map((r: any) => r.user_id))];
    
    let userProfilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profilesData } = await supabaseAdmin!
        .from('user_profiles')
        .select('id, full_name')
        .in('id', userIds);
      
      if (profilesData) {
        userProfilesMap = profilesData.reduce((acc: any, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
    }

    // Combine reviews with user data
    const reviewsWithUsers = reviews.map((review: any) => ({
      ...review,
      user: userProfilesMap[review.user_id] || { id: review.user_id, full_name: null }
    }));

    // Calculate average rating and total count
    const totalReviews = reviewsWithUsers.length;
    const avgRating = totalReviews > 0
      ? reviewsWithUsers.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
      : 0;

    res.status(200).json({
      reviews: reviewsWithUsers,
      totalReviews,
      averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * POST /reviews
 * Create or update review (authenticated users only)
 */
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      res.status(400).json({ error: 'Product ID and rating are required' }); return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' }); return;
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabaseAdmin!
      .from('product_reviews')
      .select('id')
      .eq('product_id', product_id)
      .eq('user_id', req.user!.id)
      .maybeSingle();

    let review;
    if (existingReview) {
      // Update existing review
      const { data: updateData, error: updateError } = await supabaseAdmin!
        .from('product_reviews')
        .update({
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingReview.id)
        .select('*')
        .single();

      if (updateError) {
        res.status(400).json({ error: updateError.message }); return;
      }

      // Get user profile
      const { data: userProfile } = await supabaseAdmin!
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', req.user!.id)
        .single();

      review = {
        ...updateData,
        user: userProfile || { id: req.user!.id, full_name: null }
      };
    } else {
      // Create new review
      const { data: insertData, error: insertError } = await supabaseAdmin!
        .from('product_reviews')
        .insert({
          product_id,
          user_id: req.user!.id,
          rating,
          comment: comment || null,
        })
        .select('*')
        .single();

      if (insertError) {
        res.status(400).json({ error: insertError.message }); return;
      }

      // Get user profile
      const { data: userProfile } = await supabaseAdmin!
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', req.user!.id)
        .single();

      review = {
        ...insertData,
        user: userProfile || { id: req.user!.id, full_name: null }
      };
    }

    res.status(200).json({ review, message: existingReview ? 'Review updated' : 'Review created' });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

/**
 * DELETE /reviews/:id
 * Delete own review (authenticated users only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify user owns this review
    const { data: review } = await supabaseAdmin!
      .from('product_reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!review) {
      res.status(404).json({ error: 'Review not found' }); return;
    }

    if (review.user_id !== req.user!.id) {
      res.status(403).json({ error: 'You can only delete your own reviews' }); return;
    }

    const { error } = await supabaseAdmin!
      .from('product_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
