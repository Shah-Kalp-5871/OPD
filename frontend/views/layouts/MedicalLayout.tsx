'use client';

import React from 'react';
import MedicalSidebar from '@/views/partials/medical/MedicalSidebar';
import MedicalHeader from '@/views/partials/medical/MedicalHeader';

interface MedicalLayoutProps {
  children: React.ReactNode;
}

const MedicalLayout: React.FC<MedicalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <MedicalSidebar />
      <div className="pl-64">
        <MedicalHeader />
        <main className="pt-20 p-8 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MedicalLayout;
