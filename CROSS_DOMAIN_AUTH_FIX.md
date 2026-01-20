# Cross-Domain Authentication Fix

## Problem
Cookies with `sameSite: 'strict'` don't work across different domains. When your frontend is on `textiletwistjohns.com` and backend is on `textiletwist.onrender.com`, authentication cookies are blocked by the browser.

## Changes Made

1. **Updated Cookie Settings** (`backend/src/auth/cookies.ts`):
   - Changed `sameSite: 'strict'` to `sameSite: 'none'` in production
   - This allows cookies to be sent across different domains
   - Still requires HTTPS (`secure: true`)

2. **Updated CORS Configuration** (`backend/src/app.ts`):
   - Added `exposedHeaders: ['Set-Cookie']`
   - Ensures cookies can be set properly

## Required Steps to Fix

### Step 1: Update Backend Environment Variable on Render

1. Go to your Render Dashboard
2. Navigate to your backend service (`textiletwist`)
3. Go to **Environment** tab
4. Update or add this environment variable:

```
FRONTEND_URL = https://textiletwistjohns.com
```

**IMPORTANT**: Replace `https://textiletwistjohns.com` with your actual frontend domain.

### Step 2: Redeploy Backend

1. After updating the environment variable, Render should auto-deploy
2. Or manually trigger a deploy from the Render dashboard
3. Wait for the deploy to complete

### Step 3: Verify Frontend API URL

Make sure your frontend is pointing to the correct backend URL:

- If using direct URL: `VITE_API_URL=https://textiletwist.onrender.com`
- If using Vercel proxy: Don't set `VITE_API_URL` (use `/api` proxy)

### Step 4: Clear Browser Data

After deploying:
1. Clear cookies and site data for your domain
2. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Try logging in again

## How Cookies Now Work

### Development (localhost):
- `sameSite: 'lax'` - works fine on localhost
- `secure: false` - allows HTTP

### Production:
- `sameSite: 'none'` - allows cross-domain cookies
- `secure: true` - requires HTTPS (both domains must use HTTPS)
- `credentials: 'include'` - frontend sends cookies with requests
- CORS must allow the frontend origin

## Testing the Fix

1. Open DevTools → Network tab
2. Login at `/auth`
3. Check the login response:
   - Should see `Set-Cookie` headers
   - Cookies should have `SameSite=None; Secure`
4. Navigate to `/admin`
5. Check subsequent requests:
   - Should include `Cookie` header with the auth tokens

## Troubleshooting

### Still getting 401 Unauthorized?

1. **Check Render Environment Variable**:
   - `FRONTEND_URL` must match your exact frontend domain
   - Include protocol (`https://`)
   - No trailing slash

2. **Check Browser Console for CORS errors**:
   - If you see CORS errors, the `FRONTEND_URL` is wrong

3. **Check if cookies are being set**:
   - DevTools → Application → Cookies
   - Should see `sb_access_token` and `sb_refresh_token`

4. **Verify HTTPS on both domains**:
   - Both frontend and backend must use HTTPS
   - `sameSite: 'none'` requires secure connections

### Alternative Solution: Use a Proxy

If cross-domain cookies still don't work, use a reverse proxy:

1. Configure your frontend domain to proxy `/api/*` to the backend
2. This makes requests appear to be same-domain
3. Allows `sameSite: 'strict'` to work

## Security Notes

- `sameSite: 'none'` is less secure than `'strict'`
- Make sure your frontend domain is correctly set in `FRONTEND_URL`
- Never disable `httpOnly` or `secure` in production
- Consider using a proxy for better security
