-- ADD SIZE COLUMN TO CART_ITEMS TABLE

-- Add size column to cart_items
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS size VARCHAR(50);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_size ON cart_items(size);

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;
