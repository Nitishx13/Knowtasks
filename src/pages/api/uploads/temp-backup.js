import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;
    
    if (!filename || !Array.isArray(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = join(process.cwd(), 'uploads', ...filename);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Read and serve the file
    const fileBuffer = await readFile(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename[filename.length - 1]}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    // Send the file
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
}
