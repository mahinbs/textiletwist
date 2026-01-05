// Quick script to check if .env file is set up correctly
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('🔍 Checking .env file...\n');

if (!existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  console.error('\n📝 Please create a .env file with the following content:\n');
  console.log('PORT=5000');
  console.log('NODE_ENV=development');
  console.log('FRONTEND_URL=http://localhost:5173');
  console.log('SUPABASE_URL=https://kbtgpgkiojeqnssenlof.supabase.co');
  console.log('SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGdwZ2tpb2plcW5zc2VubG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTAwNjgsImV4cCI6MjA4MzE4NjA2OH0.4GadKjMZkICT1c9UE4vsQwCq6YK2gDMczRYy_8Jktu4');
  console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGdwZ2tpb2plcW5zc2VubG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYxMDA2OCwiZXhwIjoyMDgzMTg2MDY4fQ.vaBvvy1SisYMqYnvujCPmVI0fpdD_YxD7AGjUq0g0-0');
  process.exit(1);
}

config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

console.log('📄 .env file found!\n');
console.log('✅ SUPABASE_URL:', supabaseUrl ? (supabaseUrl.startsWith('http') ? '✓ Valid' : '✗ Invalid format') : '✗ Missing');
if (supabaseUrl) {
  console.log('   Value:', supabaseUrl.substring(0, 50) + '...');
}

console.log('✅ SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
if (supabaseAnonKey) {
  console.log('   Length:', supabaseAnonKey.length, 'characters');
}

console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
if (supabaseServiceKey) {
  console.log('   Length:', supabaseServiceKey.length, 'characters');
}

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('\n❌ Some required variables are missing!');
  process.exit(1);
}

if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.error('\n❌ SUPABASE_URL must start with http:// or https://');
  console.error('   Current value:', supabaseUrl);
  process.exit(1);
}

console.log('\n✅ All environment variables are set correctly!');
console.log('🚀 You can now run: npm run create-admin');

