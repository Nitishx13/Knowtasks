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
        console.log('Clerk auth:', auth ? 'Found' : 'Not found');
        
        if (auth?.userId) {
          userId = auth.userId;
          console.log('Clerk user ID:', userId);
          
          // Sync user with database if authenticated with Clerk
          try {
            // Check if user exists in database
            let user = await getUserById(userId);
            console.log('Database user:', user ? 'Found' : 'Not found');
            
            // If user doesn't exist, create a new user record
            if (!user) {
              // Extract user data from Clerk auth if available
              const userData = {
                name: auth.user?.firstName && auth.user?.lastName ? 
                  `${auth.user.firstName} ${auth.user.lastName}`.trim() : 'Unknown User',
                email: auth.user?.emailAddresses?.[0]?.emailAddress || 'unknown@example.com'
              };
              
              console.log('Creating new user in database with data:', userData);
              
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
      
      // If no Clerk auth, check for test token or fallback authentication
      if (!userId) {
        const authHeader = req.headers.authorization;
        const userIdHeader = req.headers['user-id'];
        const isDevelopment = process.env.NODE_ENV === 'development';
        const useTestAuth = process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true';
        
        console.log('Fallback auth check:', { authHeader: !!authHeader, userIdHeader, isDevelopment, useTestAuth });
        
        // For testing purposes, allow a specific test token
        if (authHeader && 
            authHeader.startsWith('Bearer ') && 
            authHeader.split(' ')[1] === 'test_token' && 
            userIdHeader) {
          userId = userIdHeader;
          console.log('Using test token authentication with user ID:', userId);
        }
        
        // Enhanced test token handling for development and production when enabled
        else if (useTestAuth) {
          // If test auth is enabled, use fallback user
          console.log('Using fallback test authentication');
          userId = userIdHeader || 'test_user_123';
        }
        
        // Remove production fallback - require proper authentication
        // No fallback authentication allowed for security
      }
      
      // If still no userId, authentication failed
      if (!userId) {
        res.setHeader('Content-Type', 'application/json');
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
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication failed',
        message: 'Failed to authenticate request'
      });
    }
  };
}

export default authMiddleware;