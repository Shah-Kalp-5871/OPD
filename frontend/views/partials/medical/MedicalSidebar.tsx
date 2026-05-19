'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  RotateCcw, 
  Bell, 
  UserCircle,
  Pill,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

const MedicalSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const menuItems = [
    { title: 'Dashboard', href: ROUTES.medical.dashboard, icon: LayoutDashboard },
    { title: 'Dispensing Queue', href: ROUTES.medical.dispensing, icon: ClipboardList },
    { title: 'Stock Management', href: ROUTES.medical.stock, icon: Package },
    { title: 'Drug Returns', href: ROUTES.medical.returns, icon: RotateCcw },
    { title: 'Alerts', href: ROUTES.medical.alerts, icon: Bell },
    { title: 'My Profile', href: ROUTES.medical.profile, icon: UserCircle },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col z-50 transition-all duration-300">
      {/* Pharmacy Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
           <Pill className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-tighter leading-none uppercase">MedFlow</h1>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-1.5 block">Medical / Pharmacy</span>
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
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-100" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-700/50">
           <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[10px]">
              {user?.name?.substring(0, 2) || 'PM'}
           </div>
           <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-[10px] font-black text-white leading-none truncate">{user?.name || 'Pharm. A. Mehta'}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{user?.email || 'pharmacy@clinic.com'}</p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-850 hover:text-red-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </div>
  );
};

export default MedicalSidebar;
