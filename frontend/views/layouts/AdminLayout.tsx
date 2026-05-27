'use client';

import React from 'react';
import TopNavbar from '@/components/ui/TopNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar role="admin" />

      {/* Main Content Wrapper */}
      <div className="flex flex-col min-h-screen transition-all duration-300">
        
        {/* Content Area - Scrollable */}
        <main className="flex-1 mt-16 p-4 md:p-8 overflow-y-auto custom-scrollbar scrollbar-stable">
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
