import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles = [], fallbackPath = '/dashboard' }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    router.push('/login');
    return null;
  }

  // Check if user has required role
  const userRole = user.role || 'student'; // Default to student role
  const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasPermission) {
    router.push(fallbackPath);
    return null;
  }

  return children;
};

export default RoleBasedRoute;
