'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserPlus, 
  Search, 
  CalendarPlus, 
  Users, 
  CheckSquare, 
  Wallet, 
  FileSignature, 
  Upload, 
  UserCircle,
  Activity,
  ChevronRight
} from 'lucide-react';

const ReceptionSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Dashboard', href: '/reception/dashboard', icon: LayoutDashboard },
    { title: 'Register Patient', href: '/reception/register', icon: UserPlus },
    { title: 'Search Patient', href: '/reception/search', icon: Search },
    { title: 'Book Appointment', href: '/reception/appointments', icon: CalendarPlus },
    { title: 'OPD Queue', href: '/reception/queue', icon: Users },
    { title: 'Check-In', href: '/reception/checkin', icon: CheckSquare },
    { title: 'Billing', href: '/reception/billing', icon: Wallet },
    { title: 'Consent Form', href: '/reception/consent', icon: FileSignature },
    { title: 'Lab Upload', href: '/reception/lab-upload', icon: Upload },
    { title: 'My Profile', href: '/reception/profile', icon: UserCircle },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300">
      {/* Clinic Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
           <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-800 tracking-tighter leading-none">MedFlow</h1>
          <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest leading-none">Reception</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname === `${item.href}/`;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-teal-50 text-teal-700 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-black text-xs">
              JD
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-800 leading-none">Jane Doe</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Front Desk</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionSidebar;
