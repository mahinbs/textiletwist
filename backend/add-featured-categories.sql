-- Add featured category fields to existing categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS featured_order INTEGER CHECK (featured_order >= 1 AND featured_order <= 3);

-- Add index for faster featured category queries
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(is_featured, featured_order) WHERE is_featured = true;


