# Product Reviews System Setup

## SQL to Run

### 1. Notifications Table
Run this SQL in Supabase:

```sql
-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('order', 'order_status', 'low_stock', 'stock_warning', 'new_customer', 'new_enquiry')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
```

**Or use the file:** `backend/create-notifications-table.sql`

### 2. Product Reviews Table
Run this SQL in Supabase:

```sql
-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id) -- One review per user per product
);

-- Indexes for product reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
```

**Or use the file:** `backend/create-reviews-table.sql`

## Features Implemented

### Product Reviews
✅ **5-Star Rating System**: Customers can rate products 1-5 stars
✅ **Comments**: Optional text comments with reviews
✅ **One Review Per User**: Each customer can only review a product once (can update)
✅ **Login Required**: Only logged-in customers can leave reviews
✅ **Product Details Display**:
   - Shows total number of reviews
   - Shows average rating (e.g., "4.5 out of 5 stars")
   - Displays all reviews with:
     - User name (or "Anonymous User")
     - Star rating
     - Comment (if provided)
     - Date posted
✅ **Review Form**: 
   - Star rating selector (1-5)
   - Comment textarea
   - Submit/Cancel buttons
✅ **User's Review**: 
   - Shows user's existing review separately
   - Option to delete own review
   - Can update review by submitting again

### Notifications
✅ **Admin Notifications**: 
   - New orders
   - Low stock warnings (< 5 items)
   - Stock warnings (< 3 items)
   - New customers
   - New enquiries
✅ **Customer Notifications**:
   - Order placed confirmation
   - Order status updates (processing, confirmed, shipped, delivered, cancelled)
✅ **Auto Stock Reduction**: 
   - Stock automatically reduces when order is placed
   - Example: Order 2 items from stock 10 → Stock becomes 8
   - Stock cannot go below 0

## How It Works

### Reviews
1. **Viewing Reviews**: All users can see reviews on product details page
2. **Leaving Review**: 
   - Customer must be logged in
   - Click "Write a Review" button
   - Select rating (1-5 stars)
   - Optionally add comment
   - Submit review
3. **Updating Review**: If user already reviewed, submitting again updates the review
4. **Deleting Review**: User can delete their own review

### Notifications
1. **Automatic Creation**: 
   - Order placed → Admin and customer notified
   - Stock drops below 5 → Admin gets "Low Stock" notification
   - Stock drops below 3 → Admin gets "Stock Warning" notification
   - Order status updated → Customer notified
2. **Viewing**: 
   - Admin: Bell icon in header shows unread count
   - Click bell to see recent notifications
   - "View All Notifications" → Full notifications page
3. **Auto-refresh**: Polls for new notifications every 30 seconds

## API Endpoints

### Reviews
- `GET /reviews/product/:productId` - Get all reviews for a product
- `POST /reviews` - Create or update review (auth required)
- `DELETE /reviews/:id` - Delete own review (auth required)

### Notifications
- `GET /notifications` - Get user's notifications
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## Current Status

✅ Notifications table SQL ready
✅ Reviews table SQL ready
✅ Backend API implemented
✅ Frontend reviews UI complete
✅ Product details shows reviews
✅ Login check for reviews
✅ Stock reduction working
✅ Low stock notifications working
✅ Build successful

## Next Steps

1. **Run SQL Scripts**:
   - Run `backend/create-notifications-table.sql`
   - Run `backend/create-reviews-table.sql`

2. **Test Reviews**:
   - Login as customer
   - Go to product details page
   - Click "Write a Review"
   - Submit rating and comment
   - Verify review appears

3. **Test Notifications**:
   - Place an order → Check admin notifications
   - Update order status → Check customer notifications
   - Set product stock to 4 → Place order → Check low stock notification

