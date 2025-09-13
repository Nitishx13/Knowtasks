import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const MentorApplicationsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the integrated admin dashboard with mentor management section
    router.replace('/admin/dashboard?section=Mentor%20Management');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default MentorApplicationsPage;