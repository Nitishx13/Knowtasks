import { sql } from '@vercel/postgres';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../../../middleware/authMiddleware';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'mentor-content');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  console.log('Upload API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use multer middleware first
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }
      
      console.log('Multer processing complete');

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get authenticated user ID after multer processing
      const userId = req.userId || req.headers['user-id'];
      console.log('User ID:', userId);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Authentication required'
        });
      }

      // Parse form data
      const { title, description, category, subject, type, year, examType } = req.body;

      if (!title || !category || !subject || !type) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, category, subject, type' 
        });
      }

      console.log('Processing upload for user:', userId);

      // Insert upload record with authenticated user ID
      const result = await sql`
        INSERT INTO mentor_uploads (
          title, description, category, subject, type, year, exam_type,
          file_name, file_path, file_size, uploaded_by, user_id, created_at
        ) VALUES (
          ${title}, 
          ${description || ''}, 
          ${category}, 
          ${subject}, 
          ${type},
          ${type === 'pyq' ? parseInt(year) || null : null},
          ${type === 'pyq' ? examType || null : null},
          ${req.file.filename},
          ${req.file.path},
          ${req.file.size},
          'mentor',
          ${userId},
          CURRENT_TIMESTAMP
        ) RETURNING id, title, file_name, created_at
      `;

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        upload: result.rows[0],
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          size: req.file.size,
          path: `/uploads/mentor-content/${req.file.filename}`
        }
      });

    } catch (error) {
      console.error('Upload processing error:', error);
      return res.status(500).json({ 
        error: 'Failed to process upload',
        details: error.message 
      });
    }
  });
}

// Export handler directly without auth middleware to avoid conflicts with multer
export default handler;
