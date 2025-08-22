// Next.js API route for summarization

export default function handler(req, res) {
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
    
    return res.status(200).json({
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      type
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