import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SuperAdminAuthContext = createContext();

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error('useSuperAdminAuth must be used within SuperAdminAuthProvider');
  }
  return context;
};

export const SuperAdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const checkAuthStatus = () => {
    try {
      const authenticated = localStorage.getItem('superadmin_authenticated');
      const email = localStorage.getItem('superadmin_email');
      const loginTime = localStorage.getItem('superadmin_login_time');

      if (authenticated === 'true' && email && loginTime) {
        // Check if session is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setIsAuthenticated(true);
          setAdminData({
            email,
            loginTime,
            role: 'superadmin'
          });
        } else {
          // Session expired
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (email) => {
    localStorage.setItem('superadmin_authenticated', 'true');
    localStorage.setItem('superadmin_email', email);
    localStorage.setItem('superadmin_login_time', new Date().toISOString());
    
    setIsAuthenticated(true);
    setAdminData({
      email,
      loginTime: new Date().toISOString(),
      role: 'superadmin'
    });
  };

  const logout = () => {
    localStorage.removeItem('superadmin_authenticated');
    localStorage.removeItem('superadmin_email');
    localStorage.removeItem('superadmin_login_time');
    
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const value = {
    isAuthenticated,
    loading,
    adminData,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};
