-- FIX RLS POLICIES - SEPARATE GUEST AND USER ORDERS PROPERLY

-- Drop all existing order policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view orders they placed" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
DROP POLICY IF EXISTS "Only admins can delete orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;

-- 1. INSERT: Anyone can create orders (guest or logged-in)
CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT WITH CHECK (true);

-- 2. SELECT: Users see ONLY their own orders, NOT guest orders
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT USING (
        -- Logged-in users see only orders with their user_id
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR
        -- Admins see everything
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- 3. UPDATE: Only admins can update
CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- 4. DELETE: Only admins can delete
CREATE POLICY "orders_delete_policy" ON orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Order Items policies
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON order_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON order_items;

CREATE POLICY "order_items_insert_policy" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_select_policy" ON order_items
    FOR SELECT USING (
        -- Can view order items if you can view the order
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id
            AND (
                (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
                OR
                EXISTS (
                    SELECT 1 FROM user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role = 'admin'
                )
            )
        )
    );

-- IMPORTANT: Guest orders are NOT visible through RLS
-- They can ONLY be accessed via service role (backend API)
-- This ensures logged-in users don't see other people's guest orders

COMMENT ON POLICY "orders_select_policy" ON orders IS 'Users see only their own orders. Guest orders invisible via RLS - accessed only through backend service role.';
