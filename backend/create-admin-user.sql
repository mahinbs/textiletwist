-- Create Admin User Script
-- Run this in Supabase SQL Editor after running the main schema

-- First, we need to add a role column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create an index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Note: The actual user creation should be done through Supabase Auth UI or API
-- This script only sets up the role after the user is created
-- 
-- To create the user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Enter email: admin@textiletwist.com
-- 4. Enter password: Admin@123
-- 5. Auto-confirm the user
-- 6. Copy the user ID
-- 7. Run the UPDATE query below with the user ID

-- After creating the user in Supabase Auth, run this to set them as admin:
-- UPDATE user_profiles 
-- SET role = 'admin', full_name = 'Admin User'
-- WHERE id = 'USER_ID_FROM_SUPABASE_AUTH';

-- Or if the profile doesn't exist yet:
-- INSERT INTO user_profiles (id, role, full_name)
-- VALUES ('USER_ID_FROM_SUPABASE_AUTH', 'admin', 'Admin User');

-- Alternative: Create user via Supabase Auth Admin API (can be done via backend)
-- See create-admin-user.js for Node.js script


