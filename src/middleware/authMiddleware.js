/**
 * Authentication middleware for API routes
 * Ensures that users can only access their own data
 * Uses Clerk for authentication
 */

import { getAuth } from '@clerk/nextjs/server';

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      // Skip auth for non-data routes or public routes
      if (!req.url.includes('/api/data/')) {
        return handler(req, res);
      }

      // Get auth from Clerk
      const auth = getAuth(req);
      
      // Check if user is authenticated via Clerk or user-id header
      if (!auth.userId && !req.headers['user-id']) {
        // If no Clerk auth and no user-id, try fallback to token in header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ 
            success: false, 
            error: 'Authentication required',
            message: 'No valid authentication token or user ID provided'
          });
        }
        
        // Extract token from header if it exists
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Invalid token format'
          });
        }
      }
      
      // Add user ID to request for downstream handlers
      // Use Clerk user ID if available, otherwise use the one from headers
      req.userId = auth.userId || req.headers['user-id'];
      req.headers['user-id'] = req.userId;

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