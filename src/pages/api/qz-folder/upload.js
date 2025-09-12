import { sql } from '@vercel/postgres';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false
      });
    }

    // Parse the form data
    const form = formidable({
      uploadDir: './uploads/qz-files',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    // Create upload directory if it doesn't exist
    const uploadDir = './uploads/qz-files';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = fields.title?.[0] || file.originalFilename || 'Untitled';
    const description = fields.description?.[0] || '';
    const subject = fields.subject?.[0] || 'General';

    // Generate unique filename
    const fileExtension = path.extname(file.originalFilename || '');
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    const newFilePath = path.join(uploadDir, uniqueFilename);

    // Move file to final location
    fs.renameSync(file.filepath, newFilePath);

    // Get file stats
    const stats = fs.statSync(newFilePath);
    const fileSize = stats.size;

    // Save file info to database
    const result = await sql`
      INSERT INTO qz_files (
        title, description, subject, file_path, file_type, file_size,
        is_favorite, created_at, updated_at
      ) VALUES (
        ${title}, ${description}, ${subject}, ${newFilePath}, ${fileExtension},
        ${fileSize}, ${false}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id
    `;

    res.status(200).json({
      success: true,
      file: {
        id: result.rows[0].id,
        title: title,
        description: description,
        subject: subject,
        file_path: newFilePath,
        file_type: fileExtension,
        file_size: fileSize
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('QZ file upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}
