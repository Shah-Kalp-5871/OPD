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
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

const ReceptionSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const menuItems = [
    { title: 'Dashboard', href: ROUTES.reception.dashboard, icon: LayoutDashboard },
    { title: 'Register Patient', href: ROUTES.reception.register, icon: UserPlus },
    { title: 'Search Patient', href: ROUTES.reception.search, icon: Search },
    { title: 'Book Appointment', href: ROUTES.reception.appointments, icon: CalendarPlus },
    { title: 'OPD Queue', href: ROUTES.reception.queue, icon: Users },
    { title: 'Check-In', href: ROUTES.reception.checkin, icon: CheckSquare },
    { title: 'Billing', href: ROUTES.reception.billing, icon: Wallet },
    { title: 'My Profile', href: ROUTES.reception.myProfile, icon: UserCircle },
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
      <div className="p-6 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-black text-xs">
              {user?.name?.substring(0, 2) || 'RC'}
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-800 leading-none truncate">{user?.name || 'Jane Doe'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{user?.email || 'receptionist@medflow.com'}</p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all animate-pulse-subtle"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </div>
  );
};

export default ReceptionSidebar;
