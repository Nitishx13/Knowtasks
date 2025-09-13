import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import UserQuizMaker from '../../components/dashboard/UserQuizMaker';

export default function QZMakerPage() {
  return (
    <MainLayout>
      <UserQuizMaker />
    </MainLayout>
  );
}