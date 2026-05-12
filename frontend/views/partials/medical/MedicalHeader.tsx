'use client';

import React from 'react';
import { Search, Bell, UserCircle, ChevronDown, FlaskConical, PackageCheck } from 'lucide-react';

const MedicalHeader = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-8 shadow-sm">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical / Pharmacy</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Dashboard</span>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search medicine, batch, or invoice..." 
            className="pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all w-64 shadow-inner"
          />
        </div>

        {/* Alerts */}
        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all group">
          <Bell className="w-5 h-5 group-hover:text-emerald-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="h-10 w-[1px] bg-slate-100" />
        
        <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            AM
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-black text-slate-800 leading-none">Pharm. A. Mehta</p>
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1.5">Profile ▼</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default MedicalHeader;
