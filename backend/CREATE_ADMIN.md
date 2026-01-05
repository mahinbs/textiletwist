# Create Admin User Guide

## Method 1: Using Node.js Script (Recommended)

1. Make sure your `.env` file in `backend/` has all the Supabase credentials:
   ```env
   SUPABASE_URL=https://kbtgpgkiojeqnssenlof.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the script:
   ```bash
   cd backend
   node create-admin-user.js
   ```

3. The script will:
   - Create the user `admin@textiletwist.com` with password `Admin@123`
   - Set the user's role to `admin` in the `user_profiles` table
   - Auto-confirm the email

## Method 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** or **"Invite User"**
4. Enter:
   - Email: `admin@textiletwist.com`
   - Password: `Admin@123`
   - Auto-confirm: ✅ (check this)
5. Click **"Create User"**
6. Copy the User ID from the user list
7. Go to **SQL Editor** and run:
   ```sql
   -- Insert or update user profile with admin role
   INSERT INTO user_profiles (id, role, full_name)
   VALUES ('PASTE_USER_ID_HERE', 'admin', 'Admin User')
   ON CONFLICT (id) 
   DO UPDATE SET role = 'admin', full_name = 'Admin User';
   ```

## Method 3: Using SQL Directly (After User Creation)

If you've already created the user via Supabase Auth:

1. Get the user ID from Supabase Dashboard → Authentication → Users
2. Run this SQL:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin', full_name = 'Admin User'
   WHERE id = 'USER_ID_HERE';
   
   -- Or if profile doesn't exist:
   INSERT INTO user_profiles (id, role, full_name)
   VALUES ('USER_ID_HERE', 'admin', 'Admin User');
   ```

## Verify Admin User

After creating the admin user, you can verify by:

1. Logging in at `/admin/login` with:
   - Email: `admin@textiletwist.com`
   - Password: `Admin@123`

2. Check the database:
   ```sql
   SELECT id, email, role, full_name 
   FROM user_profiles 
   WHERE email = 'admin@textiletwist.com';
   ```

## Update Schema First

Before creating the admin user, make sure you've run the updated schema that includes the `role` column:

```sql
-- Add role column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
```

This is already included in the updated `supabase-schema.sql` file.

## Password Reset

The admin can now reset their password from the Admin Settings page:
- Go to `/admin/settings`
- Enter current password
- Enter new password (min 6 characters)
- Confirm new password
- Click "Update Password"

The password reset functionality is now fully integrated with the backend API.

