# Clear Browser Cache and Test

## Step 1: Clear Everything

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab
3. In left sidebar, click **Storage**
4. Click **"Clear site data"** button
5. Check ALL boxes:
   - ✅ Local and session storage
   - ✅ IndexedDB
   - ✅ Cookies
   - ✅ Cache storage
6. Click **Clear site data**

## Step 2: Hard Refresh

1. Close DevTools
2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

## Step 3: Try Login

1. Go to: `https://textiletwistjohns.com/auth`
2. Login with:
   - Email: admin@textiletwist.com
   - Password: Admin@123
3. Watch the Network tab for any errors

## If Still Not Working

Open DevTools → Network tab → Try logging in → Screenshot any RED/failed requests
