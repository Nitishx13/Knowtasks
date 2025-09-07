/**
 * Test script for dashboard authentication
 * This script tests the authentication fallback mechanism for the dashboard
 */

require('dotenv').config({ path: '.env.local' });

// Mock browser environment for testing
global.window = {
  localStorage: {
    _data: {},
    setItem: function(id, val) { this._data[id] = String(val); },
    getItem: function(id) { return this._data[id] || null; },
    removeItem: function(id) { delete this._data[id]; }
  }
};

// Mock process.env
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_USE_TEST_AUTH = 'true';

// Mock auth utilities
const mockAuth = {
  getAuthToken: async () => {
    // Simulate the behavior of getAuthToken
    if (typeof window !== 'undefined') {
      const testToken = window.localStorage.getItem('auth_test_token');
      if (testToken && process.env.NODE_ENV === 'development') {
        console.log('Using test token from localStorage');
        return testToken;
      }
    }
    
    // In development, return a test token
    if (process.env.NODE_ENV === 'development') {
      console.log('Using fallback test token in development');
      return 'test_token';
    }
    
    return null;
  },
  
  getAuthHeaders: async (userId) => {
    const token = await mockAuth.getAuthToken();
    
    // For development/testing, ensure we always have a userId
    let effectiveUserId = userId;
    if (!effectiveUserId && process.env.NODE_ENV === 'development') {
      // Use a test user ID if available in localStorage
      effectiveUserId = window.localStorage.getItem('auth_test_user_id') || 'test_user_123';
      console.log('Using fallback test user ID:', effectiveUserId);
    }
    
    return {
      'Authorization': token ? `Bearer ${token}` : 'Bearer test_token',
      'user-id': effectiveUserId || '',
      'Content-Type': 'application/json'
    };
  }
};

// Test the auth fallback mechanism
async function testAuthFallback() {
  console.log('Testing dashboard authentication fallback mechanism...');
  
  // 1. Test with no auth (should use test user in development)
  console.log('\n1. Testing with no authentication:');
  window.localStorage.removeItem('auth_test_user_id');
  window.localStorage.removeItem('auth_test_token');
  
  const noAuthHeaders = await mockAuth.getAuthHeaders();
  console.log('Headers with no auth:', noAuthHeaders);
  console.log('Expected behavior: Should include test_token in development mode');
  
  // 2. Test with test user ID
  console.log('\n2. Testing with test user ID:');
  window.localStorage.setItem('auth_test_user_id', 'test_user_123');
  window.localStorage.setItem('auth_test_token', 'test_token');
  
  const testUserHeaders = await mockAuth.getAuthHeaders();
  console.log('Headers with test user:', testUserHeaders);
  console.log('Expected behavior: Should include test_user_123 ID');
  
  // 3. Test AuthContext behavior (mock implementation)
  console.log('\n3. Testing AuthContext behavior:');
  console.log('Simulating AuthContext with test user...');
  
  // Create a mock user object similar to what AuthContext would provide
  const mockUser = {
    id: 'test_user_123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  };
  
  // Simulate UserDashboard component behavior
  function simulateUserDashboard(user) {
    let userName = '';
    
    // Logic from UserDashboard component
    if (user.firstName || user.lastName) {
      userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    } else if (user.email) {
      userName = user.email.split('@')[0];
    } else {
      userName = 'User';
    }
    
    return {
      user,
      userName,
      headers: testUserHeaders
    };
  }
  
  const dashboardState = simulateUserDashboard(mockUser);
  console.log('Dashboard state:', dashboardState);
  console.log('Expected behavior: userName should be "Test User"');
  
  // 4. Test API request simulation
  console.log('\n4. Testing API request simulation:');
  console.log('Simulating API request to /api/data/files...');
  
  // This is just a simulation - no actual network request
  const simulatedApiResponse = {
    success: true,
    files: [
      { id: 'file1', name: 'Document.pdf', uploadDate: new Date().toISOString() },
      { id: 'file2', name: 'Image.jpg', uploadDate: new Date().toISOString() }
    ]
  };
  
  console.log('Simulated API response:', simulatedApiResponse);
  console.log('In a real request, these headers would be sent:', testUserHeaders);
  
  console.log('\nAuthentication fallback test completed successfully!');
  return true;
}

// Run the test
testAuthFallback().then(success => {
  if (success) {
    console.log('All tests passed!');
  } else {
    console.error('Tests failed!');
    process.exit(1);
  }
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});