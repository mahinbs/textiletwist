# Database Setup Guide

## Step 1: Run SQL Schema in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create all necessary tables, indexes, triggers, and RLS policies.

## Step 2: Verify Tables Created

After running the SQL, verify tables were created:

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `categories`
   - `products`
   - `user_profiles`
   - `coupons`
   - `coupon_usage`
   - `cart`
   - `wishlist`
   - `orders`
   - `order_items`
   - `contact_enquiries`

## Step 3: (Optional) Insert Sample Data

You can insert sample categories and products for testing:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Bed Sheets', 'bed-sheets', 'Premium bed linens'),
('Table Linen', 'table-linen', 'Elegant table settings'),
('Cushion Covers', 'cushion-covers', 'Decorative cushions'),
('Bath Linen', 'bath-linen', 'Luxury bath textiles'),
('Royal Collection', 'royal-collection', 'Premium furnishing collection');

-- Insert sample products
INSERT INTO products (name, slug, description, category_id, price, discount_percentage, quantity, image_url, is_active)
SELECT 
  'Royal Satin Bed Sheet',
  'royal-satin-bed-sheet',
  'Premium satin bed sheet with royal finish',
  id,
  1500.00,
  10.00,
  50,
  '/images/bed-linen.png',
  true
FROM categories WHERE slug = 'bed-sheets'
LIMIT 1;
```

## Step 4: Test API Endpoints

Once the database is set up, test the API:

```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/products

# Get categories
curl http://localhost:5000/categories
```

## Important Notes

1. **RLS Policies**: Row Level Security is enabled. The backend uses the service role key which bypasses RLS, but direct database access will respect these policies.

2. **User Profiles**: When a user signs up via `/auth/signup`, you may want to automatically create a profile in `user_profiles` table. This can be done via a database trigger or in your signup endpoint.

3. **Admin Role**: Currently, the API checks for authentication but doesn't verify admin role. You should add an admin role check in production. Consider adding a `role` field to `user_profiles` table.

4. **Order Numbers**: Order numbers are auto-generated in the format `ORD-{timestamp}-{random}`. This ensures uniqueness.

5. **Coupon Usage**: The `coupon_usage` table ensures one coupon can only be used once per user (enforced by UNIQUE constraint).

## Troubleshooting

### "relation does not exist"
- Make sure you ran the SQL schema in the correct Supabase project
- Check that all tables were created in the Table Editor

### "permission denied"
- Verify your `.env` file has the correct `SUPABASE_SERVICE_ROLE_KEY`
- The service role key bypasses RLS, so this shouldn't be an issue for API calls

### "duplicate key value"
- Some tables have UNIQUE constraints (e.g., coupon codes, product slugs)
- Make sure you're not inserting duplicate values

## Next Steps

1. Set up admin authentication (add role checking)
2. Add email notifications for orders
3. Set up payment gateway integration
4. Add product image upload functionality
5. Implement inventory management alerts


