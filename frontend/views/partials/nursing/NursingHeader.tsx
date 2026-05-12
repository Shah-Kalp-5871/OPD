'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Clock,
  Calendar
} from 'lucide-react';

const NursingHeader = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-8 shadow-sm">
      
      {/* Left Side: Breadcrumb style text */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <span>Nursing</span>
             <span className="text-slate-200">/</span>
             <span className="text-blue-600">Dashboard – Today's Overview</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                Shift: 08:00 AM - 04:00 PM
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Profile & Actions */}
      <div className="flex items-center gap-6">
        
        {/* Quick Search */}
        <div className="relative hidden lg:block">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search Patient..."
             className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 focus:bg-white transition-all w-48"
           />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-slate-50 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
               NS
            </div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Profile</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="px-5 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Nurse Sharma</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">S-0923 • OPD-NURSING</p>
               </div>
               <button className="w-full flex items-center gap-3 px-5 py-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <User className="w-4 h-4" /> My Profile
               </button>
               <button className="w-full flex items-center gap-3 px-5 py-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <Settings className="w-4 h-4" /> Settings
               </button>
               <div className="px-5 mt-2 pt-2 border-t border-slate-50">
                  <button className="w-full flex items-center gap-3 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:translate-x-1 transition-all">
                     <LogOut className="w-4 h-4" /> Sign Out
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NursingHeader;
