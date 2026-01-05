import express, { Request, Response } from 'express';
import multer from 'multer';
import { requireAuth } from '../auth/middleware.js';
import { uploadFile, deleteFile } from './upload.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /upload/category
 * Upload category image (admin only)
 */
router.post(
  '/category',
  requireAuth,
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' }); return;
      }

      const file = req.file;
      const fileExtension = file.originalname.split('.').pop() || 'jpg';
      const fileName = `categories/${randomUUID()}.${fileExtension}`;

      const result = await uploadFile(
        'product-images',
        fileName,
        file.buffer,
        file.mimetype
      );

      if (result.error) {
        res.status(500).json({ error: result.error }); return;
      }

      res.status(200).json({ url: result.url });
    } catch (error) {
      console.error('Category upload error:', error);
      res.status(500).json({ error: 'Failed to upload category image' });
    }
  }
);

/**
 * POST /upload/product
 * Upload product images (multiple) (admin only)
 */
router.post(
  '/product',
  requireAuth,
  upload.array('images', 10), // Max 10 images
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Type guard: ensure files is an array
      if (!Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ error: 'No files uploaded' }); return;
      }

      const files: Express.Multer.File[] = req.files;
      const uploadPromises = files.map(async (file) => {
        const fileExtension = file.originalname.split('.').pop() || 'jpg';
        const fileName = `products/${randomUUID()}.${fileExtension}`;

        const result = await uploadFile(
          'product-images',
          fileName,
          file.buffer,
          file.mimetype
        );

        return result;
      });

      const results = await Promise.all(uploadPromises);
      const urls = results
        .filter((r) => r.url)
        .map((r) => r.url as string);

      if (urls.length === 0) {
        res.status(500).json({ error: 'Failed to upload images' }); return;
      }

      res.status(200).json({ urls });
    } catch (error) {
      console.error('Product upload error:', error);
      res.status(500).json({ error: 'Failed to upload product images' });
    }
  }
);

/**
 * DELETE /upload
 * Delete an image from storage (admin only)
 */
router.delete(
  '/',
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, bucket } = req.body;

      if (!url) {
        res.status(400).json({ error: 'URL is required' }); return;
      }

      const storageBucket = bucket || 'product-images';
      const result = await deleteFile(storageBucket, url);

      if (!result.success) {
        res.status(500).json({ error: result.error || 'Failed to delete file' }); return;
      }

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
);

export default router;

