import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MentorDashboard from '../dashboard/MentorDashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const MentorDashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if Mentor is authenticated
    const isAuthenticated = localStorage.getItem('isMentorAuthenticated');
    
    if (!isAuthenticated) {
      router.push('/mentor/login');
      return;
    }
  }, [router]);

  return (
    <DashboardLayout>
      <MentorDashboard />
    </DashboardLayout>
  );
};

export default MentorDashboardPage;
