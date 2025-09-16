import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MobileNotesManager from '../components/dashboard/MobileNotesManager';

export default function Notes() {
  return (
    <DashboardLayout>
      <MobileNotesManager />
    </DashboardLayout>
  );
}
