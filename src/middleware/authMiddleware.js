/**
 * Authentication middleware for API routes
 * Ensures that users can only access their own data
 * Uses Clerk for authentication or fallback to test token
 * Syncs Clerk user data with Neon database
 */

import { getAuth } from '@clerk/nextjs/server';
import { createUser, getUserById } from '../lib/postgres';

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
          
          // Sync user with database if authenticated with Clerk
          try {
            // Check if user exists in database
            let user = await getUserById(userId);
            
            // If user doesn't exist, create a new user record
            if (!user) {
              // Extract user data from Clerk auth if available
              const userData = {
                name: auth.user?.firstName && auth.user?.lastName ? 
                  `${auth.user.firstName} ${auth.user.lastName}`.trim() : 'Unknown User',
                email: auth.user?.emailAddresses?.[0]?.emailAddress || 'unknown@example.com'
              };
              
              // Create user in database
              user = await createUser(userId, userData);
              console.log('Created new user in database:', userId);
            }
          } catch (dbError) {
            // Log database error but continue with authentication
            console.error('Database sync error:', dbError.message);
          }
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
      
      // Log authentication success for debugging
      console.log('Authentication successful for user:', userId);

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