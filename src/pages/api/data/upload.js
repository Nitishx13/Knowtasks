import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user ID from request (added by auth middleware)
  const userId = req.userId || req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required',
      message: 'User ID is required for file uploads'
    });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log('Uploads directory already exists or could not be created');
    }

    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          return resolve(res.status(500).json({ 
            success: false,
            error: 'Failed to parse form data',
            details: err.message
          }));
        }

        const file = files.file;
        if (!file) {
          return resolve(res.status(400).json({ 
            success: false,
            error: 'No file uploaded' 
          }));
        }

        try {
          const filePath = file.filepath;
          const fileName = file.originalFilename;
          const fileSize = file.size;
          const fileExtension = path.extname(fileName).toLowerCase();
          const uploadDate = new Date().toISOString();

          // Generate a unique filename to prevent collisions
          const uniqueFileName = `${Date.now()}-${fileName}`;
          const newFilePath = path.join(uploadsDir, uniqueFileName);

          // Rename the file to include timestamp
          fs.renameSync(filePath, newFilePath);

          // Create file URL
          const fileUrl = `/uploads/${uniqueFileName}`;

          // Store file information in database with user ID
          const result = await sql`
            INSERT INTO files (
              file_name, 
              file_url, 
              file_size, 
              user_id, 
              upload_date, 
              file_type
            ) VALUES (
              ${fileName}, 
              ${fileUrl}, 
              ${fileSize}, 
              ${userId}, 
              ${uploadDate}, 
              ${fileExtension}
            ) RETURNING id
          `;

          const fileId = result.rows[0].id;

          // Return success response with file details
          return resolve(res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
              id: fileId,
              fileName,
              fileUrl,
              fileSize,
              fileType: fileExtension,
              uploadDate,
              userId
            }
          }));
        } catch (error) {
          console.error('File processing error:', error);
          return resolve(res.status(500).json({ 
            success: false,
            error: 'Error processing file', 
            details: error.message 
          }));
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: error.message 
    });
  }
}

// Apply auth middleware
export default authMiddleware(handler);