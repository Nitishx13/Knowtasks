import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Check if we have a file in the request
      if (!req.body || !req.body.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { file, fileName } = req.body;
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        console.log('Uploads directory already exists');
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const filePath = join(uploadsDir, uniqueFileName);

      // Save the file
      await writeFile(filePath, file, 'base64');

      // Create a mock file URL (in production, this would be a real cloud storage URL)
      const fileUrl = `/uploads/${uniqueFileName}`;

      const savedFile = {
        id: timestamp.toString(),
        fileName,
        fileUrl,
        fileSize: file.length,
        uploadDate: new Date().toISOString(),
        status: 'uploaded',
        userId: 'test-user'
      };

      console.log('File uploaded successfully:', savedFile);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file: savedFile
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
