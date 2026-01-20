-- Set Admin Role Script
-- Run this AFTER creating the user in Supabase Dashboard > Authentication > Users
-- 
-- Steps:
-- 1. Create user in Supabase Dashboard:
--    - Email: admin@textiletwist.com
--    - Password: Admin@123
--    - Auto-confirm: ✅
-- 2. Copy the User ID from the user list
-- 3. Replace 'YOUR_USER_ID_HERE' below with the actual User ID
-- 4. Run this script in Supabase SQL Editor

-- Option 1: Update existing profile
UPDATE user_profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE id = 'YOUR_USER_ID_HERE';

-- Option 2: Insert if profile doesn't exist (run this if Option 1 returns 0 rows)
INSERT INTO user_profiles (id, role, full_name)
VALUES ('YOUR_USER_ID_HERE', 'admin', 'Admin User')
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', full_name = 'Admin User';

-- Verify the admin user was created
SELECT id, email, role, full_name 
FROM auth.users 
WHERE email = 'admin@textiletwist.com';

-- Verify the profile
SELECT up.id, up.role, up.full_name, au.email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'admin@textiletwist.com';
