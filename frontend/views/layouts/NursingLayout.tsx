'use client';

import React from 'react';
import TopNavbar from '@/components/ui/TopNavbar';
import ChatWidget from '@/components/chat/ChatWidget';

interface NursingLayoutProps {
  children: React.ReactNode;
}

const NursingLayout: React.FC<NursingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar role="nursing" />

      {/* Main Content Wrapper */}
      <div className="flex flex-col min-h-screen">
        
        {/* Scrollable Content Area */}
        <main className="mt-20 flex-1 p-8 overflow-y-auto custom-scrollbar scrollbar-stable">
          {children}
        </main>
        
        {/* Mobile Sidebar Overlay (Placeholder for future functionality) */}
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[45] hidden" />
      </div>
      <ChatWidget />
    </div>
  );
};

export default NursingLayout;
