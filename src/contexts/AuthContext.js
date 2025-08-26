import React, { createContext, useContext } from 'react';
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

  // Value to be provided by the context
  const value = {
    user: isSignedIn ? userData : null,
    loading,
    isSignedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};