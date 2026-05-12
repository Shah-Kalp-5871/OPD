'use client';

import React from 'react';
import ReceptionSidebar from '@/views/partials/reception/ReceptionSidebar';
import ReceptionHeader from '@/views/partials/reception/ReceptionHeader';

interface ReceptionLayoutProps {
  children: React.ReactNode;
}

const ReceptionLayout: React.FC<ReceptionLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar */}
      <ReceptionSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 transition-all duration-300">
        {/* Sticky Header */}
        <ReceptionHeader />

        {/* Scrollable Page Content */}
        <main className="flex-1 p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
             {children}
          </div>
        </main>

        {/* Optional Footer */}
        <footer className="px-10 py-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
           <p className="text-[10px] font-bold uppercase tracking-widest">MedFlow Clinic Management System &copy; 2026</p>
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest cursor-pointer hover:underline">Support</span>
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest cursor-pointer hover:underline">Help Center</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default ReceptionLayout;
