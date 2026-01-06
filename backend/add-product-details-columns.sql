-- Add product details columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS material VARCHAR(255),
ADD COLUMN IF NOT EXISTS thread_count VARCHAR(100),
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS origin VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_policy TEXT;

