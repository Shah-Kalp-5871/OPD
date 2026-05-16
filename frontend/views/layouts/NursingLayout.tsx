'use client';

import React from 'react';
import NursingSidebar from '@/views/partials/nursing/NursingSidebar';
import NursingHeader from '@/views/partials/nursing/NursingHeader';

interface NursingLayoutProps {
  children: React.ReactNode;
}

const NursingLayout: React.FC<NursingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Fixed Sidebar */}
      <NursingSidebar />

      {/* Main Content Wrapper */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <NursingHeader />

        {/* Scrollable Content Area */}
        <main className="mt-20 flex-1 p-8 overflow-y-auto custom-scrollbar scrollbar-stable">
          {children}
        </main>
        
        {/* Mobile Sidebar Overlay (Placeholder for future functionality) */}
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[45] hidden" />
      </div>
    </div>
  );
};

export default NursingLayout;
