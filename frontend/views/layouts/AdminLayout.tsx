'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role="admin" />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64">
        
        {/* Content Area - Scrollable */}
        <main className="flex-1 mt-16 lg:mt-0 p-4 md:p-8 overflow-y-auto custom-scrollbar scrollbar-stable">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer Placeholder */}
        <footer className="px-8 py-4 bg-white border-t border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 MedFlow OPD Management System | Premium Enterprise Edition
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
