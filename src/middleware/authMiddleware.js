/**
 * Authentication middleware for API routes
 * Separate authentication flows for users (Clerk) and mentors (Neon database)
 */

import { getAuth } from '@clerk/nextjs/server';

export function authMiddleware(handler) {
  return async (req, res) => {
    console.log('Auth middleware called for:', req.url);
    console.log('All headers:', req.headers);
    
    // Skip authentication for unprotected routes - but protect user dashboard routes
    const isProtectedRoute = req.url.includes('/api/data/') || 
                            req.url.includes('/api/uploads/') || 
                            req.url.includes('/api/library/') || 
                            req.url.includes('/api/mentor/') ||
                            req.url.includes('/api/summarize') ||
                            req.url.includes('/api/text/') ||
                            req.url.includes('/api/formulas/') ||
                            req.url.includes('/api/concepts/');
    
    if (!isProtectedRoute) {
      console.log('URL not protected, passing through');
      return handler(req, res);
    }
    
    console.log('URL is protected, checking auth...');

    try {
      let userId = null;
      let userType = 'user'; // Default to regular user
      
      // Check if this is a mentor route
      if (req.url.includes('/api/mentor/') || req.url.includes('/api/uploads/mentor-content') || req.url.includes('/api/uploads/get-mentor-content')) {
        console.log('Mentor route detected, using mentor authentication');
        userType = 'mentor';
        
        // For mentor routes, use simple user-id header authentication
        if (req.headers['user-id']) {
          userId = req.headers['user-id'];
          console.log('Using mentor auth with user-id header, userId:', userId);
        }
      } else {
        console.log('User route detected, checking Clerk authentication');
        
        // For user routes, prioritize Clerk authentication
        try {
          const auth = getAuth(req);
          console.log('Clerk auth result:', auth?.userId ? 'Found' : 'Not found');
          
          if (auth?.userId) {
            userId = auth.userId;
            console.log('Using Clerk auth, userId:', userId);
          } else {
            // Development fallback only if no Clerk auth
            if (process.env.NODE_ENV === 'development' && req.headers['user-id']) {
              userId = req.headers['user-id'];
              console.log('Using development fallback with user-id header, userId:', userId);
            }
          }
        } catch (clerkError) {
          console.error('Clerk authentication error:', clerkError);
          // Development fallback on Clerk error
          if (process.env.NODE_ENV === 'development' && req.headers['user-id']) {
            userId = req.headers['user-id'];
            console.log('Using fallback due to Clerk error, userId:', userId);
          }
        }
      }
      
      if (!userId) {
        console.log('Authentication failed - no valid auth found');
        console.log('Headers:', {
          authorization: req.headers.authorization,
          'user-id': req.headers['user-id'],
          userType: userType,
          url: req.url
        });
        return res.status(401).json({ 
          error: 'Authentication failed',
          message: `Failed to authenticate ${userType} request`,
          debug: {
            userType: userType,
            hasUserIdHeader: !!req.headers['user-id'],
            url: req.url
          }
        });
      }
      
      console.log(`${userType} authentication successful, proceeding to handler`);
      
      // Add user ID and type to request for downstream handlers
      req.userId = userId;
      req.userType = userType;
      
      // Continue to the actual handler
      return handler(req, res);
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Failed to authenticate request'
      });
    }
  };
}

export default authMiddleware;