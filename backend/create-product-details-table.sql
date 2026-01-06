-- Product Details Table (Dynamic fields)
CREATE TABLE IF NOT EXISTS product_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL, -- e.g., "Material", "Thread Count", "Care Instructions"
    value TEXT NOT NULL, -- The actual detail value
    display_order INTEGER DEFAULT 0, -- Order in which to display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for product details
CREATE INDEX IF NOT EXISTS idx_product_details_product_id ON product_details(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_display_order ON product_details(product_id, display_order);

