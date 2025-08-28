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
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        let content = '';
        const filePath = file.filepath;
        const fileName = file.originalFilename;
        const fileExtension = path.extname(fileName).toLowerCase();

        // Extract text based on file type
        if (fileExtension === '.txt') {
          content = fs.readFileSync(filePath, 'utf8');
        } else if (fileExtension === '.pdf') {
          // For PDF files, we'll return a placeholder since we don't have PDF parsing
          content = `PDF file "${fileName}" uploaded successfully. Text extraction from PDF requires additional libraries.`;
        } else if (fileExtension === '.doc' || fileExtension === '.docx') {
          // For Word documents, we'll return a placeholder
          content = `Word document "${fileName}" uploaded successfully. Text extraction from Word documents requires additional libraries.`;
        } else {
          // Try to read as text for other file types
          try {
            content = fs.readFileSync(filePath, 'utf8');
          } catch (readError) {
            content = `File "${fileName}" uploaded successfully. Content extraction not available for this file type.`;
          }
        }

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
          success: true,
          fileName: fileName,
          content: content,
          wordCount: content.split(/\s+/).length,
          fileSize: file.size,
        });
      } catch (fileError) {
        console.error('File processing error:', fileError);
        res.status(500).json({ error: 'Failed to process file' });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
