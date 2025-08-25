import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import socketAuth, { connectSocket, disconnectSocket } from '@/services/socket';

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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize authentication state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Connect to socket
        connectSocket();
        
        // Check if user is already logged in
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token validity with server
          socketAuth.checkAuth(storedToken, (status) => {
            if (status.authenticated) {
              setUser(status.user);
            } else {
              // Token is invalid, clear auth state
              logout();
            }
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Cleanup socket connection on unmount
    return () => {
      disconnectSocket();
    };
  }, []);
  
  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with credentials:', credentials);
      
      // Direct API call instead of socket
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('Login API response:', data);
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setLoading(false);
        return data;
      } else {
        const errorMsg = data.message || 'Login failed';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  };
  
  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      return new Promise((resolve, reject) => {
        socketAuth.register(userData, {
          onSuccess: (response) => {
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            setLoading(false);
            resolve(response);
          },
          onError: (error) => {
            setError(error.message || 'Registration failed');
            setLoading(false);
            reject(error);
          }
        });
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    const userId = user?.id;
    
    // Clear auth state
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Notify server about logout
    if (userId) {
      socketAuth.logout(userId, () => {
        console.log('Logged out successfully');
      });
    }
    
    // Redirect to login page
    router.push('/auth/login');
  };
  
  // Subscribe to real-time user activity (for admin users)
  useEffect(() => {
    if (user?.role === 'admin') {
      const unsubscribe = socketAuth.subscribeToUserActivity((activity) => {
        console.log('User activity:', activity);
        // Handle user activity updates (e.g., show notifications)
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  
  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;