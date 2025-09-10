import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

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
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract form data
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    const uploadedBy = Array.isArray(fields.uploadedBy) ? fields.uploadedBy[0] : fields.uploadedBy;
    const uploaderRole = Array.isArray(fields.uploaderRole) ? fields.uploaderRole[0] : fields.uploaderRole;

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'flashcard';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const newFileName = `${timestamp}-${sanitizedName}`;
    const newPath = path.join(uploadsDir, newFileName);

    // Move file to permanent location
    fs.renameSync(file.filepath, newPath);

    // Save to database
    const result = await sql`
      INSERT INTO flashcards (
        title, description, category, subject, file_name, file_url, file_size,
        uploaded_by, uploader_role, created_at
      ) VALUES (
        ${title}, ${description}, ${category}, ${subject}, ${newFileName}, 
        ${`/uploads/${newFileName}`}, ${file.size}, ${uploadedBy}, ${uploaderRole}, NOW()
      ) RETURNING *
    `;

    res.status(200).json({
      success: true,
      message: 'Flashcard uploaded successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Flashcard upload error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('relation "flashcards" does not exist')) {
      res.status(500).json({ 
        error: 'Database table not found. Please contact administrator to set up flashcards table.' 
      });
    } else if (error.message.includes('POSTGRES_URL')) {
      res.status(500).json({ 
        error: 'Database connection not configured. Please check environment variables.' 
      });
    } else if (error.code === 'ENOENT') {
      res.status(500).json({ 
        error: 'Upload directory not accessible. Please check file permissions.' 
      });
    } else {
      res.status(500).json({ 
        error: `Upload failed: ${error.message}` 
      });
    }
  }
}
