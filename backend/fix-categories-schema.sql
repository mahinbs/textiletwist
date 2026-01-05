-- Fix categories table - add is_active column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing categories to be active by default
UPDATE categories SET is_active = true WHERE is_active IS NULL;

-- Now you can run the Apparels categories insert:
INSERT INTO categories (name, slug, description, is_active) VALUES
('Men', 'apparels-men', 'Men''s clothing', true),
('Women', 'apparels-women', 'Women''s clothing', true),
('Kids', 'apparels-kids', 'Kids'' clothing', true)
ON CONFLICT (slug) DO NOTHING;
