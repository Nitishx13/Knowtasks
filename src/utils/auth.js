/**
 * Enhanced authentication utility functions with role-based access control
 */

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Permission levels
export const PERMISSIONS = {
  READ_OWN: 'read_own',
  WRITE_OWN: 'write_own',
  READ_ALL: 'read_all',
  WRITE_ALL: 'write_all',
  MANAGE_USERS: 'manage_users',
  MANAGE_MENTORS: 'manage_mentors'
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.STUDENT]: [PERMISSIONS.READ_OWN, PERMISSIONS.WRITE_OWN],
  [USER_ROLES.MENTOR]: [PERMISSIONS.READ_OWN, PERMISSIONS.WRITE_OWN, PERMISSIONS.READ_ALL],
  [USER_ROLES.ADMIN]: [PERMISSIONS.READ_OWN, PERMISSIONS.WRITE_OWN, PERMISSIONS.READ_ALL, PERMISSIONS.WRITE_ALL, PERMISSIONS.MANAGE_USERS],
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS)
};

/**
 * Check if user has specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if user can access resource
 * @param {string} userRole - User's role
 * @param {string} resourceUserId - Resource owner's user ID
 * @param {string} currentUserId - Current user's ID
 * @param {string} permission - Required permission
 * @returns {boolean} Whether user can access resource
 */
export const canAccessResource = (userRole, resourceUserId, currentUserId, permission) => {
  // Own resources
  if (resourceUserId === currentUserId && hasPermission(userRole, PERMISSIONS.READ_OWN)) {
    return true;
  }
  
  // Global permissions
  if (hasPermission(userRole, permission)) {
    return true;
  }
  
  return false;
};

/**
 * Gets the authentication token from Clerk session
 * @returns {Promise<string|null>} The authentication token or null if not available
 */
export const getAuthToken = async () => {
  try {
    // For testing, use a test token if test auth is enabled
    if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true') {
      return 'test_token';
    }
    
    // Check if Clerk is available in the window object
    if (window?.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': 'anonymous'
        };
      }
    }
    
    // Fallback to localStorage for testing
    if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' && window?.localStorage) {
      try {
        const testToken = localStorage.getItem('auth_test_token');
        if (testToken) {
          return testToken;
        }
      } catch (error) {
        console.warn('localStorage not available during SSR');
      }
    }
    
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
  if (!effectiveUserId && window?.localStorage) {
    try {
      effectiveUserId = localStorage.getItem('auth_test_user_id') || 'test_user_123';
    } catch (error) {
      console.warn('localStorage not available during SSR');
    }
  }
  
  return {
    'Authorization': token ? `Bearer ${token}` : 'Bearer test_token',
    'user-id': effectiveUserId || 'test_user_123',
    'Content-Type': 'application/json'
  };
};

/**
 * Get user info from localStorage or session
 * @returns {Object|null} User information
 */
export const getCurrentUser = () => {
  if (!window) return null;
  
  try {
    // Try to get from test auth first
    if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' && window.localStorage) {
      const testUserId = localStorage.getItem('auth_test_user_id');
      const testToken = localStorage.getItem('auth_test_token');
      const testRole = localStorage.getItem('auth_test_user_role') || 'user';
      
      if (testUserId && testToken) {
        return {
          id: testUserId,
          role: testRole,
          isAuthenticated: true,
          authMethod: 'test'
        };
      }
    }
    
    // Try to get from Clerk
    if (window.Clerk?.user) {
      return {
        id: window.Clerk.user.id,
        email: window.Clerk.user.primaryEmailAddress?.emailAddress,
        role: 'user',
        isAuthenticated: true,
        authMethod: 'clerk'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Set user role (for testing purposes)
 * @param {string} role - User role to set
 */
export const setTestUserRole = (role) => {
  if (window?.localStorage) {
    try {
      localStorage.setItem('auth_test_user_role', role);
    } catch (error) {
      console.warn('localStorage not available during SSR');
    }
  }
};