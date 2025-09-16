/**
 * API Authentication Middleware for Knowtasks
 * Handles both Clerk authentication and test authentication for development/production
 */

import { getAuth } from '@clerk/nextjs/server';

/**
 * Authentication middleware for API routes
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Object} Authentication result with userId and isAuthenticated
 */
export const authenticateRequest = async (req, res) => {
  try {
    // Check if test authentication is enabled
    const useTestAuth = process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true';
    
    if (useTestAuth) {
      // Test authentication mode - extract user ID from headers
      const testUserId = req.headers['user-id'] || req.headers['x-user-id'] || 'test_user_123';
      const testToken = req.headers['authorization'];
      
      // Validate test token format
      if (testToken && (testToken === 'Bearer test_token' || testToken.startsWith('Bearer '))) {
        return {
          userId: testUserId,
          isAuthenticated: true,
          authMethod: 'test'
        };
      }
      
      // Fallback for test mode - always authenticate with test user
      return {
        userId: 'test_user_123',
        isAuthenticated: true,
        authMethod: 'test_fallback'
      };
    }
    
    // Production Clerk authentication
    const { userId } = getAuth(req);
    
    if (userId) {
      return {
        userId,
        isAuthenticated: true,
        authMethod: 'clerk'
      };
    }
    
    // No authentication found
    return {
      userId: null,
      isAuthenticated: false,
      authMethod: 'none'
    };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      userId: null,
      isAuthenticated: false,
      authMethod: 'error',
      error: error.message
    };
  }
};

/**
 * Middleware wrapper that requires authentication
 * @param {Function} handler - API route handler
 * @returns {Function} Wrapped handler with authentication
 */
export const withAuth = (handler) => {
  return async (req, res) => {
    const auth = await authenticateRequest(req, res);
    
    if (!auth.isAuthenticated) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required',
        authMethod: auth.authMethod
      });
    }
    
    // Add auth info to request object
    req.auth = auth;
    req.userId = auth.userId;
    
    return handler(req, res);
  };
};

/**
 * Get user ID from request (with fallback for test mode)
 * @param {Object} req - Next.js request object
 * @returns {string|null} User ID
 */
export const getUserId = async (req) => {
  const auth = await authenticateRequest(req, {});
  return auth.userId;
};

/**
 * Check if request is authenticated
 * @param {Object} req - Next.js request object
 * @returns {boolean} Whether request is authenticated
 */
export const isAuthenticated = async (req) => {
  const auth = await authenticateRequest(req, {});
  return auth.isAuthenticated;
};
