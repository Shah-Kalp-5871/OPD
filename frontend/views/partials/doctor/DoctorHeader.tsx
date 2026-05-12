'use client';

import React from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Calendar,
  Clock
} from 'lucide-react';

const DoctorHeader = () => {
  return (
    <header className="sticky top-0 right-0 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 z-40">
      
      {/* BREADCRUMB / TITLE */}
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <span>Doctor</span>
            <span className="text-slate-200">/</span>
            <span className="text-blue-600">Dashboard – Today's OPD</span>
         </div>
      </div>

      {/* ACTIONS & PROFILE */}
      <div className="flex items-center gap-6">
         
         {/* DATE/TIME DISPLAY */}
         <div className="hidden xl:flex items-center gap-6 pr-6 border-r border-slate-100">
            <div className="flex items-center gap-2">
               <Calendar className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">13 April, 2026</span>
            </div>
            <div className="flex items-center gap-2">
               <Clock className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">09:30 AM</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* PROFILE DROPDOWN */}
            <div className="flex items-center gap-3 pl-3 ml-3 border-l border-slate-100 group cursor-pointer">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Dr. Sameer Khan</p>
                  <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">On Duty</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  SK
               </div>
               <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                  <ChevronDown className="w-3.5 h-3.5" />
               </div>
            </div>
         </div>

      </div>

    </header>
  );
};

export default DoctorHeader;
