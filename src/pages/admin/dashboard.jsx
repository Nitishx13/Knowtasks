import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import SuperAdminDashboard from '../dashboard/SuperAdminDashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if SuperAdmin is authenticated
    const isAuthenticated = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('superadmin_authenticated') : null;
    
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  return (
    <DashboardLayout>
      <SuperAdminDashboard />
    </DashboardLayout>
  );
};

export default AdminDashboard;
