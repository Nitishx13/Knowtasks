import { createTextFile } from '../../../lib/textDatabase';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, title, summary } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required'
      });
    }
    
    // Get user ID from the request query parameters
    const userId = req.query.userId || req.headers['user-id'] || 'anonymous';
    
    // Prepare text data for database
    const textData = {
      title: title || 'Text Input',
      content: text,
      summary: summary || '',
      wordCount: text.split(/\s+/).length
    };
    
    // Save to database
    const savedFile = await createTextFile(userId, textData);
    
    res.status(200).json({
      success: true,
      fileId: savedFile.id,
      title: savedFile.title,
      content: savedFile.content,
      summary: savedFile.summary,
      wordCount: savedFile.word_count,
      createdAt: savedFile.created_at
    });
  } catch (error) {
    console.error('Error saving text file:', error);
    res.status(500).json({ error: 'Failed to save text file: ' + error.message });
  }
}