# AUTH DEBUG - URGENT FIX NEEDED

## Current Issue:
User logs in successfully but gets logged out when clicking Home or Profile

## What to Check NOW:

### 1. Open Browser Console (F12)
- Go to Console tab
- Clear all logs
- Try to login
- Watch for these errors:
  - Any 401 errors
  - Any "clearAuthToken" messages
  - Any API errors

### 2. Check localStorage
After login, in Console tab run:
```javascript
localStorage.getItem('auth_token')
```

**Should see:** A long JWT token string
**If null:** Token is NOT being saved!

### 3. Check Network Tab
- Open Network tab (F12)
- Login
- Look for POST to `/auth/login`
- Click on it → Response tab
- **Should see:** `access_token` in response
- **If missing:** Backend not returning token!

### 4. Check Backend Logs
Look at terminal 3 (backend) when you login:
- Should see: "Login successful" or similar
- Any errors?

## Common Causes:

### A. Backend not returning `access_token` in response
**Fix:** Check `backend/src/auth/routes.ts` line 128
Should have:
```typescript
access_token: data.session.access_token
```

### B. Token being cleared on some API call
**Fix:** Already fixed in `src/lib/api.ts` lines 74, 113
But needs dev server restart!

### C. Backend rejecting requests with 401
**Fix:** Check backend `/auth/me` endpoint
Might need to update admin check code

## QUICK TEST:

In browser console after "successful" login, run:
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('auth_token'));

// Check if user exists
console.log('User:', localStorage.getItem('user'));

// Try manual API call
fetch('http://localhost:5001/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log('Me:', d));
```

## Expected Output:
```
Token: eyJhbGc... (long string)
User: {"id":"...","email":"...","role":"user"}
Me: {user: {...}}
```

## If Token is NULL:
Backend is NOT returning access_token in login response!

## If Me API returns 401:
Backend auth check is failing!

---

**DO THE TESTS ABOVE AND TELL ME THE RESULTS!**
