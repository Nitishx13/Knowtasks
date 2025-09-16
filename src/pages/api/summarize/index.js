import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  // Set proper headers for JSON response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Get authenticated user ID from middleware
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to process text'
      });
    }
    
    const { documentId, text, type = 'general' } = req.body;
    
    if (!documentId && !text) {
      return res.status(400).json({
        success: false,
        error: 'Document ID or text content is required'
      });
    }
    
    let contentToSummarize = text;
    let documentTitle = 'Text Summary';
    
    // Skip document fetching for now - just use provided text
    
    // Generate summary using mock function (simplified for now)
    const summaryContent = await generateSummary(contentToSummarize, type);
    
    // Return summary directly without database dependency
    res.status(200).json({
      success: true,
      summary: summaryContent,
      originalLength: contentToSummarize.length,
      summaryLength: summaryContent.length,
      type
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate a summary (mock implementation)
async function generateSummary(text, type = 'general') {
  // In production, this would call OpenAI API or another AI service
  // For demo purposes, we'll create a more intelligent mock summary
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(' ');
  
  let summaryLength;
  switch (type) {
    case 'concise':
      summaryLength = Math.max(1, Math.floor(sentences.length * 0.2));
      break;
    case 'detailed':
      summaryLength = Math.max(3, Math.floor(sentences.length * 0.5));
      break;
    case 'general':
    default:
      summaryLength = Math.max(2, Math.floor(sentences.length * 0.3));
      break;
  }
  
  // Take the first few sentences as a simple summary
  const summarySentences = sentences.slice(0, summaryLength);
  let summary = summarySentences.join('. ').trim();
  
  if (summary && !summary.endsWith('.')) {
    summary += '.';
  }
  
  // Add some educational context for students
  if (summary.length < 50) {
    summary = `Key points from the document: ${summary}`;
  }
  
  return summary || 'This document contains important information that can be studied further.';
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);