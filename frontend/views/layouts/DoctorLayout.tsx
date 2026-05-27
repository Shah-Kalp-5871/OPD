'use client';

import React from 'react';
import TopNavbar from '@/components/ui/TopNavbar';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar role="doctor" />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>

        {/* Footer / Branding */}
        <footer className="p-8 text-center border-t border-slate-100 bg-white/50">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              MedFlow Clinical OS © 2026 — All Rights Reserved
           </p>
        </footer>
      </div>

      {/* Mobile Sidebar Overlay Trigger (Placeholder for future functionality) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
         <button className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
         </button>
      </div>
    </div>
  );
};

export default DoctorLayout;
