import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { path: filePath } = req.query;
  
  if (!filePath || filePath.length === 0) {
    return res.status(400).json({ error: 'File path is required' });
  }

  // Join the path segments
  const fileName = Array.isArray(filePath) ? filePath.join('/') : filePath;
  
  // Construct the full file path
  const fullPath = path.join(process.cwd(), 'uploads', fileName);
  
  // Security check: ensure the path is within the uploads directory
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fullPath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // For PDFs, set additional headers to enable inline viewing
    if (ext === '.pdf') {
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(fileName)}"`);
    }

    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    responseLimit: false, // Disable response size limit for file serving
  },
};
