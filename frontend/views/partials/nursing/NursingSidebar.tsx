'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  PhoneCall, 
  UserCircle,
  Stethoscope,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

const NursingSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const menuItems = [
    { title: 'Dashboard', href: ROUTES.nursing.dashboard, icon: LayoutDashboard },
    { title: 'OPD Queue', href: ROUTES.nursing.queue, icon: Users },
    { title: 'Vitals Entry', href: ROUTES.nursing.vitals, icon: Activity },
    { title: 'Lab Reports', href: ROUTES.nursing.labReports, icon: FileText },
    { title: 'F/U Call Mgmt', href: ROUTES.nursing.followup, icon: PhoneCall },
    { title: 'My Profile', href: ROUTES.nursing.profile, icon: UserCircle },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col z-50 border-r border-slate-100 transition-all duration-300 shadow-sm">
      {/* Clinic Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
           <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-800 tracking-tighter leading-none uppercase">MedFlow</h1>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1.5 block">Nursing Panel</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname === `${item.href}/`;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-100" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100/50">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
              {user?.name?.substring(0, 2) || 'NS'}
           </div>
           <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-[10px] font-black text-slate-800 leading-none truncate">{user?.name || 'Nurse S. Sharma'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{user?.email || 'nursing@clinic.com'}</p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </div>
  );
};

export default NursingSidebar;
