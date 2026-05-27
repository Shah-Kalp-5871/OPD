'use client';

import React from 'react';
import TopNavbar from '@/components/ui/TopNavbar';

interface MedicalLayoutProps {
  children: React.ReactNode;
}

const MedicalLayout: React.FC<MedicalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <TopNavbar role="medical" />
      <div>
        
        <main className="mt-20 p-8 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MedicalLayout;
