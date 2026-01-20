// Script to create admin user in Supabase
// Run this once: npm run create-admin
// Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the backend directory
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  console.error('Please create a .env file in the backend directory with:');
  console.error('  SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables in .env');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✓ Set' : '✗ Missing');
  console.error('\nPlease check your .env file in the backend directory');
  process.exit(1);
}

// Validate URL format
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.error('❌ Invalid SUPABASE_URL format. Must start with http:// or https://');
  console.error('Current value:', supabaseUrl);
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  try {
    const adminEmail = 'admin@textiletwist.com';
    const adminPassword = 'Admin@123';
    const adminName = 'Admin User';

    console.log('🔐 Creating admin user...');

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: adminName,
      },
    });

    if (authError) {
      if (authError.message.includes('already registered') || authError.code === 'email_exists') {
        console.log('⚠️  User already exists. Resetting password and updating to admin...');
        
        // Get existing user
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === adminEmail);
        
        if (!user) {
          console.error('❌ Could not find existing user');
          return;
        }

        // Reset password
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          {
            password: adminPassword,
            email_confirm: true, // Ensure email is confirmed
          }
        );

        if (passwordError) {
          console.error('❌ Error resetting password:', passwordError);
          return;
        }

        console.log('✅ Password reset successfully!');

        // Update user profile to admin
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: adminName,
            role: 'admin',
          });

        if (profileError) {
          console.error('❌ Error updating profile:', profileError);
        } else {
          console.log('✅ User updated to admin successfully!');
        }

        console.log('\n✅ Admin user password reset successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 New Password:', adminPassword);
        console.log('👤 User ID:', user.id);
        console.log('\n🎉 You can now login with the new password');
        return;
      }
      
      console.error('❌ Error creating user:', authError);
      return;
    }

    if (!authData.user) {
      console.error('❌ User creation failed');
      return;
    }

    console.log('✅ User created in Auth:', authData.user.id);

    // Create user profile with admin role
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        full_name: adminName,
        role: 'admin',
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 User ID:', authData.user.id);
    console.log('\n🎉 You can now login at /admin/login');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createAdminUser();

