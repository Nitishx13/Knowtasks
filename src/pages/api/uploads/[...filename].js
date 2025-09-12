import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;
    
    if (!filename) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Handle both array and string filename formats
    const filePathParts = Array.isArray(filename) ? filename : [filename];
    const filePath = join(process.cwd(), 'uploads', ...filePathParts);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error('File not found:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }

    // Read and serve the file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const fileName = filePathParts[filePathParts.length - 1];
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (extension === 'pdf') {
      contentType = 'application/pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Send the file
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
}
