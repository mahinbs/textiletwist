# Vercel Deployment Guide

This guide will help you deploy the Textile Twist frontend to Vercel.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com))
2. Your backend deployed on Render at `https://textiletwist.onrender.com`
3. Your project connected to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect it as a Vite project

### 2. Configure Build Settings

Vercel should auto-detect these settings from `vercel.json`:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables

**IMPORTANT**: You must set the following environment variable in Vercel:

1. Go to your project settings in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
Variable Name: VITE_API_URL
Value: https://textiletwist.onrender.com
Environment: Production, Preview, Development (select all)
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Environment Variables

### Required for Frontend

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://textiletwist.onrender.com` | Backend API URL |

### Setting Environment Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable with the appropriate value
3. Select which environments to apply it to (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

## Backend Configuration

Make sure your backend on Render has the correct CORS settings:

1. In your Render backend `.env` file, set:
   ```
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```

2. Or if you have a custom domain:
   ```
   FRONTEND_URL=https://yourdomain.com
   ```

## Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `FRONTEND_URL` in your backend `.env` if needed

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### API Calls Fail (CORS Errors)

- Verify `VITE_API_URL` is set correctly in Vercel environment variables
- Check that `FRONTEND_URL` in backend matches your Vercel domain
- Ensure backend CORS is configured correctly

### 404 Errors on Routes

- The `vercel.json` includes a rewrite rule for SPA routing
- All routes should redirect to `index.html`
- If issues persist, check the rewrite configuration

### Environment Variables Not Working

- Vite requires variables to be prefixed with `VITE_`
- Variables must be set in Vercel dashboard, not just `.env` file
- **Redeploy** after adding/changing environment variables
- Variables are embedded at build time, so a new build is required

## File Structure

```
textiletwist/
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── dist/                # Build output (generated)
└── src/                 # Source files
```

## Notes

- The `vercel.json` file handles SPA routing (all routes → `index.html`)
- Static assets are cached for 1 year
- Environment variables must be set in Vercel dashboard
- Backend must be deployed and running on Render before frontend can work
