# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (~2 minutes)
3. Go to **Settings > API** in your Supabase dashboard
4. Copy these three values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - keep this secret!

### 3. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication > Providers**
2. Find "Email" in the list
3. Make sure it's **enabled** (should be enabled by default)

### 4. Create Environment File

Create a file named `.env` in the `backend/` folder with this content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Supabase Configuration (REPLACE WITH YOUR VALUES)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Replace the placeholder values with your actual Supabase credentials!

### 5. Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:5000
📊 Environment: development
🔗 Supabase URL: https://YOUR_PROJECT.supabase.co
```

### 6. Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-02T..."}
```

### 7. Test Authentication (Optional)

**Sign Up:**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Current User:**
```bash
curl http://localhost:5000/auth/me -b cookies.txt
```

## Common Issues

### "Missing required environment variables"
- Make sure your `.env` file exists in the `backend/` folder
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly

### "Cannot find module"
- Run `npm install` in the `backend/` folder
- Make sure you're in the correct directory

### CORS errors from frontend
- Verify `FRONTEND_URL=http://localhost:5173` in your `.env`
- Make sure both frontend and backend are running

### Port already in use
- Change `PORT=5000` to another port in `.env` (e.g., `PORT=5001`)
- Or stop the process using port 5000

## Next Steps

Once the backend is running:
1. Start your frontend (`npm run dev` from the root folder)
2. The frontend should be able to call the backend API
3. You'll need to update your frontend auth pages to call these endpoints:
   - `POST http://localhost:5000/auth/signup`
   - `POST http://localhost:5000/auth/login`
   - `POST http://localhost:5000/auth/logout`
   - `GET http://localhost:5000/auth/me`

## Project Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── routes.ts       # Auth endpoints (signup, login, logout, me)
│   │   ├── middleware.ts   # requireAuth middleware
│   │   └── cookies.ts      # Cookie configuration
│   ├── supabase/
│   │   └── client.ts       # Supabase client initialization
│   ├── app.ts              # Express app with middleware & routes
│   └── index.ts            # Server entry point
├── .env                    # Your environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md               # Detailed documentation
└── SETUP.md                # This file
```

## Development Workflow

1. Make changes to any `.ts` file
2. The server automatically restarts (via `tsx watch`)
3. Test your changes
4. Repeat!

Happy coding! 🚀

