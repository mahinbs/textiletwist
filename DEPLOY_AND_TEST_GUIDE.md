# Deploy & Test Guide

## What's Ready to Deploy

### 1. Cross-Domain Auth Fix
- ✅ Authorization header support
- ✅ localStorage token storage
- ✅ Fixes 401 errors
- ✅ Fixes logout on home click

### 2. Razorpay Payment Integration
- ✅ Payment gateway integrated
- ✅ Create order endpoint
- ✅ Verify payment endpoint
- ✅ Frontend Razorpay checkout

### 3. Order Tracking System
- ✅ Order confirmation page
- ✅ Track order page (public - no login)
- ✅ Order number display
- ✅ Status timeline
- ✅ Navbar track order icon

### 4. Guest Checkout
- ✅ Buy Now works without login
- ✅ Cart/Wishlist require login
- ✅ Checkout page for guests

## Deploy Commands

### Option 1: Deploy Everything Together
```bash
cd /Users/animesh/Documents/BoostMySites/textiletwist

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add Razorpay payment, order tracking, guest checkout & fix auth"

# Push to trigger auto-deployment
git push
```

### Option 2: Deploy Backend First, Then Frontend
```bash
# Backend only
cd backend
git add .
git commit -m "feat: Add Razorpay payment & public order tracking"
git push

# Wait for Render deployment to complete

# Then frontend
cd ..
git add .
git commit -m "feat: Add order tracking UI, guest checkout & auth fix"
git push
```

## Post-Deployment Setup

### 1. Update Razorpay Environment Variables (Render)

Go to Render Dashboard → textiletwist (backend) → Environment

Add/Update:
```
RAZORPAY_KEY_ID=rzp_test_SELZ9BKhnLJYCi
RAZORPAY_KEY_SECRET=jLDJfCHMOww0z3Ntq7CJkpCg
RAZORPAY_WEBHOOK_SECRET=rextile_twist
FRONTEND_URL=https://textiletwiststjohns.com,https://www.textiletwiststjohns.com
```

Click "Save Changes" → Backend will auto-redeploy

### 2. Run Database Migration

Go to Supabase Dashboard → SQL Editor

Run this SQL:
```sql
-- Add Razorpay payment fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255);

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment ON orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON orders(razorpay_order_id);
```

## Testing Checklist

### Test 1: Auth Fix
- [ ] Login to account
- [ ] Click Home icon → Should stay logged in ✅
- [ ] Refresh page → Should stay logged in ✅
- [ ] Check DevTools → Application → Local Storage → Should see `auth_token`

### Test 2: Guest Checkout (Buy Now)
- [ ] Logout (or use incognito)
- [ ] Go to any product
- [ ] Click "Add to Cart" → Should redirect to login ✅
- [ ] Click "Add to Wishlist" → Should redirect to login ✅
- [ ] Click "Buy Now" → Should go to checkout ✅
- [ ] Fill details & click "Place Order"
- [ ] Should see order confirmation page with order number ✅

### Test 3: Razorpay Payment
- [ ] Go to checkout
- [ ] Select "Online Payment"
- [ ] Fill all details
- [ ] Click "Pay Now"
- [ ] Razorpay modal should open ✅
- [ ] Use test card: **4111 1111 1111 1111**, CVV: 123, Expiry: any future date
- [ ] Complete payment
- [ ] Should see order confirmation page ✅
- [ ] Order should show payment_status = "paid" ✅

### Test 4: Order Tracking
- [ ] After placing order, copy order number from confirmation page
- [ ] Click "Track Your Order" button OR
- [ ] Go to navbar → Click package icon OR
- [ ] Go to footer → Click "Track Order" link
- [ ] Enter order number
- [ ] Should see order details ✅
- [ ] Timeline should show current status ✅
- [ ] Try with wrong order number → Should show error ✅

### Test 5: Order Confirmation Page
- [ ] After placing order, should auto-redirect to `/order-confirmation?order_id=xxx`
- [ ] Should see:
  - ✅ Big green checkmark
  - ✅ "Order Placed Successfully!"
  - ✅ Order number in huge text
  - ✅ Current status
  - ✅ Order summary (items, prices)
  - ✅ Payment details
  - ✅ Shipping address
  - ✅ "Track Your Order" button
  - ✅ "Continue Shopping" button

## Troubleshooting

### Issue: Still getting 401 errors
**Solution:**
1. Clear browser cache and localStorage
2. Check if backend environment variables are set
3. Check if backend redeployed successfully
4. Look at Network tab → Check if Authorization header is present

### Issue: Razorpay not opening
**Solution:**
1. Check browser console for errors
2. Verify Razorpay keys are in backend `.env`
3. Check if payment API endpoint is working: DevTools → Network → `/payment/create-order`
4. Make sure Razorpay script is loaded: Check `<head>` for script tag

### Issue: Order confirmation page not showing
**Solution:**
1. Check browser console logs
2. Verify order ID is in URL: `/order-confirmation?order_id=xxx`
3. Check if order was created: Supabase → orders table
4. Check API response in Network tab

### Issue: Track order not finding orders
**Solution:**
1. Make sure order number is correct (case-insensitive)
2. Check Supabase → orders table → verify order_number field
3. Check Network tab → `/orders/track/:orderNumber` → Should return 200
4. Try with email verification

## Monitor After Deployment

### Check Backend Logs (Render)
```
Render Dashboard → textiletwist → Logs
```

Look for:
- ✅ Server started successfully
- ✅ Environment variables loaded
- ✅ No connection errors

### Check Frontend Deployment (Vercel)
```
Vercel Dashboard → textiletwist → Deployments
```

Look for:
- ✅ Build successful
- ✅ No build errors
- ✅ Deployment status: Ready

### Monitor Razorpay Dashboard
```
https://dashboard.razorpay.com/
```

After test payments:
- ✅ Payments should appear in test mode
- ✅ Check payment status
- ✅ Verify webhook events (if configured)

## Success Criteria

✅ **Auth:** Users stay logged in across navigation
✅ **Payment:** Razorpay modal opens and accepts test payments
✅ **Orders:** Orders created with correct order numbers
✅ **Confirmation:** Order confirmation page shows after placing order
✅ **Tracking:** Can track any order using order number
✅ **Guest:** Guest users can buy using Buy Now
✅ **UI:** Track Order icon visible in navbar

## Rollback Plan

If something goes wrong:

```bash
# Find last good commit
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Or reset (destructive)
git reset --hard <commit-hash>
git push --force
```

## Support

If issues persist:
1. Check all error logs (browser console + backend logs)
2. Verify all environment variables are set
3. Check database schema is updated
4. Test API endpoints directly using Postman/Thunder Client

---

**Ready to Deploy:** ✅ YES
**Priority:** HIGH
**Estimated Deployment Time:** 5-10 minutes
**Estimated Testing Time:** 15-20 minutes
