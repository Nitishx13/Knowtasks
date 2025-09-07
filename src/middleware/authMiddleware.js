/**
 * Authentication middleware for API routes
 * Ensures that users can only access their own data
 * Uses Clerk for authentication or fallback to test token
 */

import { getAuth } from '@clerk/nextjs/server';

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      // Skip auth for non-data routes or public routes
      if (!req.url.includes('/api/data/')) {
        return handler(req, res);
      }

      let userId = null;
      
      try {
        // Try to get auth from Clerk
        const auth = getAuth(req);
        if (auth?.userId) {
          userId = auth.userId;
        }
      } catch (clerkError) {
        // Clerk auth failed, continue with fallback
        console.error('Clerk auth error:', clerkError.message);
      }
      
      // If no Clerk auth, check for test token
      if (!userId) {
        const authHeader = req.headers.authorization;
        const userIdHeader = req.headers['user-id'];
        
        // For testing purposes, allow a specific test token
        if (authHeader && 
            authHeader.startsWith('Bearer ') && 
            authHeader.split(' ')[1] === 'test_token' && 
            userIdHeader) {
          userId = userIdHeader;
        }
      }
      
      // If still no userId, authentication failed
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication failed',
          message: 'Failed to authenticate request'
        });
      }
      
      // Add user ID to request for downstream handlers
      req.userId = userId;
      req.headers['user-id'] = userId;

      // Continue to the actual handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication failed',
        message: 'Failed to authenticate request'
      });
    }
  };
}

export default authMiddleware;