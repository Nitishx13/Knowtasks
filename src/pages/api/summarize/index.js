// Next.js API route for summarization
import { createSummary } from '../../../lib/postgres';

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
    const { text, type = 'general' } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required'
      });
    }
    
    // Mock summarization - in production, use a real AI service
    // For demo purposes, we'll just return a simple summary
    const summary = generateMockSummary(text, type);
    
    // Return the summary response first before attempting database operations
    // This ensures the user gets a response even if database operations fail
    res.status(200).json({
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      type
    });
    
    try {
       // For demo purposes, we'll skip database storage since it requires a valid user
       // In a real application, you would ensure the user exists in the database first
       // or create a demo/anonymous user for testing
       
       // The error we're seeing is because the 'anonymous' user doesn't exist in the users table
       // and the summaries table has a foreign key constraint requiring a valid user_id
       
       // For now, we'll just log that we're skipping database storage
       console.log('Skipping database storage for demo purposes');
       
       // If you want to enable database storage, you would need to:
       // 1. Create a user record for 'anonymous' or
       // 2. Get a valid user ID from authentication
       
       /* Commented out to prevent foreign key constraint errors
       const userId = req.headers['user-id'] || 'anonymous';
       
       // Store the summary in the database
       const wordCount = text.split(' ').length;
       const summaryData = {
         title: 'Text Summary',
         content: summary,
         keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
         fileName: 'Text Input',
         fileUrl: '',
         wordCount: wordCount,
         documentType: 'text',
         estimatedPages: Math.ceil(wordCount / 250) // Rough estimate of pages
       };
       
       // Save to database - but don't wait for it to complete before responding
       // This is a "fire and forget" approach to prevent blocking the response
       createSummary(userId, summaryData).catch(dbError => {
         console.error('Database error while saving summary:', dbError);
       });
       */
    } catch (dbError) {
      // Log database errors but don't fail the request
      console.error('Error preparing database operation:', dbError);
    }
  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate a mock summary
function generateMockSummary(text, type) {
  // In a real app, this would call an AI service
  // For demo purposes, we'll just return a shortened version
  const words = text.split(' ');
  
  // Different summary types
  switch (type) {
    case 'concise':
      return words.slice(0, Math.max(5, Math.floor(words.length * 0.1))).join(' ') + '...';
    case 'detailed':
      return words.slice(0, Math.max(20, Math.floor(words.length * 0.3))).join(' ') + '...';
    case 'general':
    default:
      return words.slice(0, Math.max(10, Math.floor(words.length * 0.2))).join(' ') + '...';
  }
}