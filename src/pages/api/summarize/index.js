// Next.js API route for summarization
import { createSummary, createUser } from '../../../lib/postgres';

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
    
    // We'll now process the database operations before responding
    // to include the summary ID in the response
    let summaryId = null;
    
    // Process database operations
    
    try {
       // Get user ID from request headers or use a default ID for demo purposes
       // In production, this should come from authentication
       const userId = req.headers['user-id'] || 'user_demo';
       
       // First, ensure the user exists in the database
       try {
         // Create a demo user if needed - this is just for demonstration
         // In production, you would use proper authentication
         await createUser(userId, {
           name: 'Demo User',
           email: 'demo@example.com'
         });
       } catch (userError) {
         console.log('Note: User already exists or could not be created:', userError.message);
         // Continue anyway - the user might already exist
       }
       
       // Extract metadata from request or use defaults
       const { metadata = {} } = req.body;
       const wordCount = metadata.wordCount || text.split(/\s+/).length;
       const estimatedPages = metadata.estimatedPages || Math.ceil(wordCount / 250);
       const documentType = metadata.documentType || 'Text Input';
       
       // Store the summary in the database
       const summaryData = {
         title: 'Text Summary',
         content: summary,
         keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
         fileName: 'Pasted Text',
         fileUrl: '', // No file URL for pasted text
         wordCount: wordCount,
         documentType: documentType,
         estimatedPages: estimatedPages
       };
       
       // Save to database and get the ID
       let summaryId;
       try {
         const result = await createSummary(userId, summaryData);
         summaryId = result.id;
         console.log('Text summary stored in database with ID:', summaryId);
       } catch (dbError) {
         console.error('Database error while saving summary:', dbError);
       }
       
       console.log('Text summary stored in database for user:', userId);
    } catch (dbError) {
      // Log database errors but don't fail the request
      console.error('Error preparing database operation:', dbError);
    }
    
    // Now return the response with the summary ID if available
    res.status(200).json({
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      type,
      id: summaryId // Include the summary ID for frontend reference
    });
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