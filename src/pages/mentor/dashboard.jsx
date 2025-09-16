import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MentorDashboardSimple from './dashboard-simple';
import DashboardLayout from '../../components/layout/DashboardLayout';

const MentorDashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if Mentor is authenticated
    const isAuthenticated = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('isMentorAuthenticated') : null;
    
    if (!isAuthenticated) {
      router.push('/mentor/login');
      return;
    }
  }, [router]);

  return (
    <DashboardLayout>
      <MentorDashboardSimple />
    </DashboardLayout>
  );
};

export default MentorDashboardPage;
