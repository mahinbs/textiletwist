# Quick Start: Create Admin User

## Step 1: Update Database Schema

First, make sure you've added the `role` column to `user_profiles` table. Run this in Supabase SQL Editor:

```sql
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
```

Or re-run the updated `supabase-schema.sql` file.

## Step 2: Set Up Environment Variables

Make sure your `backend/.env` file has:

```env
SUPABASE_URL=https://kbtgpgkiojeqnssenlof.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGdwZ2tpb2plcW5zc2VubG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTAwNjgsImV4cCI6MjA4MzE4NjA2OH0.4GadKjMZkICT1c9UE4vsQwCq6YK2gDMczRYy_8Jktu4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGdwZ2tpb2plcW5zc2VubG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYxMDA2OCwiZXhwIjoyMDgzMTg2MDY4fQ.vaBvvy1SisYMqYnvujCPmVI0fpdD_YxD7AGjUq0g0-0
```

## Step 3: Create Admin User

Run the script:

```bash
cd backend
npm run create-admin
```

Or directly:

```bash
cd backend
node create-admin-user.js
```

## Step 4: Login

1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev` (from root)
3. Go to `/admin/login`
4. Login with:
   - Email: `admin@textiletwist.com`
   - Password: `Admin@123`

## Step 5: Test Password Reset

1. Go to `/admin/settings`
2. Enter current password: `Admin@123`
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Update Password"

The password reset should work! ✅


