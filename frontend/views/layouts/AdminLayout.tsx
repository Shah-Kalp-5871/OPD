'use client';

import React from 'react';
import AdminSidebar from '@/views/partials/admin/AdminSidebar';
import AdminHeader from '@/views/partials/admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Fixed Left */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <AdminSidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        {/* Header - Fixed Top */}
        <AdminHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

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
