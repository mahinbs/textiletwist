/**
 * Convert a file to base64 data URL (for preview purposes only)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert multiple files to base64 data URLs (for preview purposes only)
 */
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(file => fileToBase64(file)));
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Please upload an image smaller than 5MB.' };
  }

  return { valid: true };
};

