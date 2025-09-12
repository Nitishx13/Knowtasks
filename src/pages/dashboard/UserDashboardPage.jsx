import React from 'react';
import UserDashboard from '../../components/dashboard/UserDashboard';

const UserDashboardPage = () => {
  // Prevent SSR issues by only rendering on client
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <UserDashboard />
    </div>
  );
};

export default UserDashboardPage;