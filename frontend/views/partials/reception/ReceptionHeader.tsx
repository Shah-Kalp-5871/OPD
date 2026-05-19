'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Settings, 
  ChevronDown, 
  HelpCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ReceptionHeader = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const displayName = user?.name || 'Jane Doe';
  const displayRole = user?.role || 'Receptionist';
  const avatar = user?.avatar;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  const initials = getInitials(displayName) || 'JD';

  // Simple breadcrumb logic based on pathname
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const mainSection = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Reception';
    const subSection = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].replace('-', ' ').slice(1) : 'Dashboard';
    
    return { mainSection, subSection };
  };

  const { mainSection, subSection } = getBreadcrumbs();

  return (
    <header className="sticky top-0 right-0 left-0 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-40 shadow-sm backdrop-blur-md bg-white/80">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{mainSection}</span>
        <span className="text-slate-200">/</span>
        <span className="text-[11px] font-black text-teal-700 uppercase tracking-[0.1em]">{subSection} – Today’s OPD</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-8">
        {/* Date & Time (Crucial for Reception) */}
        <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-slate-100">
           <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">13 April, 2026</span>
           </div>
           <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">10:45 AM</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="relative p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all border border-transparent hover:border-teal-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
           </button>
           
           <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all border border-transparent hover:border-teal-100">
              <HelpCircle className="w-4 h-4" />
           </button>

           <div className="flex items-center gap-3 pl-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{displayName}</p>
                 <p className="text-[8px] font-bold text-teal-600 uppercase tracking-widest mt-1">{displayRole}</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-center text-teal-600 font-black text-xs group-hover:scale-105 transition-transform overflow-hidden">
                 {avatar ? (
                   <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   initials
                 )}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default ReceptionHeader;
