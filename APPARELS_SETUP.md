# Apparels Categories Setup Guide

## ✅ **Apparels Dropdown Restored**

The Apparels dropdown has been restored in the navbar with:
- **Men** → `/products?category=apparels-men`
- **Women** → `/products?category=apparels-women`
- **Kids** → `/products?category=apparels-kids`

## 📋 **How to Set Up Apparels Categories**

### **Option 1: Create Categories via Admin Panel (Recommended)**

1. Login as admin at `/admin/login`
2. Go to **Categories** page (`/admin/categories`)
3. Create the following categories:

   **Main Apparels Category:**
   - Name: `Apparels`
   - Slug: `apparels`
   - Description: `Clothing and apparel products`
   - Status: Active

   **Subcategories:**
   - Name: `Men`
   - Slug: `apparels-men`
   - Description: `Men's clothing`
   - Status: Active

   - Name: `Women`
   - Slug: `apparels-women`
   - Description: `Women's clothing`
   - Status: Active

   - Name: `Kids`
   - Slug: `apparels-kids`
   - Description: `Kids' clothing`
   - Status: Active

### **Option 2: Create via SQL (Quick Setup)**

**First, run this to add the `is_active` column if it doesn't exist:**

```sql
-- Fix categories table - add is_active column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing categories to be active by default
UPDATE categories SET is_active = true WHERE is_active IS NULL;
```

**Then, run this to create Apparels categories:**

```sql
-- Create Apparels categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Men', 'apparels-men', 'Men''s clothing', true),
('Women', 'apparels-women', 'Women''s clothing', true),
('Kids', 'apparels-kids', 'Kids'' clothing', true)
ON CONFLICT (slug) DO NOTHING;
```

**Or use the migration file:** Run `backend/fix-categories-schema.sql` in Supabase SQL Editor.

## 🛍️ **Adding Products to Apparels**

1. Go to **Admin Panel** → **Products** (`/admin/products`)
2. Click **Add Product**
3. Fill in product details
4. In **Category** dropdown, select:
   - `Men` (for men's apparel)
   - `Women` (for women's apparel)
   - `Kids` (for kids' apparel)
5. Save the product

The product will now appear when users click:
- **Apparels** → **Men** (if assigned to Men category)
- **Apparels** → **Women** (if assigned to Women category)
- **Apparels** → **Kids** (if assigned to Kids category)

## 📍 **How It Works**

- **Navbar**: Shows "Apparels" dropdown with Men/Women/Kids
- **Products Page**: Filters products by category slug (e.g., `apparels-men`)
- **Backend**: Categories are stored in `categories` table
- **Products**: Linked to categories via `category_id` foreign key

## ✅ **Current Status**

- ✅ Apparels dropdown restored in Navbar
- ✅ Men/Women/Kids subcategories configured
- ✅ Products can be assigned to Apparels categories
- ✅ Filtering works on Products page
- ✅ Footer also shows Apparels links

**Next Step**: Create the Apparels categories in the database (via Admin Panel or SQL) and start adding apparel products!

