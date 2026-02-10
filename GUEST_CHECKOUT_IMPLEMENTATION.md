# Guest Checkout & Auth Fix Implementation

## Changes Made

### Problem
1. Users were getting logged out when clicking the home icon
2. Cart and Wishlist required authentication but didn't redirect to login
3. No way for guests to checkout (Buy Now didn't work for non-logged users)

### Solution Implemented

#### 1. Fixed Add to Cart & Wishlist (Redirect to Login)

**File:** `src/pages/ProductDetailsPage.tsx`

- Added login check before adding to cart
- Added login check before adding to wishlist
- Redirects to `/auth` page if user not logged in

```typescript
const handleAddToCart = async () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
        alert('Please login to add items to cart');
        navigate('/auth');
        return;
    }
    // ... rest of cart logic
};

const handleAddToWishlist = async () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
        alert('Please login to add items to wishlist');
        navigate('/auth');
        return;
    }
    // ... rest of wishlist logic
};
```

#### 2. Implemented Guest Checkout (Buy Now)

**Files:**
- `src/pages/ProductDetailsPage.tsx` - Updated Buy Now handler
- `src/pages/CheckoutPage.tsx` - NEW page for direct checkout
- `src/App.tsx` - Added `/checkout` route

**How it works:**

1. User clicks "Buy Now" on product page
2. Product data is stored in `sessionStorage`
3. User is redirected to `/checkout` page
4. Checkout page loads product from sessionStorage (no login required)
5. User fills in their details and completes payment
6. Order is created as guest order
7. sessionStorage is cleared

```typescript
const handleBuyNow = async () => {
    if (!product) return;
    
    // Stock validation...
    
    // Store product in session storage for direct checkout
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
        product_id: product.id,
        product: product,
        quantity: 1,
        size: selectedSize
    }));
    
    navigate('/checkout');
};
```

#### 3. Created Dedicated Checkout Page

**File:** `src/pages/CheckoutPage.tsx`

- Handles both guest checkout (from Buy Now) and cart checkout (logged in users)
- Loads product from sessionStorage for guest checkout
- Loads cart items via API for logged-in users
- Uses the same CheckoutForm component
- Clears sessionStorage after order completion

### User Flow

#### Guest User (Not Logged In)
1. **Add to Cart** → Alert + Redirect to login page
2. **Add to Wishlist** → Alert + Redirect to login page
3. **Buy Now** → Direct to checkout, fill details, complete order ✅

#### Logged In User
1. **Add to Cart** → Works normally, adds to cart
2. **Add to Wishlist** → Works normally, adds to wishlist
3. **Buy Now** → Direct to checkout, fill details, complete order
4. **Regular Cart Checkout** → Go to cart page → Checkout → Fill details → Complete order

### Auth Persistence Issue

The auth cookie issue (users getting logged out) is related to cookie settings:

**Current Settings** (`backend/src/auth/cookies.ts`):
```typescript
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,        // Requires HTTPS
  sameSite: 'none',    // Allows cross-domain
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
```

**Requirements for cookies to persist:**
1. Backend must be on HTTPS (not http)
2. Frontend domain must be in CORS allowed origins
3. Cookies must be sent with `credentials: 'include'` (already done in api.ts)

**Check your `.env` files:**

Backend `.env`:
```env
FRONTEND_URL=https://textiletwiststjohns.com
BACKEND_URL=https://your-backend-domain.com
```

Frontend `.env`:
```env
VITE_API_URL=https://your-backend-domain.com
```

### Testing Checklist

#### As Guest User
- [ ] Click "Add to Cart" → Should alert and redirect to /auth
- [ ] Click "Add to Wishlist" → Should alert and redirect to /auth
- [ ] Click "Buy Now" → Should go to checkout
- [ ] Fill checkout form → Should create order successfully
- [ ] Check order email confirmation

#### As Logged In User
- [ ] Login successfully
- [ ] Navigate to home (should stay logged in)
- [ ] Add to cart → Works
- [ ] Add to wishlist → Works
- [ ] Buy Now → Direct checkout works
- [ ] Regular cart checkout works
- [ ] Logout → Logs out properly

### Database Schema

No changes needed! Guest orders work with existing schema:
- `orders` table has `user_id` as nullable (for guest orders)
- Customer details are stored in order (customer_name, customer_email, etc.)
- Guest orders have `user_id = NULL`
- Logged-in user orders have `user_id = <user's id>`

### Routes Added

```
GET  /checkout  - Checkout page (works for both guests and logged-in users)
```

### Files Modified

1. `src/pages/ProductDetailsPage.tsx` - Added login checks, updated Buy Now
2. `src/pages/CheckoutPage.tsx` - NEW - Dedicated checkout page
3. `src/App.tsx` - Added /checkout route

### Files Not Modified (No Backend Changes Needed)

- All backend routes remain the same
- Cart endpoints still require auth (as intended)
- Order creation endpoint works for both guests and logged-in users
- No database schema changes needed

## Deployment Notes

1. **Environment Variables**
   - Ensure `FRONTEND_URL` in backend matches your production domain
   - Ensure `VITE_API_URL` in frontend matches your backend domain
   - Both must use HTTPS in production

2. **Cookie Settings**
   - `secure: true` requires HTTPS
   - `sameSite: 'none'` requires secure cookies
   - If you see cookie issues, check browser dev tools → Application → Cookies

3. **CORS**
   - Backend CORS must include frontend domain
   - Already configured in `backend/src/app.ts`

## Benefits

1. **Better UX** - Guests can buy without creating account
2. **Higher Conversion** - No friction for one-time buyers
3. **Clear Flow** - Users know when login is required
4. **Security** - Cart/Wishlist still protected for logged-in users
5. **Flexibility** - Both guest and user checkouts supported

## Future Enhancements

1. **Guest Cart in localStorage**
   - Store guest cart in localStorage
   - Merge with user cart on login

2. **Create Account After Order**
   - Offer account creation after guest checkout
   - Convert guest order to user order

3. **Email Order Tracking**
   - Send tracking link to guest email
   - Allow order status check without login

---

**Implementation Date:** February 10, 2026
**Status:** ✅ Ready for Testing
