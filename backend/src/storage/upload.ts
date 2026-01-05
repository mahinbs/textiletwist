import { supabaseAdmin } from '../supabase/client.js';

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket (e.g., 'products/image.jpg')
 * @param file - The file buffer or Blob
 * @param contentType - The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    if (!supabaseAdmin) {
      return { url: null, error: 'Supabase admin client not initialized' };
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Upload file error:', error);
    return { url: null, error: 'Failed to upload file' };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase admin client not initialized' };
    }

    // Extract path from full URL if needed
    const filePath = path.includes('/storage/v1/object/public/') 
      ? path.split('/storage/v1/object/public/')[1]?.split('/').slice(1).join('/')
      : path;

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

/**
 * Extract file path from Supabase Storage URL
 */
export function extractFilePathFromUrl(url: string, _bucket: string): string | null {
  try {
    // Supabase Storage URLs are like: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    if (match) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

