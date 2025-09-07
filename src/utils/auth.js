/**
 * Authentication utility functions for client-side use
 */

/**
 * Gets the authentication token from Clerk session
 * @returns {Promise<string|null>} The authentication token or null if not available
 */
export const getAuthToken = async () => {
  try {
    // For testing, use a test token if test auth is enabled (works in both development and production)
    if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true') {
      console.log('Using test authentication token');
      return 'test_token';
    }
    
    // Check if Clerk is available in the window object
    if (typeof window !== 'undefined') {
      // Try to get the token from the Clerk object
      if (window.Clerk?.session) {
        console.log('Attempting to get token from Clerk session');
        const token = await window.Clerk.session.getToken();
        if (token) {
          console.log('Successfully retrieved Clerk token');
          return token;
        }
      }
      
      // Fallback to localStorage for testing (works in both development and production)
      if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true') {
        const testToken = localStorage.getItem('auth_test_token');
        if (testToken) {
          console.log('Using fallback test token from localStorage');
          return testToken;
        }
      }
    }
    
    console.log('No authentication token available');
    return null;
  } catch (error) {
    console.error('Error getting authentication token:', error);
    return null;
  }
};

/**
 * Creates headers with authentication token for API requests
 * @param {string} userId - The user ID to include in headers
 * @returns {Promise<Object>} Headers object with authorization and user-id
 */
export const getAuthHeaders = async (userId) => {
  const token = await getAuthToken();
  
  // For development/testing, ensure we always have a userId
  let effectiveUserId = userId;
  if (!effectiveUserId && process.env.NODE_ENV === 'development') {
    // Use a test user ID if available in localStorage
    effectiveUserId = localStorage.getItem('auth_test_user_id') || 'test_user_123';
    console.log('Using fallback test user ID:', effectiveUserId);
  }
  
  return {
    'Authorization': token ? `Bearer ${token}` : 'Bearer test_token',
    'user-id': effectiveUserId || '',
    'Content-Type': 'application/json'
  };
};