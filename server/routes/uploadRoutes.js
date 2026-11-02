import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'td-product-' + uniqueSuffix + ext);
  },
});

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

// Single or multiple file upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
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

    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a full URL or raw data
      return res.status(200).json({ success: true, url: base64Data });
    }

    const ext = '.' + matches[1].replace('jpeg', 'jpg');
    const buffer = Buffer.from(matches[2], 'base64');
    const uniqueName = 'td-product-' + Date.now() + ext;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${uniqueName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

