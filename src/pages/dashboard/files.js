import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FilesPage from './FilesPage';

export default function Files() {
  return (
    <DashboardLayout>
      <FilesPage />
    </DashboardLayout>
  );
}