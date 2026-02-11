// Load environment variables FIRST
import { env } from './config/env.js';
import app from './app.js';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = parseInt(env.PORT, 10);

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter((varName) => !env[varName as keyof typeof env]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Supabase URL: ${env.SUPABASE_URL}`);

  // Self-ping mechanism to keep Render service alive
  // Only enable in production so local dev doesn't spam timeouts
  if (env.NODE_ENV === 'production') {
    const startSelfPing = () => {
      const pingInterval = 30000; // 30 seconds
      const healthUrl = new URL('/health', env.BACKEND_URL);
      
      const pingSelf = () => {
        const options = {
          hostname: healthUrl.hostname,
          port: healthUrl.port || (healthUrl.protocol === 'https:' ? 443 : 80),
          path: healthUrl.pathname,
          method: 'GET',
          timeout: 5000,
        };
        
        // Use https module if URL is https
        const httpModule = healthUrl.protocol === 'https:' ? https : http;
        
        const req = httpModule.request(options, (res: http.IncomingMessage) => {
          if (res.statusCode === 200) {
            console.log(`🔄 Self-ping successful at ${new Date().toISOString()}`);
          } else {
            console.warn(`⚠️ Self-ping returned status ${res.statusCode}`);
          }
        });
        
        req.on('error', (error: Error) => {
          console.error('❌ Self-ping failed:', error.message);
        });
        
        req.on('timeout', () => {
          req.destroy();
          console.warn('⚠️ Self-ping timeout');
        });
        
        req.end();
      };
      
      // Start pinging immediately, then every 30 seconds
      pingSelf();
      setInterval(pingSelf, pingInterval);
      
      console.log(`🔄 Self-ping enabled (every ${pingInterval / 1000} seconds) - URL: ${healthUrl.toString()}`);
    };
    
    startSelfPing();
  } else {
    console.log('ℹ️ Self-ping disabled in non-production environment');
  }
});

