# Textile Twist API Documentation

Complete API documentation for all endpoints.

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require authentication via HTTP-only cookies. Include `credentials: 'include'` in fetch requests.

---

## 📦 Products API

### Get All Products
```
GET /products
```
**Query Parameters:**
- `category_id` (optional) - Filter by category
- `is_active` (optional) - Filter by active status (true/false)
- `search` (optional) - Search in name and description

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Description",
      "category_id": "uuid",
      "price": 1500.00,
      "discount_percentage": 10.00,
      "quantity": 50,
      "image_url": "https://...",
      "images": ["url1", "url2"],
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "category": {
        "id": "uuid",
        "name": "Category Name",
        "slug": "category-slug"
      }
    }
  ]
}
```

### Get Single Product
```
GET /products/:id
```

### Create Product (Admin Only)
```
POST /products
```
**Body:**
```json
{
  "name": "Product Name",
  "slug": "product-name", // optional, auto-generated if not provided
  "description": "Description",
  "category_id": "uuid", // optional
  "price": 1500.00,
  "discount_percentage": 10.00, // optional, default 0
  "quantity": 50,
  "image_url": "https://...", // optional
  "images": ["url1", "url2"], // optional
  "is_active": true // optional, default true
}
```

### Update Product (Admin Only)
```
PUT /products/:id
```

### Delete Product (Admin Only)
```
DELETE /products/:id
```

---

## 📁 Categories API

### Get All Categories
```
GET /categories
```

### Get Single Category
```
GET /categories/:id
```

### Create Category (Admin Only)
```
POST /categories
```
**Body:**
```json
{
  "name": "Category Name",
  "slug": "category-slug", // optional, auto-generated
  "description": "Description", // optional
  "image_url": "https://..." // optional
}
```

### Update Category (Admin Only)
```
PUT /categories/:id
```

### Delete Category (Admin Only)
```
DELETE /categories/:id
```

---

## 🛒 Cart API

### Get Cart Items
```
GET /cart
```
**Requires:** Authentication

### Add to Cart
```
POST /cart
```
**Requires:** Authentication
**Body:**
```json
{
  "product_id": "uuid",
  "quantity": 2 // optional, default 1
}
```

### Update Cart Item Quantity
```
PUT /cart/:id
```
**Requires:** Authentication
**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /cart/:id
```
**Requires:** Authentication

### Clear Cart
```
DELETE /cart
```
**Requires:** Authentication

---

## ❤️ Wishlist API

### Get Wishlist
```
GET /wishlist
```
**Requires:** Authentication

### Add to Wishlist
```
POST /wishlist
```
**Requires:** Authentication
**Body:**
```json
{
  "product_id": "uuid"
}
```

### Remove from Wishlist
```
DELETE /wishlist/:product_id
```
**Requires:** Authentication

### Check if in Wishlist
```
GET /wishlist/check/:product_id
```
**Requires:** Authentication (optional, returns false if not authenticated)

---

## 🎟️ Coupons API

### Get All Coupons
```
GET /coupons
```
**Public:** Returns only active valid coupons
**Admin:** Returns all coupons

### Get Single Coupon
```
GET /coupons/:id
```

### Validate Coupon
```
POST /coupons/validate
```
**Body:**
```json
{
  "code": "SAVE20",
  "subtotal": 5000.00,
  "category_id": "uuid" // optional, for category-specific coupons
}
```
**Response:**
```json
{
  "coupon": {
    "id": "uuid",
    "code": "SAVE20",
    "name": "20% Off",
    "discount_type": "percentage",
    "discount_value": 20.00
  },
  "discount_amount": 1000.00,
  "valid": true
}
```

### Create Coupon (Admin Only)
```
POST /coupons
```
**Body:**
```json
{
  "code": "SAVE20",
  "name": "20% Off Sale",
  "description": "Description", // optional
  "discount_type": "percentage", // or "fixed"
  "discount_value": 20.00,
  "category_id": "uuid", // optional, null for general coupon
  "min_order_amount": 1000.00, // optional, default 0
  "max_discount_amount": 500.00, // optional, for percentage discounts
  "valid_from": "2024-01-01T00:00:00Z", // optional, default now
  "valid_until": "2024-12-31T23:59:59Z", // optional, null = no expiry
  "usage_limit": 100, // optional, null = unlimited
  "is_active": true // optional, default true
}
```

### Update Coupon (Admin Only)
```
PUT /coupons/:id
```

### Delete Coupon (Admin Only)
```
DELETE /coupons/:id
```

---

## 📦 Orders API

### Get Orders
```
GET /orders
```
**Requires:** Authentication
**Users:** See only their own orders
**Admin:** See all orders

### Get Single Order
```
GET /orders/:id
```
**Requires:** Authentication

### Create Order
```
POST /orders
```
**Requires:** Authentication (optional, for guest checkout)
**Body:**
```json
{
  "cart_items": [
    {
      "product_id": "uuid",
      "quantity": 2
    }
  ],
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+919876543210",
  "shipping_address": "123 Main St",
  "shipping_city": "Mumbai",
  "shipping_state": "Maharashtra",
  "shipping_postal_code": "400001",
  "shipping_country": "India",
  "coupon_code": "SAVE20", // optional
  "shipping_cost": 100.00, // optional, default 0
  "payment_method": "COD" // optional
}
```
**Note:** If user is authenticated, cart items can be omitted (will use user's cart)

### Update Order Status (Admin Only)
```
PUT /orders/:id/status
```
**Body:**
```json
{
  "status": "shipped" // pending, processing, confirmed, shipped, delivered, cancelled
}
```

---

## 📧 Contact Enquiries API

### Get All Enquiries (Admin Only)
```
GET /enquiries
```
**Query Parameters:**
- `status` (optional) - Filter by status (new, read, replied, resolved)
- `search` (optional) - Search in name, email, subject

### Get Single Enquiry (Admin Only)
```
GET /enquiries/:id
```

### Create Enquiry (Public)
```
POST /enquiries
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Bulk Order Inquiry",
  "message": "I would like to place a bulk order..."
}
```

### Update Enquiry Status (Admin Only)
```
PUT /enquiries/:id/status
```
**Body:**
```json
{
  "status": "read" // new, read, replied, resolved
}
```

### Delete Enquiry (Admin Only)
```
DELETE /enquiries/:id
```

---

## 🔐 Authentication API

### Sign Up
```
POST /auth/signup
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe" // optional
}
```

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Logout
```
POST /auth/logout
```

### Get Current User
```
GET /auth/me
```
**Requires:** Authentication

### Refresh Token
```
POST /auth/refresh
```

---

## Error Responses

All endpoints may return the following error formats:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Frontend Usage

```javascript
// Fetch products
const response = await fetch('http://localhost:5000/products', {
  credentials: 'include'
});
const { products } = await response.json();

// Add to cart (requires authentication)
const response = await fetch('http://localhost:5000/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    product_id: 'uuid',
    quantity: 2
  })
});

// Create order
const response = await fetch('http://localhost:5000/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+919876543210',
    shipping_address: '123 Main St',
    // ... other fields
  })
});
```

---

## Database Schema

See `supabase-schema.sql` for complete database structure.

**Key Tables:**
- `products` - Product catalog
- `categories` - Product categories
- `cart` - User shopping cart
- `wishlist` - User wishlist
- `orders` - Order records
- `order_items` - Order line items
- `coupons` - Discount coupons
- `coupon_usage` - Coupon usage tracking
- `contact_enquiries` - Contact form submissions
- `user_profiles` - Extended user information

