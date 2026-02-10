-- Drop existing restrictive policies on orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;

-- Create new policies for orders table

-- 1. Allow anyone to INSERT orders (for guest checkout)
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- 2. Allow anyone to SELECT their own orders OR guest orders by email
CREATE POLICY "Anyone can view orders they placed" ON orders
    FOR SELECT USING (
        -- Logged in users can see their own orders
        (auth.uid() = user_id) 
        OR 
        -- Guest orders (user_id is null) can be viewed by anyone
        (user_id IS NULL)
    );

-- 3. Only admins can UPDATE orders (status changes)
CREATE POLICY "Only admins can update orders" ON orders
    FOR UPDATE USING (
        -- Check if user has admin role
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- 4. Only admins can DELETE orders
CREATE POLICY "Only admins can delete orders" ON orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Order Items policies
DROP POLICY IF EXISTS "Enable read access for all users" ON order_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON order_items;

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view order items" ON order_items
    FOR SELECT USING (true);

-- Comments for documentation
COMMENT ON POLICY "Anyone can create orders" ON orders IS 'Allows guest checkout - anyone can place orders';
COMMENT ON POLICY "Anyone can view orders they placed" ON orders IS 'Users see their own orders, guest orders are public';
