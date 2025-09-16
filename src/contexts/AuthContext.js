import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user, isLoaded: userLoaded } = useUser();
  
  // Prepare user data in the format expected by the application
  const userData = user ? {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    imageUrl: user.imageUrl || '',
    bio: user.publicMetadata?.bio || ''
  } : null;

  const loading = !isLoaded || !userLoaded;
  
  // For testing, provide a fallback test user (works in both development and production)
  const useTestUser = process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' && !isSignedIn;
  
  let effectiveUser = userData;
  
  if (useTestUser && !effectiveUser) {
    // Create a test user for development
    effectiveUser = {
      id: 'test_user_123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      imageUrl: '',
      bio: 'Test user for development'
    };
    
    console.log('Using test user for development:', effectiveUser.id);
  }

  // Handle localStorage operations only on client side
  useEffect(() => {
    if (useTestUser && effectiveUser && typeof window !== 'undefined') {
      localStorage.setItem('auth_test_user_id', effectiveUser.id);
      localStorage.setItem('auth_test_token', 'test_token');
    }
  }, [useTestUser, effectiveUser]);

  // Value to be provided by the context
  const value = {
    user: isSignedIn ? userData : (useTestUser ? effectiveUser : null),
    loading: useTestUser ? false : loading,
    isSignedIn: isSignedIn || useTestUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};