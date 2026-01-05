# Supabase Storage Setup Guide

## Overview

This project uses **Supabase Storage** to store product and category images. Images are uploaded to a storage bucket called `product-images` and the public URLs are stored in the database.

## ⚠️ IMPORTANT: Bucket Must Be Created Manually

**The storage bucket is NOT auto-created.** You must create it manually in the Supabase dashboard before uploading images.

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** (left sidebar)
3. Click **New bucket** (or **Create bucket**)
4. Configure the bucket:
   - **Name**: `product-images` (exact name required)
   - **Public bucket**: ✅ **Enable** (check this box - images need to be publicly accessible)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
5. Click **Create bucket**

**Note**: If you don't create this bucket, image uploads will fail with an error like "Bucket not found".

## Step 2: Configure Bucket Policies (RLS)

After creating the bucket, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies** → `product-images`
2. Click **New Policy**
3. Create a policy for **Public Access** (for reading images):

   **Policy Name**: `Public Read Access`
   **Allowed Operation**: `SELECT`
   **Policy Definition**:
   ```sql
   true
   ```
   (This allows anyone to read/view images)

4. Click **Save**

5. For **Admin Upload Access**, create another policy:

   **Policy Name**: `Admin Upload Access`
   **Allowed Operation**: `INSERT`
   **Policy Definition**:
   ```sql
   auth.role() = 'admin'
   ```
   (Only admins can upload - but since we use service role key in backend, this is handled server-side)

6. For **Admin Delete Access**:

   **Policy Name**: `Admin Delete Access`
   **Allowed Operation**: `DELETE`
   **Policy Definition**:
   ```sql
   auth.role() = 'admin'
   ```

## Step 3: Verify Setup

The backend uses the **service role key** to upload files, which bypasses RLS. However, the bucket must be public for images to be accessible via public URLs.

## Bucket Structure

Images are organized in the bucket as follows:

```
product-images/
  ├── categories/
  │   ├── [uuid].jpg
  │   ├── [uuid].png
  │   └── ...
  └── products/
      ├── [uuid].jpg
      ├── [uuid].png
      └── ...
```

## How It Works

1. **Frontend**: User selects image(s) in admin panel
2. **Frontend**: Files are sent to backend via `/upload/category` or `/upload/product`
3. **Backend**: Files are uploaded to Supabase Storage bucket `product-images`
4. **Backend**: Returns public URLs of uploaded images
5. **Frontend**: Stores URLs in database (not the actual files)

## API Endpoints

- `POST /upload/category` - Upload single category image (admin only)
- `POST /upload/product` - Upload multiple product images (admin only, max 10)
- `DELETE /upload` - Delete an image from storage (admin only)

## Environment Variables

No additional environment variables needed - uses the same Supabase credentials:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (for backend uploads)

## Troubleshooting

### Images not showing?
- Check that the bucket is set to **Public**
- Verify the RLS policy allows `SELECT` operations
- Check browser console for CORS errors

### Upload fails?
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check file size limits (default: 5MB)
- Ensure file type is allowed (images only)

### 403 Forbidden errors?
- Bucket must be public for images to be accessible
- Check RLS policies are set correctly

## Migration from Base64

If you were previously storing images as base64 in the database:

1. Images are already in the database as base64 data URLs
2. New uploads will use Supabase Storage
3. Old base64 images will continue to work
4. You can optionally migrate old images by:
   - Downloading base64 images
   - Uploading to Supabase Storage
   - Updating database URLs

