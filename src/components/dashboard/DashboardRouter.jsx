import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import SuperAdminDashboard from '../../pages/dashboard/SuperAdminDashboard';
import MentorDashboard from '../../pages/mentor/dashboard';

const DashboardRouter = () => {
  const { user } = useAuth();
  
  // Get user role from user object or default to 'student'
  const userRole = user?.role || user?.publicMetadata?.role || 'student';
  
  // Route to appropriate dashboard based on role
  switch (userRole) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'mentor':
      return <MentorDashboard />;
    case 'student':
    default:
      return <DashboardPage />;
  }
};

export default DashboardRouter;
