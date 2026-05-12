'use client';

import React from 'react';
import { ChevronDown, Bell, Search, UserCircle, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const AdminHeader = ({ onMenuToggle }: AdminHeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm shadow-slate-100/50 transition-all duration-300">
      {/* Left Section: Menu Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium">Admin</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold tracking-tight">Dashboard</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Placeholder */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-400">
          <Search className="w-4 h-4" />
          <span className="text-xs">Search anything...</span>
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none">John Doe</p>
            <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tighter">System Admin</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-blue-300 transition-colors">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
