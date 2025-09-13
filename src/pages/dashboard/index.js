import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import EnhancedUserDashboard from '../../components/dashboard/EnhancedUserDashboard';

const DashboardPage = () => {
  return (
    <MainLayout>
      <EnhancedUserDashboard />
    </MainLayout>
  );
};

export default DashboardPage;
