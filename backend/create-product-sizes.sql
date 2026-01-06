-- Add sizes_enabled column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sizes_enabled BOOLEAN DEFAULT false;

-- Product Sizes Table
CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size_name VARCHAR(50) NOT NULL, -- e.g., 'Small', 'Medium', 'Large', 'XL', 'Queen', 'King'
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, size_name) -- One size per product
);

-- Indexes for product sizes
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);

-- Add size column to order_items
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS size VARCHAR(50);

-- Add size column to cart
ALTER TABLE cart
ADD COLUMN IF NOT EXISTS size VARCHAR(50);

-- Update cart unique constraint to include size
-- First drop the old constraint if it exists
ALTER TABLE cart
DROP CONSTRAINT IF EXISTS cart_user_id_product_id_key;

-- Add new constraint that includes size
ALTER TABLE cart
ADD CONSTRAINT cart_user_id_product_id_size_key UNIQUE(user_id, product_id, size);

