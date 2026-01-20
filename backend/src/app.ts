import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './auth/routes.js';
import productRoutes from './products/routes.js';
import categoryRoutes from './categories/routes.js';
import cartRoutes from './cart/routes.js';
import wishlistRoutes from './wishlist/routes.js';
import couponRoutes from './coupons/routes.js';
import orderRoutes from './orders/routes.js';
import enquiryRoutes from './enquiries/routes.js';
import storageRoutes from './storage/routes.js';
import notificationRoutes from './notifications/routes.js';
import reviewRoutes from './reviews/routes.js';
import productSizesRoutes from './product-sizes/routes.js';
import productDetailsRoutes from './product-details/routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration - allow frontend origin with credentials
// Support multiple origins (comma-separated in FRONTEND_URL)
const allowedOrigins = env.FRONTEND_URL.split(',').map(url => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/coupons', couponRoutes);
app.use('/orders', orderRoutes);
app.use('/enquiries', enquiryRoutes);
app.use('/upload', storageRoutes);
app.use('/notifications', notificationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/product-sizes', productSizesRoutes);
app.use('/product-details', productDetailsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;

