import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Database connection warning:', err.message);
  }
  next();
});

// Health check endpoint
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Trending Dart E-Commerce API',
    database: process.env.MONGODB_URI ? 'configured' : 'missing_env',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Create unified API router mounted at both /api and /
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/offers', offerRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/payment', paymentRoutes);

app.use('/api', apiRouter);
app.use('/', apiRouter);

// Statically serve uploaded files (in local environments)
try {
  const localUploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(localUploadsPath));
} catch (e) {
  console.warn('Uploads static directory bypassed in serverless mode');
}

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

export default app;
