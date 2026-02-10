# Cross-Domain Authentication Fix

## Problem

Users were getting logged out immediately after login because:
- Frontend: `textiletwiststjohns.com`
- Backend: `textiletwist.onrender.com`
- Cookies with `sameSite: 'none'` don't work reliably cross-domain
- Browser blocks third-party cookies

## Solution

Switched from **cookies-only** to **localStorage + Authorization headers** (works perfectly cross-domain)

## Changes Made

### Frontend (`src/lib/api.ts`)

1. **Added token management functions:**
   - `getAuthToken()` - Gets token from localStorage
   - `setAuthToken()` - Saves token to localStorage
   - `clearAuthToken()` - Removes token from localStorage

2. **Updated `apiRequest()` function:**
   - Adds `Authorization: Bearer <token>` header if token exists
   - Clears token on 401 responses

3. **Updated auth API calls:**
   - `login()` - Saves token to localStorage after successful login
   - `signup()` - Saves token to localStorage after successful signup
   - `logout()` - Clears token from localStorage

### Backend

1. **Updated auth routes** (`backend/src/auth/routes.ts`):
   - `/auth/login` - Now returns `access_token` in response body
   - `/auth/signup` - Now returns `access_token` in response body

2. **Updated auth middleware** (`backend/src/auth/middleware.ts`):
   - `requireAuth()` - Now checks both `Authorization` header AND cookies
   - `optionalAuth()` - Now checks both `Authorization` header AND cookies
   - Priority: Authorization header first, then cookies (for backward compatibility)

## How It Works Now

### Login Flow
1. User enters credentials
2. Frontend calls `/auth/login`
3. Backend validates and returns `access_token` in response body
4. Frontend saves token to `localStorage`
5. All subsequent requests include `Authorization: Bearer <token>` header

### Authenticated Requests
1. Frontend gets token from `localStorage`
2. Adds `Authorization: Bearer <token>` header to request
3. Backend checks header first, then cookies
4. Backend verifies token and attaches user to `req.user`

### Logout Flow
1. User clicks logout
2. Frontend calls `/auth/logout`
3. Frontend clears token from `localStorage`
4. User is logged out

## Benefits

✅ Works across different domains
✅ No cookie issues
✅ No browser blocking
✅ Backward compatible with cookies
✅ Token persists even after page refresh
✅ Works in incognito mode

## Deployment Steps

### 1. Deploy Backend

```bash
cd backend
git add .
git commit -m "Fix: Add Authorization header support for cross-domain auth"
git push
```

Your Render deployment will auto-deploy.

### 2. Deploy Frontend

```bash
git add .
git commit -m "Fix: Switch to localStorage + Authorization headers for auth"
git push
```

Your Vercel deployment will auto-deploy.

### 3. Test

1. **Clear browser data** (important!):
   - Open DevTools → Application → Clear storage → Clear site data
   
2. **Test login:**
   - Go to login page
   - Enter credentials
   - Should stay logged in after clicking home
   
3. **Check localStorage:**
   - DevTools → Application → Local Storage
   - Should see `auth_token`
   
4. **Check network:**
   - DevTools → Network
   - Check any API request
   - Should see `Authorization: Bearer <token>` in headers

## No Environment Variables Changed

No changes needed to `.env` files. Everything works as-is.

## Files Modified

### Frontend
- `src/lib/api.ts` - Added token management and Authorization headers

### Backend
- `backend/src/auth/routes.ts` - Return access_token in response body
- `backend/src/auth/middleware.ts` - Check Authorization header

## Migration Notes

### For Existing Users
- Old users with cookies will continue to work (backward compatible)
- New logins will use localStorage
- Eventually all users will migrate to new system

### For New Users
- Will use localStorage from the start
- No cookie issues

## Security Considerations

1. **XSS Protection**
   - localStorage is vulnerable to XSS
   - Make sure to sanitize all user inputs
   - Use Content Security Policy (CSP)

2. **Token Expiry**
   - Tokens expire after 7 days (Supabase default)
   - Users need to login again after expiry
   - Consider implementing token refresh

3. **HTTPS Required**
   - Both domains must use HTTPS
   - Already configured

## Troubleshooting

### User still getting 401 errors
- Clear browser cache and localStorage
- Check DevTools → Network → Request Headers
- Should see `Authorization: Bearer <token>`

### Token not saving
- Check browser localStorage support
- Check if site is on HTTPS
- Check browser console for errors

### Token not being sent
- Check `Authorization` header in request
- Check if token exists in localStorage
- Verify API_BASE_URL is correct

---

**Status:** ✅ Ready to Deploy
**Date:** February 10, 2026
**Priority:** HIGH - Fixes critical auth issue
