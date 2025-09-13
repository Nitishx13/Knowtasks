import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import MobileNotesManager from '../../../components/dashboard/MobileNotesManager';

const NotesPage = () => {
  return (
    <MainLayout>
      <MobileNotesManager />
    </MainLayout>
  );
};

export default NotesPage;
