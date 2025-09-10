import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardRouter from '../../components/dashboard/DashboardRouter';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardRouter />
    </DashboardLayout>
  );
};

export default Dashboard;
