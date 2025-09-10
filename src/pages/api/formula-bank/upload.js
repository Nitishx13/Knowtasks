import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    });

    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type (PDF only for Formula Bank)
    if (!file.originalFilename?.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed for Formula Bank' });
    }

    // Extract form data
    const title = fields.title?.[0] || file.originalFilename;
    const description = fields.description?.[0] || '';
    const category = fields.category?.[0] || 'General';
    const subject = fields.subject?.[0] || 'General';
    const uploadedBy = fields.uploadedBy?.[0] || 'anonymous';
    const uploaderRole = fields.uploaderRole?.[0] || 'mentor';
    const tags = fields.tags?.[0] ? JSON.parse(fields.tags[0]) : [];

    // Create file URL (in production, you'd upload to cloud storage)
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const fileUrl = `/uploads/${fileName}`;
    
    // Move file to permanent location
    const uploadPath = path.join(process.cwd(), 'uploads', fileName);
    fs.renameSync(file.filepath, uploadPath);

    // Save to database
    const result = await sql`
      INSERT INTO formula_bank (
        title, description, file_name, file_url, file_size, 
        category, subject, uploaded_by, uploader_role, tags, status
      ) VALUES (
        ${title}, ${description}, ${fileName}, ${fileUrl}, ${file.size},
        ${category}, ${subject}, ${uploadedBy}, ${uploaderRole}, ${tags}, 'active'
      )
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      message: 'Formula Bank PDF uploaded successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload Formula Bank PDF',
      details: error.message 
    });
  }
}
