# Environment Variables Setup Guide

## Backend (.env file)

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Optional Variables (with defaults)

```env
# Server Configuration
PORT=5000                    # Default: 5000
NODE_ENV=development         # Default: development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173  # Default: http://localhost:5173
```

### How to Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

### Example Backend .env File

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzNDU2Nzg5LCJleHAiOjE5MzkwMzI3ODl9.example
```

---

## Frontend (.env file)

Create a `.env` file in the **root** directory (same level as `package.json`) with:

### Optional Variable (with default)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000  # Default: http://localhost:5000
```

### Example Frontend .env File

```env
VITE_API_URL=http://localhost:5000
```

### For Production

If deploying to production, update the frontend `.env`:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Quick Setup Steps

### 1. Backend Setup

```bash
cd backend

# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
nano .env  # or use your preferred editor
```

### 2. Frontend Setup

```bash
# From the root directory

# Copy the example file
cp .env.example .env

# Edit .env if you need to change the API URL
nano .env  # or use your preferred editor
```

---

## Important Notes

### Security

- ⚠️ **Never commit `.env` files to Git!** They're already in `.gitignore`
- ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend**
- ⚠️ Keep your service role key secret - it bypasses all security rules

### Vite Environment Variables

- Frontend env variables must be prefixed with `VITE_` to be accessible in the browser
- Access them using `import.meta.env.VITE_API_URL`
- Restart the dev server after changing `.env` files

### Backend Environment Variables

- Backend uses `process.env.VARIABLE_NAME`
- Restart the server after changing `.env` files
- The server will fail to start if required variables are missing

---

## Troubleshooting

### "Missing required environment variables"
- Check that your `.env` file exists in the correct location
- Verify variable names match exactly (case-sensitive)
- Make sure there are no spaces around the `=` sign

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Make sure both frontend and backend are running
- Check that `credentials: 'include'` is used in fetch requests

### Cannot Connect to Supabase
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure your network allows connections to Supabase

### API Not Found (404)
- Check that `VITE_API_URL` matches your backend server URL
- Verify the backend server is running
- Check the backend port matches the URL

---

## File Structure

```
textiletwist/
├── .env                    # Frontend environment variables
├── .env.example           # Frontend example
├── backend/
│   ├── .env               # Backend environment variables
│   └── .env.example       # Backend example
└── ...
```


