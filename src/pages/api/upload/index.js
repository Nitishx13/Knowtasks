import { getAuth } from '../../utils/auth';
import { Database } from '../../../lib/database';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const database = new Database();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { userId, error: authError } = await getAuth(req);
    
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(400).json({ error: 'File upload failed' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Get file info
        const originalName = Array.isArray(file.originalFilename) ? file.originalFilename[0] : file.originalFilename;
        const filePath = Array.isArray(file.filepath) ? file.filepath[0] : file.filepath;
        const fileSize = Array.isArray(file.size) ? file.size[0] : file.size;
        
        // Read file content for text extraction (simplified)
        let content = '';
        const ext = path.extname(originalName).toLowerCase();
        
        if (ext === '.txt') {
          content = fs.readFileSync(filePath, 'utf8');
        } else {
          // For other file types, we'll store metadata only
          content = `Document: ${originalName} (${ext.substring(1).toUpperCase()} file)`;
        }

        // Create document record
        const documentData = {
          id: Date.now().toString(),
          userId,
          title: originalName,
          content: content.substring(0, 5000), // Limit content length
          filePath: filePath,
          fileSize: fileSize,
          fileType: ext,
          createdAt: new Date().toISOString()
        };

        const document = await database.createDocument(documentData);
        
        res.status(201).json({ 
          success: true, 
          document: {
            id: document.id,
            title: document.title,
            file_size: document.file_size,
            file_type: document.file_type,
            created_at: document.created_at
          }
        });
      } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: 'Failed to process uploaded file' });
      }
    });
  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
