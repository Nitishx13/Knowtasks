// API endpoint for viewing the full content of a summary
import { getSummaryById } from '../../../lib/postgres';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Summary ID is required'
      });
    }
    
    // Get the summary from the database
    const summary = await getSummaryById(id);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }
    
    // Return the full summary content
    res.status(200).json({
      success: true,
      summary: {
        id: summary.id,
        title: summary.title,
        content: summary.content,
        keyPoints: summary.key_points || [],
        fileName: summary.file_name,
        fileUrl: summary.file_url,
        wordCount: summary.word_count,
        documentType: summary.document_type,
        estimatedPages: summary.estimated_pages,
        createdAt: summary.created_at,
        updatedAt: summary.updated_at
      }
    });
  } catch (error) {
    console.error('Error retrieving summary:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}