'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  CalendarDays, 
  PhoneCall, 
  Wallet, 
  Pill, 
  BarChart3, 
  UserCircle,
  Activity,
  ChevronRight,
  Menu,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

const DoctorSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const menuItems = [
    { title: 'Dashboard', href: ROUTES.doctor.dashboard, icon: LayoutDashboard },
    { title: 'OPD Queue', href: ROUTES.doctor.queue, icon: Users },
    { title: 'Consultation', href: ROUTES.doctor.consultationComplaints, icon: Stethoscope },
    { title: 'Appointment Mgmt', href: ROUTES.doctor.appointments, icon: CalendarDays },
    { title: 'F/U Call List', href: ROUTES.doctor.followupCallList, icon: PhoneCall },
    { title: 'Billing View', href: ROUTES.doctor.billingView, icon: Wallet },
    { title: 'Pharmacy View', href: ROUTES.doctor.pharmacy, icon: Pill },
    { title: 'Reports', href: ROUTES.doctor.reports, icon: BarChart3 },
    { title: 'My Profile', href: ROUTES.doctor.profile, icon: UserCircle },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F172A] flex flex-col z-50 transition-all duration-300">
      {/* Clinic Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
           <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-tighter leading-none">MedFlow</h1>
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1 block">Doctor Panel</span>
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
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-slate-800/50 space-y-3">
        <div className="bg-slate-800/30 rounded-2xl p-4 flex items-center gap-3 border border-slate-800/50">
           <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 font-black text-xs">
              {user?.name?.substring(0, 2) || 'DR'}
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-white leading-none truncate">{user?.name || 'Dr. Sameer Khan'}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{user?.email || 'doctor@clinic.com'}</p>
           </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar;
