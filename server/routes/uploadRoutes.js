import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Safe upload directory initialization (never crash on read-only serverless environments like Vercel)
const isServerless = !!process.env.VERCEL;
let uploadDir = null;

if (!isServerless) {
  try {
    uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.warn('Filesystem read-only or not writable, using memory storage:', err.message);
    uploadDir = null;
  }
}

// Memory storage is 100% compatible with both Vercel Serverless and local dev
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowed.test(ext) && allowed.test(mime)) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// Single file upload endpoint
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // If local directory is writable, write file to disk
    if (uploadDir) {
      try {
        const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = 'td-product-' + uniqueSuffix + ext;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, req.file.buffer);

        return res.status(200).json({
          success: true,
          url: `/uploads/${fileName}`,
          filename: fileName,
        });
      } catch (writeErr) {
        console.warn('Could not write to disk, falling back to base64 data URI:', writeErr.message);
      }
    }

    // Serverless fallback: return base64 Data URI directly
    const base64Url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.status(200).json({
      success: true,
      url: base64Url,
      filename: req.file.originalname,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Base64 upload support
router.post('/base64', (req, res) => {
  try {
    const { base64Data, filename = 'upload.jpg' } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'No base64 data provided.' });
    }

    // Always accept and return valid data URI or full URL
    return res.status(200).json({
      success: true,
      url: base64Data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
