import { sql } from '@vercel/postgres';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use multer middleware
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Parse form data
      const { title, description, category, subject, type, year, examType } = req.body;

      if (!title || !category || !subject || !type) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, category, subject, type' 
        });
      }

      // Create database table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS mentor_uploads (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL,
          subject VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          year INTEGER,
          exam_type VARCHAR(100),
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size INTEGER,
          uploaded_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Insert upload record
      const result = await sql`
        INSERT INTO mentor_uploads (
          title, description, category, subject, type, year, exam_type,
          file_name, file_path, file_size, uploaded_by, created_at
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

    });

  } catch (error) {
    console.error('Upload API error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
}
