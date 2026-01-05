-- Create Apparels categories (Men, Women, Kids)
-- These are separate from regular product categories

INSERT INTO categories (name, slug, description, is_active, is_featured, featured_order) VALUES
('Men', 'apparels-men', 'Men''s clothing and apparel', true, false, null),
('Women', 'apparels-women', 'Women''s clothing and apparel', true, false, null),
('Kids', 'apparels-kids', 'Kids'' clothing and apparel', true, false, null)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- Create 3 featured categories for Curated Collections
-- NOTE: Update image_url with your Supabase Storage URLs after uploading images
-- Upload images to Supabase Storage bucket 'product-images' in 'categories/' folder
-- Format: https://[your-project].supabase.co/storage/v1/object/public/product-images/categories/[filename]
INSERT INTO categories (name, slug, description, is_active, is_featured, featured_order, image_url) VALUES
('Bed Linens', 'bed-linens', 'Premium bed linens and sheets', true, true, 1, NULL),
('Table Aesthetics', 'table-aesthetics', 'Elegant table settings and linens', true, true, 2, NULL),
('Luxury Cushions', 'luxury-cushions', 'Decorative cushions and throws', true, true, 3, NULL)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured,
    featured_order = EXCLUDED.featured_order,
    image_url = COALESCE(EXCLUDED.image_url, categories.image_url);

-- After running this, upload category images via Admin Panel → Categories
-- Or update URLs manually:
-- UPDATE categories SET image_url = 'https://[project].supabase.co/storage/v1/object/public/product-images/categories/[uuid].jpg' WHERE slug = 'bed-linens';
-- UPDATE categories SET image_url = 'https://[project].supabase.co/storage/v1/object/public/product-images/categories/[uuid].jpg' WHERE slug = 'table-aesthetics';
-- UPDATE categories SET image_url = 'https://[project].supabase.co/storage/v1/object/public/product-images/categories/[uuid].jpg' WHERE slug = 'luxury-cushions';

