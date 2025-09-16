import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  try {
    // Set proper headers for JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Debug information
    const debugInfo = {
      success: true,
      message: 'Notes API debug endpoint working',
      method: req.method,
      url: req.url,
      userId: req.userId,
      userType: req.userType,
      headers: {
        'user-id': req.headers['user-id'],
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'Present' : 'Missing'
      },
      body: req.body,
      timestamp: new Date().toISOString()
    };

    console.log('Notes debug endpoint called:', debugInfo);

    res.status(200).json(debugInfo);

  } catch (error) {
    console.error('Debug endpoint error:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Debug endpoint failed',
      details: error.message,
      stack: error.stack
    });
  }
}

// Apply auth middleware to test authentication
export default authMiddleware(handler);
