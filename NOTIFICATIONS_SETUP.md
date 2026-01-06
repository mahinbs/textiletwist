# Notifications System Setup

## Overview

The notifications system provides real-time alerts for:
- **Admin**: New orders, low stock warnings, new customers, new enquiries
- **Customers**: Order status updates, order confirmations

## Database Setup

Run the updated `supabase-schema.sql` which includes the notifications table:

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
```

## How It Works

### Automatic Stock Reduction
- When an order is placed, product stock is **automatically reduced**
- Example: Order 2 items from stock of 10 → Stock becomes 8
- Stock cannot go below 0 (protected)

### Low Stock Notifications (Admin Only)
- **Warning** (< 3 items): Red alert - "Stock Warning: [Product Name]"
- **Low Stock** (< 5 items): Yellow alert - "Low Stock: [Product Name]"
- Notifications created automatically when stock drops below thresholds

### Order Notifications
- **Admin**: Receives notification when new order is placed
- **Customer**: Receives notification when:
  - Order is placed
  - Order status changes (processing, confirmed, shipped, delivered, cancelled)

### Notification Types
1. **order**: New order placed
2. **order_status**: Order status updated
3. **low_stock**: Product stock below 5
4. **stock_warning**: Product stock below 3
5. **new_customer**: New customer registered (admin only)
6. **new_enquiry**: New contact enquiry (admin only)

## Features

### Admin Panel
- **Bell Icon**: Shows unread count badge
- **Dropdown**: Shows last 10 notifications
- **Notifications Page**: View all notifications, filter by unread, mark as read/delete
- **Auto-refresh**: Polls for new notifications every 30 seconds

### Customer
- Notifications appear in profile page (to be implemented)
- Order status updates sent automatically

## API Endpoints

- `GET /notifications` - Get user's notifications
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## Testing

1. **Test Stock Reduction**:
   - Create an order with 2 items
   - Check product stock is reduced by 2

2. **Test Low Stock**:
   - Set product stock to 4
   - Place order for 2 items
   - Admin should receive "Low Stock" notification

3. **Test Stock Warning**:
   - Set product stock to 2
   - Place order for 1 item
   - Admin should receive "Stock Warning" notification

4. **Test Order Notifications**:
   - Place an order → Admin and customer get notifications
   - Update order status → Customer gets notification

## Current Status

✅ Notifications table created
✅ Backend API implemented
✅ Stock reduction on order
✅ Low stock detection
✅ Admin notifications working
✅ Notifications page created
✅ Auto-polling every 30 seconds
⏳ Customer notifications in profile (to be added)


